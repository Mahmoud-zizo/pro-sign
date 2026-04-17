"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ─── Auth guard helper ────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized.");
  }
  return session;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdminRequestSummary = {
  id: string;
  status: string;
  customerName: string;
  phoneNumber: string;
  carMake: string;
  carModel: string;
  carYear: number;
  createdAt: string;
  branch: { name: string };
  slot: { date: string } | null;
  services: { service: { name: string } }[];
  quote: { price: number; durationDays: number } | null;
};

export type AdminRequestDetail = AdminRequestSummary & {
  address: string;
  notes: string | null;
  user: { name: string | null; email: string };
  quote: {
    id: string;
    price: number;
    durationDays: number;
    notes: string | null;
  } | null;
};

// ─── getAllRequests ───────────────────────────────────────────────────────────

export async function getAllRequests(): Promise<AdminRequestSummary[]> {
  await requireAdmin();

  const requests = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      customerName: true,
      phoneNumber: true,
      carMake: true,
      carModel: true,
      carYear: true,
      createdAt: true,
      branch: { select: { name: true } },
      slot: { select: { date: true } },
      services: { select: { service: { select: { name: true } } } },
      quote: { select: { price: true, durationDays: true } },
    },
  });

  return requests.map((r) => ({
    ...r,
    status: r.status as string,
    createdAt: r.createdAt.toISOString(),
    slot: r.slot ? { date: r.slot.date.toISOString() } : null,
  }));
}

// ─── getAdminRequestDetail ────────────────────────────────────────────────────

export async function getAdminRequestDetail(
  id: string,
): Promise<AdminRequestDetail | null> {
  await requireAdmin();

  const request = await prisma.request.findFirst({
    where: { id },
    select: {
      id: true,
      status: true,
      customerName: true,
      phoneNumber: true,
      address: true,
      carMake: true,
      carModel: true,
      carYear: true,
      notes: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
      branch: { select: { name: true } },
      slot: { select: { date: true } },
      services: { select: { service: { select: { name: true } } } },
      quote: {
        select: { id: true, price: true, durationDays: true, notes: true },
      },
    },
  });

  if (!request) return null;

  return {
    ...request,
    status: request.status as string,
    createdAt: request.createdAt.toISOString(),
    slot: request.slot ? { date: request.slot.date.toISOString() } : null,
  };
}

// ─── createQuote ──────────────────────────────────────────────────────────────

const quoteSchema = z.object({
  price: z.number().positive("Price must be positive"),
  durationDays: z.number().int().positive("Duration must be at least 1 day"),
  notes: z.string().max(500).optional(),
});

export async function createQuote(
  requestId: string,
  raw: unknown,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    await prisma.$transaction([
      // Upsert so re-submitting the form updates the existing quote
      prisma.quote.upsert({
        where: { requestId },
        update: { ...parsed.data },
        create: { requestId, ...parsed.data },
      }),
      prisma.request.update({
        where: { id: requestId },
        data: { status: "QUOTED" },
      }),
    ]);

    return { success: true };
  } catch {
    return { success: false, error: "Failed to create quote." };
  }
}

// ─── completeRequest ──────────────────────────────────────────────────────────

export async function completeRequest(
  requestId: string,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
    });
    if (!request) return { success: false, error: "Request not found." };
    if (request.status !== "CONFIRMED")
      return {
        success: false,
        error: "Request must be confirmed before completing.",
      };

    await prisma.request.update({
      where: { id: requestId },
      data: { status: "COMPLETED" },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong." };
  }
}

export async function cancelRequestByAdmin(
  requestId: string,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
    });
    if (!request) return { success: false, error: "Request not found." };

    const cancellable = ["PENDING_REVIEW", "QUOTED", "CONFIRMED"];
    if (!cancellable.includes(request.status as string))
      return {
        success: false,
        error: "This request cannot be cancelled at this stage.",
      };

    await prisma.$transaction([
      prisma.request.update({
        where: { id: requestId },
        data: { status: "CANCELLED" },
      }),
      // Free the slot back up
      ...(request.slotId
        ? [
            prisma.availableSlot.update({
              where: { id: request.slotId },
              data: { isBooked: false },
            }),
          ]
        : []),
    ]);

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong." };
  }
}

// ─── getBranches ──────────────────────────────────────────────────────────────

export async function getBranches(): Promise<{ id: string; name: string }[]> {
  await requireAdmin();
  return prisma.branch.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
