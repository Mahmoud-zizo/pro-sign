"use client";

import {
  BranchOption,
  BookingFormData,
  ServiceOption,
  SlotOption,
} from "./types";

// ─── Row ──────────────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-500 uppercase shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-800 text-right wrap-break-words max-w-[60%]">
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-bold tracking-wider text-teal-600 uppercase mb-2">
        {title}
      </p>
      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 divide-y divide-slate-100 shadow-sm">
        {children}
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface StepFourProps {
  data: BookingFormData;
  branches: BranchOption[];
  services: ServiceOption[];
  slots: SlotOption[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSlotDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StepFour({
  data,
  branches,
  services,
  slots,
}: StepFourProps) {
  const branch = branches.find((b) => b.id === data.branchId);
  const slot = slots.find((s) => s.id === data.slotId);
  const selectedServices = services.filter((s) =>
    (data.serviceIds ?? []).includes(s.id),
  );
  const totalBase = selectedServices.reduce((sum, s) => sum + s.basePrice, 0);

  return (
    <div className="space-y-5">
      {/* ── Your Info ─────────────────────────────────────────────────────── */}
      <ReviewSection title="Your Info">
        <ReviewRow label="Name" value={data.customerName} />
        <ReviewRow label="Phone" value={data.phoneNumber} />
        <ReviewRow label="Address" value={data.address} />
      </ReviewSection>

      {/* ── Vehicle ───────────────────────────────────────────────────────── */}
      <ReviewSection title="Vehicle">
        <ReviewRow label="Make" value={data.carMake} />
        <ReviewRow label="Model" value={data.carModel} />
        <ReviewRow label="Year" value={String(data.carYear)} />
      </ReviewSection>

      {/* ── Branch & Date ─────────────────────────────────────────────────── */}
      <ReviewSection title="Branch & Date">
        <ReviewRow
          label="Branch"
          value={branch ? `${branch.name} — ${branch.address}` : "—"}
        />
        <ReviewRow
          label="Date"
          value={slot ? formatSlotDate(slot.date) : "—"}
        />
      </ReviewSection>

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <ReviewSection title="Services">
        {selectedServices.length === 0 ? (
          <div className="py-3">
            <span className="text-sm text-slate-400">No services selected</span>
          </div>
        ) : (
          <>
            {selectedServices.map((s) => (
              <ReviewRow
                key={s.id}
                label={s.name}
                value={formatPrice(s.basePrice)}
              />
            ))}
            {/* Base total */}
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-xs font-bold text-slate-700 uppercase">
                Est. Total
              </span>
              <span className="text-sm font-bold text-teal-700">
                {formatPrice(totalBase)}
              </span>
            </div>
          </>
        )}
      </ReviewSection>

      {/* ── Notes ─────────────────────────────────────────────────────────── */}
      {data.notes && (
        <ReviewSection title="Notes">
          <ReviewRow label="Notes" value={data.notes} />
        </ReviewSection>
      )}

      {/* ── Notice ────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 bg-teal-50 border border-teal-100 rounded-xl shadow-sm">
        <span className="text-teal-500 mt-0.5 shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <p className="text-xs font-medium text-slate-600 leading-relaxed">
          Once submitted, your booking will be reviewed by our team. You will be
          contacted to confirm final pricing and appointment details.
        </p>
      </div>
    </div>
  );
}
