import { BookingFormData } from "./types";

// ─── Steps Config ─────────────────────────────────────────────────────────────

export const STEPS = [
  { id: 1, label: "Your Info", short: "01" },
  { id: 2, label: "Car Details", short: "02" },
  { id: 3, label: "Service", short: "03" },
  { id: 4, label: "Review", short: "04" },
];

export const STEP_SUBTITLES: Record<number, string> = {
  1: "Tell us who you are and where you're located",
  2: "Enter your vehicle details",
  3: "Choose a branch, services, and pick an available date",
  4: "Review your booking before submitting",
};

// ─── Initial Form Data ────────────────────────────────────────────────────────

export const INITIAL_FORM_DATA: BookingFormData = {
  customerName: "",
  phoneNumber: "",
  address: "",
  carMake: "",
  carModel: "",
  carYear: new Date().getFullYear(),
  branchId: "",
  serviceIds: [],
  slotId: "",
  notes: "",
};

// ─── Car Year Range ───────────────────────────────────────────────────────────

export const CAR_YEAR_MIN = 1980;
export const CAR_YEAR_MAX = new Date().getFullYear() + 1;
