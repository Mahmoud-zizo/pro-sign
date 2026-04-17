import { BookingFormData, StepErrors } from "./types";
import { bookingSchema } from "./types";

// ─── validateStep ─────────────────────────────────────────────────────────────
// Validates only the fields relevant to the given step.

const STEP_FIELDS: Record<number, (keyof BookingFormData)[]> = {
  1: ["customerName", "phoneNumber", "address"],
  2: ["carMake", "carModel", "carYear"],
  3: ["branchId", "serviceIds", "slotId"],
};

export function validateStep(step: number, data: BookingFormData): StepErrors {
  const fields = STEP_FIELDS[step];
  if (!fields) return {};

  const partial = Object.fromEntries(
    fields.map((f) => [f, data[f]]),
  ) as Partial<BookingFormData>;

  const partialSchema = bookingSchema.pick(
    Object.fromEntries(fields.map((f) => [f, true])) as Record<
      keyof BookingFormData,
      true
    >,
  );

  const result = partialSchema.safeParse(partial);
  if (result.success) return {};

  const errors: StepErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as string;
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
