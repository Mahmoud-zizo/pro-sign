"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeRequest, cancelRequestByAdmin } from "../actions";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Props {
  requestId: string;
  status: string;
}

type Dialog = "done" | "cancel" | null;

export default function AdminRowActions({ requestId, status }: Props) {
  const router = useRouter();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canDone = status === "CONFIRMED";
  const canCancel = ["PENDING_REVIEW", "QUOTED", "CONFIRMED"].includes(status);

  async function handleConfirm() {
    setLoading(true);
    setError("");

    const result =
      dialog === "done"
        ? await completeRequest(requestId)
        : await cancelRequestByAdmin(requestId);

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
      <div className="flex items-center gap-3">
        {canDone && (
          <button
            onClick={() => {
              setError("");
              setDialog("done");
            }}
            className="text-[13px] font-medium text-[#24AE7C] hover:text-[#24AE7C]/80 transition-colors bg-transparent p-0 cursor-pointer"
          >
            Done
          </button>
        )}

        {canCancel && (
          <button
            onClick={() => {
              setError("");
              setDialog("cancel");
            }}
            className="text-[13px] font-medium text-white hover:text-white/80 transition-colors bg-transparent p-0 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      <ConfirmDialog
        open={dialog === "done"}
        theme="dark"
        variant="success"
        title="Mark as Completed?"
        description="This will mark the request as completed and notify the customer. This action cannot be undone."
        confirmLabel="Yes, mark done"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === "cancel"}
        theme="dark"
        variant="danger"
        title="Cancel this request?"
        description="The slot will be freed and the customer will see the request as cancelled. This cannot be undone."
        confirmLabel="Yes, cancel it"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </>
  );
}
