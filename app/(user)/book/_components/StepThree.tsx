"use client";

import { FieldError, FieldLabel, Textarea } from "./FormFields";
import { StepThreeProps } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSlotDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
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

export default function StepThree({
  data,
  errors,
  update,
  branches,
  services,
  slots,
}: StepThreeProps) {
  // Slots filtered to the selected branch
  const branchSlots = data.branchId
    ? slots.filter((s) => s.branchId === data.branchId)
    : [];

  // Toggle a service in/out of the serviceIds array
  function toggleService(id: string) {
    const current = data.serviceIds ?? [];
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    update("serviceIds", next);
  }

  // When branch changes, clear the slot selection (it may no longer be valid)
  function selectBranch(id: string) {
    update("branchId", id);
    if (data.slotId) update("slotId", "");
  }

  return (
    <div className="space-y-6">
      {/* ── Branch Selection ────────────────────────────────────────────────── */}
      <div>
        <FieldLabel required>Select Branch</FieldLabel>
        {branches.length === 0 ? (
          <p className="text-xs font-mono text-zinc-500 mt-2">
            No branches available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {branches.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => selectBranch(b.id)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 shadow-sm ${
                  data.branchId === b.id
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-sm font-semibold ${
                      data.branchId === b.id
                        ? "text-teal-700"
                        : "text-slate-800"
                    }`}
                  >
                    {b.name}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {b.address}
                  </span>
                </div>
                {/* Checkmark when selected */}
                {data.branchId === b.id && (
                  <span className="shrink-0 ml-3 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
        <FieldError message={errors.branchId} />
      </div>

      {/* ── Service Selection (multi) ────────────────────────────────────────── */}
      <div>
        <FieldLabel required>Select Services</FieldLabel>
        <p className="text-xs text-slate-400 mb-2 -mt-1">
          You can choose more than one.
        </p>
        {services.length === 0 ? (
          <p className="text-xs font-mono text-zinc-500 mt-2">
            No services available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {services.map((s) => {
              const isSelected = (data.serviceIds ?? []).includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 shadow-sm ${
                    isSelected
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox indicator */}
                    <span
                      className={`shrink-0 w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-teal-500 border-teal-500"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "text-teal-700" : "text-slate-800"
                        }`}
                      >
                        {s.name}
                      </span>
                      <span className="text-xs font-medium text-slate-500 line-clamp-1">
                        {s.description}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ml-4 shrink-0 ${
                      isSelected ? "text-teal-700" : "text-slate-600"
                    }`}
                  >
                    {formatPrice(s.basePrice)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <FieldError message={errors.serviceIds} />
      </div>

      {/* ── Slot Selection (filtered by branch) ─────────────────────────────── */}
      <div>
        <FieldLabel required>Available Date</FieldLabel>
        {!data.branchId ? (
          <p className="text-xs font-mono text-zinc-500 mt-2">
            Select a branch above to see available dates.
          </p>
        ) : branchSlots.length === 0 ? (
          <p className="text-xs font-mono text-zinc-500 mt-2">
            No available slots for this branch. Please check back later.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {branchSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => update("slotId", slot.id)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border cursor-pointer text-sm transition-all duration-200 shadow-sm ${
                  data.slotId === slot.id
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="text-xs font-semibold tracking-wide uppercase text-center">
                  {formatSlotDate(slot.date)}
                </span>
              </button>
            ))}
          </div>
        )}
        <FieldError message={errors.slotId} />
      </div>

      {/* ── Notes ───────────────────────────────────────────────────────────── */}
      <div>
        <FieldLabel>Notes (Optional)</FieldLabel>
        <Textarea
          value={data.notes ?? ""}
          onChange={(v) => update("notes", v)}
          placeholder="Any specific concerns or details about your car…"
          maxLength={500}
          rows={3}
          error={errors.notes}
        />
      </div>
    </div>
  );
}
