import Link from "next/link";
export default function CtaBanner() {
  return (
    <section className="w-full px-6 py-16 flex items-center justify-center">
      <div
        className="
          relative w-full max-w-7xl overflow-hidden rounded-[70px]
          bg-red-500
          shadow-[0_8px_40px_rgba(239,68,68,0.25)]
          flex flex-col items-center gap-7 px-12 py-14
        "
      >
        {/* soft glow top-right */}
        <div className="pointer-events-none absolute -top-40 -right-20 h-125 w-125 rounded-full bg-white/10 blur-3xl" />
        {/* soft glow bottom-left */}
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-75 w-75 rounded-full bg-white/8 blur-2xl" />

        <p className="relative z-10 text-center text-2xl font-bold leading-relaxed tracking-wide text-white sm:text-2xl">
          Protect it before it&apos;s too late{" "}
        </p>

        <Link href={"/book"}>
          <button
            className="
            relative z-10 rounded-full bg-white px-9 py-3.5 
            text-normal font-semibold text-black tracking-wide
            shadow-md transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-lg
            active:translate-y-0 active:shadow-sm cursor-pointer
            hover:bg-purple-600 hover:text-white
          "
          >
            Book An Appointment
          </button>
        </Link>
      </div>
    </section>
  );
}
