import { getUserRequests } from "./dashboardAction";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "../../actions";
import Image from "next/image";
import DeleteButton from "./_components/DeleteButton";

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
    color: "text-blue-700",
    bg: "bg-blue-50",
    icon: (c) => <HourGlassIcon className={c} />,
  },
  QUOTED: {
    label: "Quoted",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    icon: (c) => <HourGlassIcon className={c} />,
  },
  CONFIRMED: {
    label: "Scheduled",
    color: "text-amber-700",
    bg: "bg-amber-50",
    icon: (c) => <CalendarIcon className={c} />,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: (c) => <CheckIcon className={c} />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-700",
    bg: "bg-rose-50",
    icon: (c) => <CancelIcon className={c} />,
  },
};

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "w-5 h-5"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function UserDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { filter } = await searchParams;
  const activeFilter = filter ?? "ALL";

  const requests = await getUserRequests();

  const counts = {
    scheduled: requests.filter((r) => r.status === "CONFIRMED").length,
    pending: requests.filter((r) => r.status === "PENDING_REVIEW").length,
    cancelled: requests.filter((r) => r.status === "CANCELLED").length,
    completed: requests.filter((r) => r.status === "COMPLETED").length,
  };

  const filtered = requests.filter(
    (r) => activeFilter === "ALL" || r.status === activeFilter,
  );

  const statCards = [
    {
      key: "CONFIRMED",
      label: "Scheduled appointments",
      value: counts.scheduled,
      icon: <CalendarIcon />,
      bg: "bg-[#784A8E]",
      iconColor: "text-white/80",
      textColor: "text-white",
      labelColor: "text-white/80",
    },
    {
      key: "PENDING_REVIEW",
      label: "Pending reviews",
      value: counts.pending,
      icon: <HourGlassIcon />,
      bg: "bg-[#FC8C64]",
      iconColor: "text-white/80",
      textColor: "text-white",
      labelColor: "text-white/80",
    },
    {
      key: "COMPLETED",
      label: "Completed services",
      value: counts.completed,
      icon: <CheckIcon />,
      bg: "bg-[#8EC8C6]",
      iconColor: "text-white/80",
      textColor: "text-white",
      labelColor: "text-[#191A23]/80", // using high contrast for legibility, but #8EC8C6 with white is fine, user did white for this card too
    },
    {
      key: "CANCELLED",
      label: "Cancelled requests",
      value: counts.cancelled,
      icon: <CancelIcon />,
      bg: "bg-[#E2E8F0]",
      iconColor: "text-slate-400",
      textColor: "text-slate-800",
      labelColor: "text-slate-600",
    },
  ];

  function buildHref(overrides: Record<string, string>) {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(overrides)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    return p.toString() ? `/dashboard?${p}` : "/dashboard";
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="px-4 sm:px-8 py-5 flex items-center justify-between w-full mx-auto bg-white border-b border-slate-200 mb-8">
        <div className="flex items-center gap-3">
          <div className=" rounded-lg flex items-center justify-center p-1 bg-white border border-slate-100 shadow-sm">
            <Image
              src="/images/prosign.jpg"
              alt="logo"
              width={40}
              height={40}
              className="rounded-[15px] object-cover"
            />
          </div>
          <span className="text-lg sm:text-3xl font-bold tracking-tight text-slate-900">
            prosign
          </span>
        </div>
        <div className="flex items-center gap-3">
          <form action={logout}>
            <button
              type="submit"
              className="h-9 px-4 rounded-xl text-[13px] font-medium text-slate-600 hover:text-slate-900
              cursor-pointer border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm"
            >
              Sign out
            </button>
          </form>

          <div className="relative group flex items-center gap-2">
            <span className="text-[14px] font-medium text-slate-700 block max-sm:hidden">
              {session.user.name?.split(" ")[0] ?? "User"}
            </span>
            <div
              className={`w-9 h-9 rounded-full ${avatarColor(session.user.name ?? "U")}
              flex items-center justify-center text-[13px] font-bold`}
            >
              {initials(session.user.name ?? session.user.email ?? "U")}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[36px] font-bold tracking-tight mb-2 text-slate-900">
              Welcome, {session.user.name?.split(" ")[0] ?? "User"}
            </h1>
            <p className="text-slate-500 text-[14px] sm:text-[15px]">
              Manage your bookings and appointments
            </p>
          </div>
          <Link
            href="/book"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-slate-900/10"
          >
            <PlusIcon className="w-4 h-4" />
            Book New Service
          </Link>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const isActive = activeFilter === card.key;
            return (
              <Link
                key={card.key}
                href={buildHref({ filter: card.key })}
                className={`flex flex-col gap-5 rounded-[24px] p-7 transition-all duration-200 border-2 ${card.bg}
                  ${
                    isActive
                      ? "border-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)] scale-[1.02]"
                      : "border-transparent hover:-translate-y-1 hover:shadow-xl shadow-lg"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${card.iconColor}`}>{card.icon}</div>
                  <h2
                    className={`text-[36px] font-bold tracking-tight ${card.textColor}`}
                  >
                    {card.value}
                  </h2>
                </div>
                <p
                  className={`text-[14px] font-medium leading-relaxed ${card.labelColor}`}
                >
                  {card.label}
                </p>
              </Link>
            );
          })}
        </div>

        {/* ── Status tabs ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "ALL", label: "All Bookings" },
            { key: "PENDING_REVIEW", label: "Pending" },
            { key: "QUOTED", label: "Quoted" },
            { key: "CONFIRMED", label: "Scheduled" },
            { key: "COMPLETED", label: "Completed" },
            { key: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <Link
              key={tab.key}
              href={buildHref({ filter: tab.key === "ALL" ? "" : tab.key })}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-150 border
                ${
                  activeFilter === tab.key
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="w-full">
            <div className="flex flex-col">
              <div
                className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr] gap-4 px-6 py-4
                bg-slate-50/80 text-[14px] font-semibold text-slate-500 items-center border-b border-slate-200"
              >
                <span className="text-left">Vehicle</span>
                <span className="text-left">Date</span>
                <span className="text-left">Status</span>
                <span className="text-left">Details</span>
                <span className="text-right">Actions</span>
              </div>

              {filtered.length === 0 ? (
                <div className="py-20 text-center text-slate-500 text-[14px] bg-white">
                  No appointments found for this filter.
                </div>
              ) : (
                <div className="flex flex-col">
                  {filtered.map((req, i) => (
                    <div
                      key={req.id}
                      className={`flex flex-col md:grid md:grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr] gap-y-3 md:gap-4 px-6 py-5
                        items-start md:items-center transition-colors duration-150 hover:bg-slate-50/80
                        ${
                          i !== filtered.length - 1
                            ? "border-b border-slate-100"
                            : ""
                        }`}
                    >
                      {/* Column 1: Client/Vehicle */}
                      <div className="flex items-center gap-4 min-w-0 w-full">
                        <div
                          className={`w-10 h-10 rounded-full bg-slate-100 text-slate-600
                          flex items-center justify-center text-[14px] font-bold shrink-0 border border-slate-200`}
                        >
                          {initials(req.carMake)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] md:text-[14px] font-semibold md:font-medium text-slate-900 truncate">
                            {req.carMake} {req.carModel}
                          </p>
                          <p className="text-[13px] md:text-[12px] text-slate-500 truncate mt-0.5">
                            {req.carYear} • {req.branch?.name ?? "No branch"}
                          </p>
                        </div>
                        <div className="md:hidden flex shrink-0">
                          <StatusBadge status={req.status} />
                        </div>
                      </div>

                      {/* Column 2: Date */}
                      <div className="flex flex-col justify-center w-full md:w-auto mt-2 md:mt-0 pl-14 md:pl-0">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 md:hidden">
                          Date
                        </span>
                        <p className="text-[14px] font-medium text-slate-700">
                          {req.slot
                            ? formatDate(req.slot.date)
                            : formatDate(req.createdAt)}
                        </p>
                        <p className="text-[12px] text-slate-500 mt-0.5">
                          {req.slot ? "Scheduled" : "Created"}
                        </p>
                      </div>

                      {/* Column 3: Status (Desktop only) */}
                      <div className="hidden md:flex justify-start">
                        <StatusBadge status={req.status} />
                      </div>

                      {/* Column 4: Details */}
                      <div className="flex flex-col justify-center w-full md:w-auto mt-2 md:mt-0 pl-14 md:pl-0">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 md:hidden">
                          Services
                        </span>
                        <p className="text-[13px] text-slate-700 font-medium truncate max-w-full md:max-w-50">
                          {req.services.map((s) => s.service.name).join(", ")}
                        </p>
                        {req.quote && (
                          <p className="text-[12px] text-slate-500 mt-0.5 font-semibold">
                            EGP {req.quote.price}
                          </p>
                        )}
                      </div>

                      {/* Column 5: Actions */}
                      <div className="flex items-center gap-3 justify-end text-[13px] w-full md:w-auto mt-5 md:mt-0 pt-4 md:pt-0 border-t border-slate-100 md:border-none">
                        {["CANCELLED", "COMPLETED"].includes(req.status) && (
                          <DeleteButton requestId={req.id} />
                        )}
                        <Link
                          href={`/requests/${req.id}`}
                          className="font-semibold text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 w-full md:w-auto text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
