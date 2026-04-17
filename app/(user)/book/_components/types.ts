import { z } from "zod";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

export const bookingSchema = z.object({
  // Step 1 — Customer Info (snapshot)
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Max 80 characters"),
  phoneNumber: z
    .string()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^[+\d\s\-()]+$/, "Invalid phone number format"),
  address: z
    .string()
    .min(5, "Address is too short")
    .max(200, "Max 200 characters"),

  // Step 2 — Car Info
  carMake: z
    .string()
    .min(1, "Car make is required")
    .max(50, "Max 50 characters"),
  carModel: z
    .string()
    .min(1, "Car model is required")
    .max(50, "Max 50 characters"),
  carYear: z
    .number()
    .int("Year must be a whole number")
    .min(1980, "Year must be 1980 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),

  // Step 3 — Branch + Services + Slot + Notes
  branchId: z.string().min(1, "Please select a branch"),
  serviceIds: z.array(z.string()).min(1, "Please select at least one service"),
  slotId: z.string().min(1, "Please select an available date"),
  notes: z.string().max(500, "Max 500 characters").optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// ─── Step Error Map ───────────────────────────────────────────────────────────

export interface StepErrors {
  [key: string]: string;
}

// ─── Step Props ───────────────────────────────────────────────────────────────

export interface StepProps {
  data: BookingFormData;
  update: (key: keyof BookingFormData, value: unknown) => void;
  errors: StepErrors;
}

// ─── Remote Data Types ────────────────────────────────────────────────────────

export interface BranchOption {
  id: string;
  name: string;
  address: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

export interface SlotOption {
  id: string;
  date: string; // ISO string
  branchId: string; // so client can filter by selected branch
}

export interface StepThreeProps extends StepProps {
  branches: BranchOption[];
  services: ServiceOption[];
  slots: SlotOption[];
}

// ─── Server Action Result ─────────────────────────────────────────────────────

export type ActionResult =
  | { success: true; requestId: string }
  | { success: false; error: string };
