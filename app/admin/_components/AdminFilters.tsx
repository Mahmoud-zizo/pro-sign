"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

interface Props {
  branches: { id: string; name: string }[];
  currentBranch: string;
  currentSearch: string;
}

export default function AdminFilters({
  branches,
  currentBranch,
  currentSearch,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selectedBranch = branches.find((b) => b.id === currentBranch);

  useEffect(() => {
    if (searchRef.current) searchRef.current.value = currentSearch;
  }, [currentSearch]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const push = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      startTransition(() => router.push(`/admin?${next.toString()}`));
    },
    [params, router],
  );

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => push({ search: value }), 300);
    },
    [push],
  );

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* ── Branch dropdown ── */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-2.5 h-9 pl-3.5 pr-3 rounded-xl text-[13px]
                      border transition-all duration-150
                      ${
                        open
                          ? "bg-[#1E2227] border-[#24AE7C]/40 text-white"
                          : "bg-[#1C2025] border-white/6 text-slate-300 hover:border-white/12 hover:text-white"
                      }`}
        >
          {/* Pin icon */}
          <svg
            className="w-3.5 h-3.5 shrink-0 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <span className="min-w-22.5">
            {selectedBranch ? selectedBranch.name : "All branches"}
          </span>

          {/* Chevron */}
          <svg
            className={`w-3 h-3 text-slate-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown panel */}
        {open && (
          <div
            className="absolute top-[calc(100%+6px)] left-0 z-50 min-w-50
                          bg-[#1C2025] border border-white/8 rounded-2xl
                          shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
          >
            {/* All branches option */}
            <button
              onClick={() => {
                push({ branch: "" });
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-left transition-colors
                          ${
                            !currentBranch
                              ? "text-white bg-white/4"
                              : "text-slate-400 hover:text-white hover:bg-white/3"
                          }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${!currentBranch ? "bg-[#24AE7C]" : "bg-transparent"}`}
              />
              All branches
            </button>

            {branches.length > 0 && (
              <div className="mx-3 my-1 border-t border-white/6" />
            )}

            {branches.map((b) => {
              const isActive = currentBranch === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    push({ branch: b.id });
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-left transition-colors
                              ${
                                isActive
                                  ? "text-white bg-white/4"
                                  : "text-slate-400 hover:text-white hover:bg-white/3"
                              }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isActive ? "bg-[#24AE7C]" : "bg-slate-600"}`}
                  />
                  {b.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Search ── */}
      <div className="relative flex-1 min-w-50 max-w-xs">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          ref={searchRef}
          type="text"
          placeholder="Search by name…"
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#1C2025] text-[13px]
                     text-slate-300 placeholder-slate-600
                     border border-white/6 hover:border-white/12
                     focus:outline-none focus:border-[#24AE7C]/40 transition-colors"
        />
      </div>

      {/* ── Clear ── */}
      {(currentBranch || currentSearch) && (
        <button
          onClick={() => push({ branch: "", search: "" })}
          className="h-9 px-3 rounded-xl text-[13px] text-slate-400 hover:text-white
                     border border-white/6 bg-transparent hover:bg-white/4 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
