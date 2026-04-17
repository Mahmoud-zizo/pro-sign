"use client";

// ─── FieldLabel ───────────────────────────────────────────────────────────────

export function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 gap-1.5">
      <span className="text-teal-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </span>
      {children}
      {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
    </label>
  );
}

// ─── FieldError ───────────────────────────────────────────────────────────────

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {message}
    </p>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export function Input({
  value,
  onChange,
  placeholder,
  maxLength,
  error,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-white border ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
            : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/10"
        } rounded-[14px] px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 
        focus:outline-none focus:ring-4 transition-all duration-200 shadow-sm`}
      />
      {maxLength ? (
        <div className="flex justify-between items-center mt-1">
          <FieldError message={error} />
          <span className="text-xs font-mono text-zinc-600 ml-auto">
            {value.length}/{maxLength}
          </span>
        </div>
      ) : (
        <FieldError message={error} />
      )}
    </div>
  );
}

// ─── NumberInput ──────────────────────────────────────────────────────────────

export function NumberInput({
  value,
  onChange,
  placeholder,
  min,
  max,
  error,
}: {
  value: number | "";
  onChange: (v: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  error?: string;
}) {
  return (
    <div>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n)) onChange(n);
        }}
        placeholder={placeholder}
        className={`w-full bg-white border ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
            : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/10"
        } rounded-[14px] px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 
        focus:outline-none focus:ring-4 transition-all duration-200 shadow-sm
        [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
      />
      <FieldError message={error} />
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

export function Textarea({
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 4,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  error?: string;
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className={`w-full bg-white border ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
            : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/10"
        } rounded-[14px] px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 resize-none
        focus:outline-none focus:ring-4 transition-all duration-200 shadow-sm`}
      />
      {maxLength ? (
        <div className="flex justify-between items-center mt-1">
          <FieldError message={error} />
          <span className="text-xs font-mono text-zinc-600 ml-auto">
            {value.length}/{maxLength}
          </span>
        </div>
      ) : (
        <FieldError message={error} />
      )}
    </div>
  );
}
