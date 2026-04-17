import { getAllRequests, getBranches } from "./actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminRowActions from "./_components/AdminRowActions";
import AdminFilters from "./_components/AdminFilters";
import { logout } from "../actions/index";
import Image from "next/image";
// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    icon: (c?: string) => React.ReactNode;
  }
> = {
  PENDING_REVIEW: {
    label: "Pending",
    color: "text-[#79B5EC]",
    bg: "bg-[#79B5EC]/10",
    icon: (c) => <HourGlassIcon className={c} />,
  },
  QUOTED: {
    label: "Quoted",
    color: "text-[#79B5EC]",
    bg: "bg-[#79B5EC]/10",
    icon: (c) => <HourGlassIcon className={c} />,
  },
  CONFIRMED: {
    label: "Scheduled",
    color: "text-[#24AE7C]",
    bg: "bg-[#24AE7C]/10",
    icon: (c) => <CheckIcon className={c} />,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-[#24AE7C]",
    bg: "bg-[#24AE7C]/10",
    icon: (c) => <CheckIcon className={c} />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-[#F24E43]",
    bg: "bg-[#F24E43]/10",
    icon: (c) => <CancelIcon className={c} />,
  },
};

const AVATAR_COLORS = [
  "bg-[#24AE7C]",
  "bg-[#79B5EC]",
  "bg-violet-600",
  "bg-amber-600",
  "bg-[#F24E43]",
  "bg-emerald-600",
];

function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}
function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING_REVIEW;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold ${cfg.bg} ${cfg.color}`}
    >
      {cfg.icon("w-3.5 h-3.5")}
      {cfg.label}
    </span>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HourGlassIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "w-8 h-8"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 3H3M21 21H3M10 21V16.3262C10 15.7958 10.2107 15.2872 10.5858 14.9121L12 13.5L13.4142 14.9121C13.7893 15.2872 14 15.7958 14 16.3262V21M14 3V7.67376C14 8.20419 13.7893 8.71281 13.4142 9.08787L12 10.5L10.5858 9.08787C10.2107 8.71281 10 8.20419 10 7.67376V3" />
      <path d="M10 16H14" />
      <path d="M10 8H14" />
    </svg>
  );
}
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "w-8 h-8"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}
function CancelIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "w-8 h-8"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "w-8 h-8"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; branch?: string; search?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const { filter, branch, search } = await searchParams;
  const activeFilter = filter ?? "ALL";
  const activeBranch = branch ?? "";
  const activeSearch = search ?? "";

  const [all, branches] = await Promise.all([getAllRequests(), getBranches()]);

  const activeBranchName = branches.find((b) => b.id === activeBranch)?.name;

  // Branch-scoped base — counts and table both use this so cards always reflect the selected branch
  const branchFiltered = !activeBranch
    ? all
    : all.filter((r) => r.branch.name === activeBranchName);

  const counts = {
    confirmed: branchFiltered.filter((r) =>
      ["CONFIRMED", "COMPLETED"].includes(r.status),
    ).length,
    pending: branchFiltered.filter((r) => r.status === "PENDING_REVIEW").length,
    cancelled: branchFiltered.filter((r) => r.status === "CANCELLED").length,
    quoted: branchFiltered.filter((r) => r.status === "QUOTED").length,
  };

  const filtered = branchFiltered
    .filter((r) => activeFilter === "ALL" || r.status === activeFilter)
    .filter(
      (r) =>
        !activeSearch ||
        r.customerName.toLowerCase().includes(activeSearch.toLowerCase()),
    );

  const statCards = [
    {
      key: "CONFIRMED",
      label: "Total number of scheduled appointments",
      value: counts.confirmed,
      icon: <CalendarIcon />,
      color: "text-amber-400",
    },
    {
      key: "PENDING_REVIEW",
      label: "Total number of pending requests",
      value: counts.pending,
      icon: <HourGlassIcon />,
      color: "text-[#79B5EC]",
    },
    {
      key: "CANCELLED",
      label: "Total number of cancelled requests",
      value: counts.cancelled,
      icon: <CancelIcon />,
      color: "text-[#F24E43]",
    },
    {
      key: "QUOTED",
      label: "Total number of quoted requests",
      value: counts.quoted,
      icon: <HourGlassIcon />,
      color: "text-[#79B5EC]",
    },
  ];

  // Builds a URL that always preserves branch + search unless explicitly overridden
  function buildHref(overrides: Record<string, string>) {
    const p = new URLSearchParams();
    if (activeBranch) p.set("branch", activeBranch);
    if (activeSearch) p.set("search", activeSearch);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    return p.toString() ? `/admin?${p}` : "/admin";
  }

  return (
    <main className="min-h-screen bg-[#131619] font-sans text-white pb-20">
      <header className="px-4 sm:px-8 py-5 flex items-center justify-between w-full mx-auto bg-[#131619] mb-8">
        <div className="flex items-center gap-3">
          <div className=" rounded-lg flex items-center justify-center p-1 bg-white">
            <Image
              src="/images/prosign.jpg"
              alt="logo"
              width={40}
              height={40}
              className="rounded-[15px] object-cover"
            />
          </div>
          <span className="text-lg sm:text-3xl font-bold tracking-tight">
            prosign
          </span>
        </div>
        <div className="flex items-center gap-3">
          <form action={logout}>
            <button
              type="submit"
              className="h-9 px-4 rounded-xl text-[13px] font-medium text-slate-400 hover:text-white
              cursor-pointer border border-white/6 bg-transparent hover:bg-white/4 transition-colors"
            >
              Sign out
            </button>
          </form>

          <div className="relative group flex items-center gap-2">
            <span className="text-[14px] font-medium text-white block">
              {session.user.name?.split(" ")[0] ?? "Admin"}
            </span>
            <div
              className={`w-9 h-9 rounded-full ${avatarColor(session.user.name ?? "A")}
              flex items-center justify-center text-[13px] font-bold`}
            >
              {initials(session.user.name ?? session.user.email ?? "A")}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#24AE7C] border-2 border-[#131619] rounded-full"></span>
          </div>
        </div>
      </header>

      <div className="px-8 max-w-350 mx-auto">
        <div className="mb-10">
          <h1 className="text-[36px] font-bold tracking-tight mb-2">
            Welcome, {session.user.name?.split(" ")[0] ?? "Admin"}
          </h1>
          <p className="text-slate-400 text-[15px]">
            Start day with managing new appointments
            {activeBranchName && (
              <span className="ml-2 text-[#24AE7C] font-medium">
                · {activeBranchName}
              </span>
            )}
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card) => {
            const isActive = activeFilter === card.key;
            return (
              <Link
                key={card.key}
                href={buildHref({ filter: card.key })}
                className={`flex flex-col gap-5 rounded-2xl p-7 bg-[#1C2025] transition-all duration-200
                  ${isActive ? "ring-2 ring-[#24AE7C]/50" : "hover:bg-[#1E2227]"}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${card.color}`}>{card.icon}</div>
                  <h2 className="text-[36px] font-bold text-white tracking-tight">
                    {card.value}
                  </h2>
                </div>
                <p className="text-[14px] text-slate-400 font-medium leading-relaxed">
                  {card.label}
                </p>
              </Link>
            );
          })}
        </div>

        {/* ── Status tabs ── */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {[
            { key: "ALL", label: "All" },
            { key: "PENDING_REVIEW", label: "Pending" },
            { key: "QUOTED", label: "Quoted" },
            { key: "CONFIRMED", label: "Confirmed" },
            { key: "COMPLETED", label: "Completed" },
            { key: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <Link
              key={tab.key}
              href={buildHref({ filter: tab.key === "ALL" ? "" : tab.key })}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150
                ${
                  activeFilter === tab.key
                    ? "bg-[#24AE7C] text-white"
                    : "bg-transparent text-slate-400 hover:text-white"
                }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* ── Branch filter + Search ── */}
        <AdminFilters
          branches={branches}
          currentBranch={activeBranch}
          currentSearch={activeSearch}
        />

        {/* ── Table ── */}
        <div className="bg-transparent w-full overflow-x-auto">
          <div className="min-w-5xl">
            <div
              className="grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_auto] gap-4 px-6 py-4
              bg-[#131619] text-[14px] font-semibold text-slate-400 items-center"
            >
              <span className="text-left">Client</span>
              <span className="text-left">Date</span>
              <span className="text-left">Status</span>
              <span className="text-left">Car Make</span>
              <span className="text-right">Actions</span>
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-[14px] bg-[#1C2025] rounded-2xl">
                {activeSearch
                  ? `No results for "${activeSearch}".`
                  : "No appointments found for this filter."}
              </div>
            ) : (
              <div className="bg-[#1A1D21] rounded-2xl overflow-hidden shadow-lg mt-2">
                {filtered.map((req, i) => (
                  <div
                    key={req.id}
                    className={`grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_auto] gap-4 px-6 py-5
                      items-center transition-colors duration-150 ${
                        i !== filtered.length - 1
                          ? "border-b border-white/4"
                          : ""
                      } hover:bg-white/2`}
                  >
                    {/* Column 1: Client */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full ${avatarColor(req.customerName)}
                        flex items-center justify-center text-[13px] font-bold text-white shrink-0`}
                      >
                        {initials(req.customerName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-white truncate">
                          {req.customerName}
                        </p>
                        <p className="text-[12px] text-slate-500 truncate">
                          {req.branch.name}
                        </p>
                      </div>
                    </div>

                    {/* Column 2: Date */}
                    <div className="flex justify-start">
                      <p className="text-[14px] text-slate-300">
                        {req.slot
                          ? formatDate(req.slot.date)
                          : formatDate(req.createdAt)}
                      </p>
                    </div>

                    {/* Column 3: Status */}
                    <div className="flex justify-start">
                      <StatusBadge status={req.status} />
                    </div>

                    {/* Column 4: Car */}
                    <div className="flex items-center justify-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-slate-600
                          flex items-center justify-center text-[11px] font-bold text-white shrink-0`}
                      >
                        {initials(req.carMake)}
                      </div>
                      <p className="text-[14px] text-white font-medium truncate">
                        {req.carMake} {req.carModel}
                      </p>
                    </div>

                    {/* Column 5/6: Actions */}
                    <div className="flex items-center gap-3 flex-wrap justify-end text-[13px] col-span-2">
                      <AdminRowActions requestId={req.id} status={req.status} />
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="text-[13px] font-medium text-white hover:text-white/80 transition-colors whitespace-nowrap"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Result count */}
            <p className="text-[13px] text-slate-500 mt-4 px-1">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {activeBranchName && ` · ${activeBranchName}`}
              {activeSearch && ` · "${activeSearch}"`}
            </p>
          </div>
        </div>

        {/* ── Pagination (placeholder) ── */}
        <div className="flex justify-between items-center mt-6 px-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#1C2025] text-slate-400 hover:text-white transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#1C2025] text-slate-400 hover:text-white transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
