"use client";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "@/lib/hooks/Useinview";

export default function Hero() {
  const [ref, inView] = useInView(0.1);

  return (
    <>
      <section
        id="hero"
        ref={ref as React.RefObject<HTMLElement>}
        className="relative overflow-hidden "
      >
        <div
          className="max-w-7xl sm:mt-16 mx-auto px-2 sm:px-10 py-16 sm:py-30
          flex flex-col lg:flex-row items-center gap-10 lg:gap-32 mb-10"
        >
          {/* ── LEFT: text ── */}
          <div
            className=" flex-1 flex flex-col 
            items-center justify-center text-center 
            lg:items-start lg:justify-start lg:text-left
            order-1 w-full "
          >
            <h1
              className={`fade-up font-bold leading-[1.08] tracking-[-0.03em] text-[#0f1117]
              text-5xl sm:text-6xl md:text-[3.5rem] ${inView ? "visible" : ""}`}
            >
              Pro <span className="text-red-500">Sign</span>
            </h1>
            <h2
              className={`fade-up font-bold leading-[1.1] tracking-[-0.02em] text-[#0f1117]
              text-3xl sm:text-4xl md:text-5xl mt-2 sm:mt-3 ${inView ? "visible" : ""}`}
              style={{ transitionDelay: "0.05s" }}
            >
              Premium Car Protection
            </h2>

            <div
              className={`fade-up flex items-center gap-2 mt-3 justify-center lg:justify-start ${inView ? "visible" : ""}`}
              style={{ transitionDelay: "0.08s" }}
            >
              <span className="w-8 h-0.5 bg-red-500 rounded-full"></span>
              <span className="text-red-500 font-extrabold uppercase tracking-wider text-sm sm:text-base">
                Powered by 3M
              </span>
            </div>

            <p
              className={`fade-up text-[#4a4a4a] leading-relaxed font-medium mt-6 mb-8 text-lg md:text-xl max-w-xl ${inView ? "visible" : ""}`}
              style={{ transitionDelay: "0.1s" }}
            >
              At PRO SIGN – 3M Authorized Center, we provide advanced car
              protection solutions including PPF, Nano Ceramic, and Window Films
              to keep your vehicle—{" "}
              <span className="text-[#0f1117]">looking brand new</span>
            </p>

            <div
              className={`fade-up flex items-center gap-3 ${inView ? "visible" : ""}`}
              style={{ transitionDelay: "0.2s" }}
            >
              <Link
                href=""
                className="inline-flex items-center bg-red-500 text-white text-sm font-semibold
                  px-6 py-3 rounded-full no-underline
                  shadow-[0_2px_12px_rgba(0,0,0,0.2)]
                  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
              >
                Book Now
              </Link>
              <Link
                href=""
                className="inline-flex items-center bg-white text-[#0f1117] text-sm font-semibold
                  px-6 py-3 rounded-full no-underline border border-black/10
                  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
              >
                View Services
              </Link>
            </div>
          </div>

          {/* ── RIGHT: scattered photo cards ── */}
          {/*
            Root fix: use a padding-bottom aspect-ratio box so the container height
            is always derived from its own width — no fixed px heights that break
            at intermediate breakpoints. Cards use % positioning/sizing so they
            scale fluidly with the container at every viewport width.
          */}
          <div
            className={`fade-up order-2 w-full lg:flex-1 ${inView ? "visible" : ""}`}
            style={{ transitionDelay: "0.15s" }}
          >
            {/* Aspect-ratio wrapper */}
            <div
              className="relative w-full mx-auto"
              style={{ maxWidth: 460, paddingBottom: "85%" }}
            >
              {/* ── Dashed SVG connectors ── */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                viewBox="0 0 460 390"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 155 100 C 210 70, 270 75, 300 90"
                  stroke="#b0a898"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                  fill="none"
                />
                <path
                  d="M 145 135 C 165 210, 185 260, 210 295"
                  stroke="#b0a898"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                  fill="none"
                />
                <path
                  d="M 160 104 L 163 114 L 165 109 L 170 108 Z"
                  fill="#666"
                />
              </svg>

              {/* ── Card 1 — top left ── */}
              <div
                className="card absolute rounded-[18px] overflow-hidden bg-white
                  shadow-[0_8px_32px_rgba(0,0,0,0.13)] border border-black/4 z-10"
                style={{ top: "2%", left: "0%", width: "36%" }}
              >
                {/* Image from public folder */}
                <Image
                  src="/images/copra.jpg"
                  alt="Ahmed Karim"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* ── Card 2 — top right (tallest, image-only) ── */}
              <div
                className="card absolute rounded-[18px] overflow-hidden bg-white
                  shadow-[0_8px_32px_rgba(0,0,0,0.10)] border border-black/4 z-10"
                style={{ top: "0%", right: "0%", width: "36%" }}
              >
                <Image
                  src="/images/gray.jpg"
                  alt="Ahmed Karim"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating pill — above card 2 */}
              <div
                className="absolute bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.12)]
                  border border-black/6 z-20 whitespace-nowrap px-2.5 py-1.5"
                style={{ top: "1%", right: "38%" }}
              >
                <p className="text-[10px] font-semibold text-[#0f1117]">
                  Full Protection
                </p>
              </div>

              {/* ── Card 3 — bottom center ── */}
              <div
                className="card absolute rounded-[18px] overflow-hidden bg-white
                  shadow-[0_8px_32px_rgba(0,0,0,0.13)] border border-black/4 z-10"
                style={{ bottom: "0%", left: "33%", width: "36%" }}
              >
                <Image
                  src="/images/class.jpg"
                  alt="Ahmed Karim"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: "1 / 1.25" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
