export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[#131619] font-sans text-white pb-20">
      {/* ── Header ── */}
      <header className="px-8 py-5 flex items-center justify-between w-full mx-auto bg-[#131619] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1C2025] animate-pulse" />
          <div className="w-24 h-5 rounded-lg bg-[#1C2025] animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-16 h-5 rounded-lg bg-[#1C2025] animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-[#1C2025] animate-pulse" />
        </div>
      </header>

      <div className="px-8 max-w-350 mx-auto">
        {/* ── Title ── */}
        <div className="mb-10">
          <div className="w-64 h-9 rounded-xl bg-[#1C2025] animate-pulse mb-3" />
          <div className="w-48 h-4 rounded-lg bg-[#1C2025] animate-pulse" />
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-5 rounded-2xl p-7 bg-[#1C2025]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#252A30] animate-pulse" />
                <div className="w-14 h-9 rounded-lg bg-[#252A30] animate-pulse" />
              </div>
              <div className="w-3/4 h-4 rounded-lg bg-[#252A30] animate-pulse" />
            </div>
          ))}
        </div>

        {/* ── Status tabs ── */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-20 h-7 rounded-full bg-[#1C2025] animate-pulse"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>

        {/* ── Filters row ── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-40 h-9 rounded-xl bg-[#1C2025] animate-pulse" />
          <div className="w-56 h-9 rounded-xl bg-[#1C2025] animate-pulse" />
        </div>

        {/* ── Table header ── */}
        <div className="min-w-0 overflow-hidden">
          <div className="grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_auto] gap-4 px-6 py-4 bg-[#131619] mb-2">
            {["Client", "Date", "Status", "Car Make", "Actions"].map((col) => (
              <div
                key={col}
                className="h-4 w-16 rounded-lg bg-[#1C2025] animate-pulse"
              />
            ))}
          </div>

          {/* ── Table rows ── */}
          <div className="bg-[#1A1D21] rounded-2xl overflow-hidden">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_auto] gap-4 px-6 py-5 items-center
                            ${i !== 6 ? "border-b border-white/4" : ""}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Client */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#252A30] animate-pulse shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <div className="w-28 h-3.5 rounded-md bg-[#252A30] animate-pulse" />
                    <div className="w-20 h-3 rounded-md bg-[#252A30] animate-pulse" />
                  </div>
                </div>
                {/* Date */}
                <div className="w-24 h-3.5 rounded-md bg-[#252A30] animate-pulse" />
                {/* Status badge */}
                <div className="w-20 h-7 rounded-full bg-[#252A30] animate-pulse" />
                {/* Car */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#252A30] animate-pulse shrink-0" />
                  <div className="w-24 h-3.5 rounded-md bg-[#252A30] animate-pulse" />
                </div>
                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-3">
                  <div className="w-16 h-7 rounded-lg bg-[#252A30] animate-pulse" />
                  <div className="w-10 h-3.5 rounded-md bg-[#252A30] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pagination ── */}
        <div className="flex justify-between items-center mt-6 px-4">
          <div className="w-10 h-10 rounded-2xl bg-[#1C2025] animate-pulse" />
          <div className="w-10 h-10 rounded-2xl bg-[#1C2025] animate-pulse" />
        </div>
      </div>
    </main>
  );
}
