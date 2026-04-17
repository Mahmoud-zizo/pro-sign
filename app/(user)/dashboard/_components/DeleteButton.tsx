"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteRequest } from "../dashboardAction";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function DeleteButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setLoading(true);
    setError("");
    const result = await deleteRequest(requestId);
    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault(); // prevent Link navigation
          e.stopPropagation();
          setError("");
          setOpen(true);
        }}
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center
          text-slate-300 hover:text-red-500 hover:bg-red-50
          transition-all duration-150"
        title="Delete request"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      <ConfirmDialog
        theme="light"
        open={open}
        variant="danger"
        title="Delete this booking?"
        description="This will permanently remove the record. This action cannot be undone."
        confirmLabel="Yes, delete it"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />

      {error && <p className="text-xs text-red-500 mt-1 absolute">{error}</p>}
    </>
  );
}
