"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "./_components/types";
import type {
  ActionResult,
  BranchOption,
  ServiceOption,
  SlotOption,
} from "./_components/types";

// ─── getFormData ──────────────────────────────────────────────────────────────
// Called server-side in the page component to hydrate the booking form.
// Returns active services, all branches, and all un-booked slots.

export async function getFormData(): Promise<{
  branches: BranchOption[];
  services: ServiceOption[];
  slots: SlotOption[];
}> {
  const [branches, services, slots] = await Promise.all([
    prisma.branch.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, address: true },
    }),

    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, description: true, basePrice: true },
    }),

    prisma.availableSlot.findMany({
      where: { isBooked: false },
      orderBy: { date: "asc" },
      select: { id: true, date: true, branchId: true },
    }),
  ]);

  return {
    branches,
    services,
    // Convert Date -> ISO string so the client can consume it safely
    slots: slots.map((s) => ({ ...s, date: s.date.toISOString() })),
  };
}

// ─── createRequest ────────────────────────────────────────────────────────────
// Only callable by authenticated users with role === "USER".
// Validates, verifies all relations, then writes in a single transaction.

export async function createRequest(raw: unknown): Promise<ActionResult> {
  // 1. Auth guard — must be a logged-in USER
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to book a service.",
    };
  }
  if (session.user.role !== "USER") {
    return {
      success: false,
      error: "Only user accounts can submit booking requests.",
    };
  }

  const userId = session.user.id;

  // 2. Validate input with Zod
  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Invalid form data." };
  }

  const { branchId, serviceIds, slotId, ...rest } = parsed.data;

  // 3. Prisma transaction — all checks and writes are atomic
  try {
    const request = await prisma.$transaction(async (tx) => {
      // 3a. Verify branch exists
      const branch = await tx.branch.findUnique({ where: { id: branchId } });
      if (!branch) throw new Error("Selected branch is no longer available.");

      // 3b. Verify all selected services exist and are active
      const services = await tx.service.findMany({
        where: { id: { in: serviceIds }, isActive: true },
        select: { id: true },
      });
      if (services.length !== serviceIds.length) {
        throw new Error(
          "One or more selected services are no longer available.",
        );
      }

      // 3c. Lock & verify slot — must belong to branch and still be free
      const slot = await tx.availableSlot.findUnique({ where: { id: slotId } });
      if (!slot) throw new Error("Selected date slot was not found.");
      if (slot.branchId !== branchId) {
        throw new Error("Selected date does not belong to the chosen branch.");
      }
      if (slot.isBooked) {
        throw new Error(
          "This slot was just booked by someone else. Please choose another date.",
        );
      }

      // 3d. Create the request record
      const req = await tx.request.create({
        data: {
          userId,
          branchId,
          slotId,
          customerName: rest.customerName,
          phoneNumber: rest.phoneNumber,
          address: rest.address,
          carMake: rest.carMake,
          carModel: rest.carModel,
          carYear: rest.carYear,
          notes: rest.notes ?? null,
          status: "PENDING_REVIEW",
        },
      });

      // 3e. Link each selected service to the request
      await tx.requestService.createMany({
        data: serviceIds.map((serviceId) => ({
          requestId: req.id,
          serviceId,
        })),
      });

      // 3f. Mark the slot as booked so no one else can take it
      await tx.availableSlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return req;
    });

    return { success: true, requestId: request.id };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong. Please try again.";
    return { success: false, error: message };
  }
}
