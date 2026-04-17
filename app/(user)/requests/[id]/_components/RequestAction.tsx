"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  confirmRequest,
  cancelRequest,
} from "../../../dashboard/dashboardAction";
import ConfirmDialog from "@/components/ConfirmDialog";

type Dialog = "confirm" | "cancel" | null;

interface Props {
  requestId: string;
  status: string;
}

export default function RequestActions({ requestId, status }: Props) {
  const router = useRouter();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canConfirm = status === "QUOTED";
  const canCancel = ["PENDING_REVIEW", "QUOTED"].includes(status);

  async function handleConfirm() {
    setLoading(true);
    setError("");

    const result =
      dialog === "confirm"
        ? await confirmRequest(requestId)
        : await cancelRequest(requestId);

    if (result.success) {
      setDialog(null);
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <>
      <div className="mt-4 space-y-2">
        {error && (
          <p className="text-xs font-medium text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          {canConfirm && (
            <button
              onClick={() => {
                setError("");
                setDialog("confirm");
              }}
              className="flex-1 py-3 bg-linear-to-r from-teal-500 to-blue-600 text-white text-sm font-bold
                rounded-xl shadow-md shadow-teal-500/20 hover:opacity-90 active:scale-[0.98]
                transition-all duration-200"
            >
              ✓ Confirm Appointment
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => {
                setError("");
                setDialog("cancel");
              }}
              className={`py-3 bg-white border-2 border-slate-200 text-slate-500 text-sm font-bold
                rounded-xl hover:border-red-200 hover:text-red-500 hover:bg-red-50
                active:scale-[0.98] transition-all duration-200
                ${canConfirm ? "px-5" : "flex-1"}`}
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Confirm appointment dialog */}
      <ConfirmDialog
        open={dialog === "confirm"}
        theme="light"
        variant="success"
        title="Confirm your appointment?"
        description="You're confirming this booking. Our team will prepare everything for your scheduled date."
        confirmLabel="Yes, confirm it"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      {/* Cancel booking dialog */}
      <ConfirmDialog
        open={dialog === "cancel"}
        theme="light"
        variant="danger"
        title="Cancel this booking?"
        description="Your appointment slot will be released. You can book again anytime."
        confirmLabel="Yes, cancel it"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />
    </>
  );
}
