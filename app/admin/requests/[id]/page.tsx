import { getAdminRequestDetail } from "../../actions";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import QuoteForm from "./_components/QuoteForm";
import CompleteButton from "./_components/CompleteButton";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  PENDING_REVIEW: {
    label: "Pending",
    color: "text-[#79B5EC]",
    bg: "bg-[#79B5EC]/10 border-transparent",
    dot: "bg-[#79B5EC]",
  },
  QUOTED: {
    label: "Quoted",
    color: "text-[#79B5EC]",
    bg: "bg-[#79B5EC]/10 border-transparent",
    dot: "bg-[#79B5EC]",
  },
  CONFIRMED: {
    label: "Scheduled",
    color: "text-[#24AE7C]",
    bg: "bg-[#24AE7C]/10 border-transparent",
    dot: "bg-[#24AE7C]",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-[#24AE7C]",
    bg: "bg-[#24AE7C]/10 border-transparent",
    dot: "bg-[#24AE7C]",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-[#F24E43]",
    bg: "bg-[#F24E43]/10 border-transparent",
    dot: "bg-[#F24E43]",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING_REVIEW;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-semibold ${cfg.bg} ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
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
    <div className="flex items-start justify-between gap-4 py-4 border-b border-white/4 last:border-0">
      <span className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-[14px] font-medium text-white text-right wrap-break-words ">
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
    <div className="mb-6">
      <p className="text-[13px] font-bold tracking-wider text-[#24AE7C] uppercase mb-3 px-1 text-center">
        {title}
      </p>
      <div className="bg-[#1A1D21] rounded-2xl px-5 divide-y divide-white/4 shadow-lg">
        {children}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const { id } = await params;
  const request = await getAdminRequestDetail(id);
  if (!request) notFound();

  const canQuote = ["PENDING_REVIEW", "QUOTED"].includes(request.status);
  const canComplete = request.status === "CONFIRMED";

  return (
    <main className="min-h-screen bg-[#131619] font-sans text-white pb-20">
      {/* Header */}
      <div className="bg-[#131619] border-b border-white/4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center p-2 rounded-full hover:bg-white/5"
            >
              <svg
                className="w-5 h-5 cursor-pointer"
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
              <h1 className="text-[18px] font-bold text-white tracking-tight text-center">
                Request Details
              </h1>
              <p className="text-[13px] text-slate-500 font-mono mt-0.5 text-center">
                #{request.id.slice(-8)}
              </p>
            </div>
          </div>
          <div className="flex justify-center flex-1">
            <StatusBadge status={request.status} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6 flex flex-col items-center">
        {/* Customer identity */}
        <div className="bg-[#1A1D21] w-full rounded-2xl p-5 flex items-center justify-center gap-4 shadow-lg flex-col text-center">
          <div
            className="w-16 h-16 rounded-full bg-[#24AE7C]
            flex items-center justify-center text-white font-bold text-[24px] shrink-0"
          >
            {request.customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[20px] font-bold text-white">
              {request.customerName}
            </p>
            <p className="text-[14px] text-slate-400 mt-0.5">
              {request.user.email}
            </p>
          </div>
        </div>

        {/* Current quote summary if exists */}
        {request.quote && (
          <div className="bg-[#1C2025] w-full rounded-2xl p-6 shadow-lg border border-white/4 text-center">
            <p className="text-[13px] font-bold tracking-wider text-[#79B5EC] uppercase mb-3 text-center">
              Current Quote
            </p>
            <p className="text-[32px] font-bold text-white tracking-tight text-center">
              EGP {request.quote.price.toLocaleString()}
            </p>
            <p className="text-[14px] text-slate-400 mt-1 text-center">
              {request.quote.durationDays} day
              {request.quote.durationDays !== 1 ? "s" : ""} estimated to
              complete
            </p>
            {request.quote.notes && (
              <p className="text-[14px] text-slate-300 mt-4 p-4 bg-white/2 rounded-xl border border-white/4 text-center">
                {request.quote.notes}
              </p>
            )}
          </div>
        )}

        {/* ── Quote form ── */}
        {canQuote && (
          <div className="mb-8 w-full">
            <p className="text-[13px] font-bold tracking-wider text-[#24AE7C] uppercase mb-3 px-1 text-center">
              {request.quote ? "Update Quote" : "Send Quote"}
            </p>
            <div className="bg-[#1A1D21] rounded-2xl p-5 shadow-lg border border-white/4 text-center w-full">
              <QuoteForm
                requestId={request.id}
                existing={request.quote ?? undefined}
              />
            </div>
          </div>
        )}

        {/* ── Complete button ── */}
        {canComplete && <CompleteButton requestId={request.id} />}

        {/* Details */}
        <div className="w-full">
          <Section title="Customer Info">
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
                className="py-4 border-b border-white/4 last:border-0 flex justify-center"
              >
                <span className="text-[14px] font-medium text-white text-center w-full">
                  {s.service.name}
                </span>
              </div>
            ))}
          </Section>

          {request.notes && (
            <Section title="Notes">
              <div className="py-4 flex justify-center w-full">
                <span className="text-[14px] text-slate-300 whitespace-pre-wrap leading-relaxed text-center">
                  {request.notes}
                </span>
              </div>
            </Section>
          )}

          <p className="text-center text-[13px] text-slate-500 mt-10">
            Submitted {formatDate(request.createdAt)}
          </p>
        </div>
      </div>
    </main>
  );
}
