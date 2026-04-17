import { getRequestDetail } from "../../dashboard/dashboardAction";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import RequestActions from "./_components/RequestAction";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  PENDING_REVIEW: {
    label: "Under Review",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  QUOTED: {
    label: "Quote Ready",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-teal-700",
    bg: "bg-teal-50 border-teal-200",
    dot: "bg-teal-500",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    dot: "bg-green-500",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-slate-500",
    bg: "bg-slate-50 border-slate-200",
    dot: "bg-slate-400",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING_REVIEW;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold ${cfg.bg} ${cfg.color}`}
    >
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-700 text-right">
        {value || "—"}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-bold tracking-wider text-teal-600 uppercase mb-2">
        {title}
      </p>
      <div className="bg-white border border-slate-100 rounded-2xl px-4 shadow-sm divide-y divide-slate-100">
        {children}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Next.js 15 — params is a Promise
export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) redirect("/login");

  const request = await getRequestDetail(id);
  if (!request) notFound();

  const isConfirmed = request.status === "CONFIRMED";
  const isCompleted = request.status === "COMPLETED";

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-teal-50/30 font-sans">
      {/* ── Header ── */}
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
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
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-800">
              Booking Details
            </h1>
            <p className="text-xs text-slate-400 font-mono">{request.id}</p>
          </div>
          <div className="ml-auto">
            <StatusBadge status={request.status} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        {/* ── Confirmed / Completed banner ── */}
        {(isConfirmed || isCompleted) && (
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl border ${
              isCompleted
                ? "bg-green-50 border-green-200"
                : "bg-teal-50 border-teal-200"
            }`}
          >
            <span className="text-2xl">{isCompleted ? "✅" : "🎉"}</span>
            <div>
              <p
                className={`text-sm font-bold ${isCompleted ? "text-green-700" : "text-teal-700"}`}
              >
                {isCompleted ? "Service Completed" : "Appointment Confirmed!"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {isCompleted
                  ? "Your service has been completed successfully."
                  : "Your appointment is scheduled. We'll see you on the date below."}
              </p>
            </div>
          </div>
        )}

        {/* ── Pending — cancel only ── */}
        {request.status === "PENDING_REVIEW" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold tracking-wider text-amber-600 uppercase mb-1">
              Under Review
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Our team is reviewing your request. You can cancel it while
              it&apos;s pending.
            </p>
            <RequestActions requestId={request.id} status={request.status} />
          </div>
        )}

        {/* ── Quote card — shown when QUOTED ── */}
        {request.status === "QUOTED" && request.quote && (
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-3">
              Quote from Our Team
            </p>
            <p className="text-3xl font-bold text-slate-800 mb-1">
              EGP {request.quote.price.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mb-3">
              Estimated duration: {request.quote.durationDays}{" "}
              {request.quote.durationDays === 1 ? "day" : "days"}
            </p>
            {request.quote.notes && (
              <p className="text-xs text-slate-600 bg-white/70 rounded-xl px-3 py-2 border border-blue-100 mb-3">
                {request.quote.notes}
              </p>
            )}
            <RequestActions requestId={request.id} status={request.status} />
          </div>
        )}

        {/* ── Details ── */}
        <Section title="Your Info">
          <Row label="Name" value={request.customerName} />
          <Row label="Phone" value={request.phoneNumber} />
          <Row label="Address" value={request.address} />
        </Section>

        <Section title="Vehicle">
          <Row label="Make" value={request.carMake} />
          <Row label="Model" value={request.carModel} />
          <Row label="Year" value={String(request.carYear)} />
        </Section>

        <Section title="Branch & Date">
          <Row label="Branch" value={request.branch.name} />
          <Row
            label="Date"
            value={request.slot ? formatDate(request.slot.date) : "—"}
          />
        </Section>

        <Section title="Services">
          {request.services.map((s, i) => (
            <div
              key={i}
              className="py-3 border-b border-slate-100 last:border-0"
            >
              <span className="text-sm font-medium text-slate-700">
                {s.service.name}
              </span>
            </div>
          ))}
        </Section>

        {request.notes && (
          <Section title="Notes">
            <Row label="Notes" value={request.notes} />
          </Section>
        )}

        <p className="text-center text-xs text-slate-400">
          Submitted {formatDate(request.createdAt)}
        </p>
      </div>
    </main>
  );
}
