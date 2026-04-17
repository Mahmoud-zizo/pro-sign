"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeRequest } from "../../../actions";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function CompleteButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setLoading(true);
    setError("");
    const result = await completeRequest(requestId);
    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <>
      {error && (
        <p className="text-xs font-medium text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2 mb-2">
          {error}
        </p>
      )}

      <button
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="w-full py-3.5 bg-[#24AE7C] text-white text-[14px] font-bold
          rounded-xl shadow-lg hover:bg-[#24AE7C]/90 active:scale-[0.98]
          transition-all duration-200 cursor-pointer"
      >
        ✓ Mark as Completed
      </button>

      <ConfirmDialog
        open={open}
        theme="dark"
        variant="success"
        title="Mark as completed?"
        description="This will mark the request as completed. The customer will see their service as done."
        confirmLabel="Yes, mark done"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
