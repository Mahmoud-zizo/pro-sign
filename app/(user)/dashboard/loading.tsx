export default function UserLoading() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* ── Header ── */}
      <header className="px-4 sm:px-8 py-5 flex items-center justify-between w-full mx-auto bg-white border-b border-slate-200 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200 animate-pulse border border-slate-100" />
          <div className="w-24 h-6 rounded-lg bg-slate-200 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-9 rounded-xl bg-slate-200 animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </header>

      <div className="px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-8">
        {/* ── Title ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-64 h-10 rounded-xl bg-slate-200 animate-pulse" />
            <div className="w-48 h-5 rounded-lg bg-slate-200 animate-pulse" />
          </div>
          <div className="w-40 h-12 rounded-xl bg-slate-200 animate-pulse" />
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-5 rounded-[24px] p-7 bg-white border border-slate-200 shadow-sm"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse" />
                <div className="w-16 h-10 rounded-lg bg-slate-200 animate-pulse" />
              </div>
              <div className="w-3/4 h-4 rounded-lg bg-slate-200 animate-pulse" />
            </div>
          ))}
        </div>

        {/* ── Status tabs ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-24 h-9 rounded-full bg-slate-200 animate-pulse"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="w-full">
            <div className="flex flex-col">
              {/* Table header */}
              <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr] gap-4 px-6 py-4 bg-slate-50/80 border-b border-slate-200">
                {["Vehicle", "Date", "Status", "Details", "Actions"].map(
                  (col) => (
                    <div
                      key={col}
                      className="h-4 w-16 rounded-lg bg-slate-200 animate-pulse"
                    />
                  ),
                )}
              </div>

              {/* Table rows */}
              <div className="flex flex-col">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex flex-col md:grid md:grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr] gap-y-3 md:gap-4 px-6 py-5 items-start md:items-center
                      ${i !== 4 ? "border-b border-slate-100" : ""}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Vehicle */}
                    <div className="flex items-center gap-4 min-w-0 w-full">
                      <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0 border border-slate-100" />
                      <div className="flex flex-col gap-1.5 flex-1 max-w-50">
                        <div className="w-full h-4 rounded-md bg-slate-200 animate-pulse" />
                        <div className="w-2/3 h-3 rounded-md bg-slate-200 animate-pulse" />
                      </div>
                      <div className="md:hidden flex shrink-0">
                        <div className="w-20 h-7 rounded-full bg-slate-200 animate-pulse" />
                      </div>
                    </div>
                    {/* Date */}
                    <div className="flex flex-col gap-1.5 w-full md:w-auto mt-2 md:mt-0 pl-14 md:pl-0">
                      <div className="w-12 h-3 rounded-md bg-slate-200 animate-pulse md:hidden mb-1" />
                      <div className="w-24 h-4 rounded-md bg-slate-200 animate-pulse" />
                      <div className="w-16 h-3 rounded-md bg-slate-200 animate-pulse" />
                    </div>
                    {/* Status badge */}
                    <div className="hidden md:flex justify-start">
                      <div className="w-20 h-7 rounded-full bg-slate-200 animate-pulse" />
                    </div>
                    {/* Details */}
                    <div className="flex flex-col gap-1.5 w-full md:w-auto mt-2 md:mt-0 pl-14 md:pl-0">
                      <div className="w-16 h-3 rounded-md bg-slate-200 animate-pulse md:hidden mb-1" />
                      <div className="w-36 h-3.5 rounded-md bg-slate-200 animate-pulse" />
                      <div className="w-12 h-3.5 rounded-md bg-slate-200 animate-pulse" />
                    </div>
                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 w-full md:w-auto mt-5 md:mt-0 pt-4 md:pt-0 border-t border-slate-100 md:border-none">
                      <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse hidden md:block" />
                      <div className="w-full md:w-28 h-9 rounded-lg bg-slate-200 animate-pulse mt-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
