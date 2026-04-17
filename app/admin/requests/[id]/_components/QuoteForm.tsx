"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuote } from "../../../actions";

interface Props {
  requestId: string;
  existing?: { price: number; durationDays: number; notes?: string | null };
}

export default function QuoteForm({ requestId, existing }: Props) {
  const router = useRouter();
  const [price, setPrice] = useState(existing?.price?.toString() ?? "");
  const [days, setDays] = useState(existing?.durationDays?.toString() ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccess(false);
    setLoading(true);

    const result = await createQuote(requestId, {
      price: parseFloat(price),
      durationDays: parseInt(days, 10),
      notes: notes.trim() || undefined,
    });

    if (result.success) {
      setSuccess(true);
      router.refresh();
    } else {
      setError(result.error ?? "Failed to send quote.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label className="block text-[13px] font-semibold text-slate-400 mb-1.5">
            Price (EGP) <span className="text-[#F24E43]">*</span>
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 1500"
            min={0}
            className="w-full bg-[#131619] border border-white/4 rounded-xl px-4 py-3 text-[14px] text-white
              placeholder:text-slate-600 focus:outline-none focus:border-[#24AE7C] focus:ring-2 focus:ring-[#24AE7C]/20
              transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-[13px] font-semibold text-slate-400 mb-1.5">
            Duration (days) <span className="text-[#F24E43]">*</span>
          </label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="e.g. 2"
            min={1}
            className="w-full bg-[#131619] border border-white/4 rounded-xl px-4 py-3 text-[14px] text-white
              placeholder:text-slate-600 focus:outline-none focus:border-[#24AE7C] focus:ring-2 focus:ring-[#24AE7C]/20
              transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-400 mb-1.5">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any details for the customer…"
          rows={3}
          maxLength={500}
          className="w-full bg-[#131619] border border-white/4 rounded-xl px-4 py-3 text-[14px] text-white
            placeholder:text-slate-600 focus:outline-none focus:border-[#24AE7C] focus:ring-2 focus:ring-[#24AE7C]/20
            transition-all resize-none"
        />
      </div>

      {error && (
        <p className="text-[13px] font-medium text-[#F24E43] bg-[#F24E43]/10 border border-transparent rounded-lg px-4 py-3 text-center">
          {error}
        </p>
      )}
      {success && (
        <p className="text-[13px] font-medium text-[#24AE7C] bg-[#24AE7C]/10 border border-transparent rounded-lg px-4 py-3 text-center">
          ✓ Quote sent successfully. Customer has been notified.
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !price || !days}
        className="w-full py-3.5 bg-[#24AE7C] text-white text-[14px] font-bold
          rounded-xl shadow-lg hover:bg-[#24AE7C]/90 active:scale-[0.98]
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading
          ? "Sending…"
          : existing
            ? "Update Quote →"
            : "Send Quote to Customer →"}
      </button>
    </div>
  );
}
