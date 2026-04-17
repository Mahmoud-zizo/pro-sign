"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "success";
  theme?: "light" | "dark";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Go back",
  variant = "danger",
  theme = "light",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const panel =
    theme === "dark"
      ? "bg-[#161a1f] border border-white/10"
      : "bg-white border border-slate-100";

  const heading = theme === "dark" ? "text-white" : "text-slate-900";
  const body = theme === "dark" ? "text-slate-400" : "text-slate-500";

  const cancelBtn =
    theme === "dark"
      ? "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
      : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800";

  // ── Variant tokens ──────────────────────────────────────────────────────────
  const confirmBtn =
    variant === "danger"
      ? "bg-rose-500 hover:bg-rose-400 shadow-lg shadow-rose-500/20 text-white"
      : "bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/20 text-white";

  const iconBg =
    variant === "danger"
      ? "bg-rose-500/10 text-rose-400"
      : "bg-green-500/10 text-green-400";

  const dialog = (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={`relative w-full max-w-sm rounded-3xl shadow-2xl p-6
          animate-in fade-in zoom-in-95 duration-200 ${panel}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-4`}
        >
          {variant === "danger" ? (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>

        <h3 className={`text-base font-bold mb-1 ${heading}`}>{title}</h3>
        <p className={`text-sm leading-relaxed mb-6 ${body}`}>{description}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-150 disabled:opacity-50 ${cancelBtn}`}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold
              transition-all duration-150 active:scale-[0.98] disabled:opacity-60
              disabled:cursor-not-allowed flex items-center justify-center gap-2
              ${confirmBtn}`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Working…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
