"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RequestSummary = {
  id: string;
  status: string;
  customerName: string;
  carMake: string;
  carModel: string;
  carYear: number;
  createdAt: string;
  branch: { name: string };
  slot: { date: string } | null;
  services: { service: { name: string } }[];
  quote: { price: number; durationDays: number } | null;
};

export type RequestDetail = RequestSummary & {
  phoneNumber: string;
  address: string;
  notes: string | null;
  quote: {
    id: string;
    price: number;
    durationDays: number;
    notes: string | null;
  } | null;
};

// ─── getUserRequests ──────────────────────────────────────────────────────────

export async function getUserRequests(): Promise<RequestSummary[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const requests = await prisma.request.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      customerName: true,
      carMake: true,
      carModel: true,
      carYear: true,
      createdAt: true,
      branch: { select: { name: true } },
      slot: { select: { date: true } },
      services: {
        select: { service: { select: { name: true } } },
      },
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

// ─── getRequestDetail ─────────────────────────────────────────────────────────

export async function getRequestDetail(
  id: string,
): Promise<RequestDetail | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const request = await prisma.request.findFirst({
    where: { id, userId: session.user.id }, // user can only see their own
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
      branch: { select: { name: true } },
      slot: { select: { date: true } },
      services: {
        select: { service: { select: { name: true } } },
      },
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

// ─── confirmRequest ───────────────────────────────────────────────────────────

export async function confirmRequest(
  requestId: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, error: "Not authenticated." };

  try {
    const request = await prisma.request.findFirst({
      where: { id: requestId, userId: session.user.id },
    });

    if (!request) return { success: false, error: "Request not found." };
    if (request.status !== "QUOTED")
      return { success: false, error: "Request is not in a quotable state." };

    await prisma.request.update({
      where: { id: requestId },
      data: { status: "CONFIRMED" },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong." };
  }
}

// ─── cancelRequest ────────────────────────────────────────────────────────────

export async function cancelRequest(
  requestId: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, error: "Not authenticated." };

  try {
    const request = await prisma.request.findFirst({
      where: { id: requestId, userId: session.user.id },
    });

    if (!request) return { success: false, error: "Request not found." };

    const cancellable: string[] = ["PENDING_REVIEW", "QUOTED"];
    if (!cancellable.includes(request.status as string))
      return {
        success: false,
        error: "This request can no longer be cancelled.",
      };

    await prisma.$transaction([
      prisma.request.update({
        where: { id: requestId },
        data: { status: "CANCELLED" },
      }),
      // Free the slot back up if one was assigned
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

// ─── deleteRequest ────────────────────────────────────────────────────────────
// Users can only delete COMPLETED or CANCELLED requests (closed ones).

export async function deleteRequest(
  requestId: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, error: "Not authenticated." };

  try {
    const request = await prisma.request.findFirst({
      where: { id: requestId, userId: session.user.id },
    });

    if (!request) return { success: false, error: "Request not found." };

    const deletable = ["COMPLETED", "CANCELLED"];
    if (!deletable.includes(request.status as string))
      return {
        success: false,
        error: "Only completed or cancelled requests can be deleted.",
      };

    await prisma.request.delete({ where: { id: requestId } });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong." };
  }
}
