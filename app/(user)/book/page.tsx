import { getFormData } from "./bookAction";
import BookingForm from "./_components/BookingForm";

// ─── /book page ───────────────────────────────────────────────────────────────
// Server component — loads data server-side, renders the client form.
// Auth is disabled for now; add the guard back when NextAuth is configured.

export default async function BookPage() {
  const { branches, services, slots } = await getFormData();

  return <BookingForm branches={branches} services={services} slots={slots} />;
}
