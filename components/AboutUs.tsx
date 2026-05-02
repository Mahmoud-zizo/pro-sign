import { Play } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import { ShieldCheck, BadgeCheck, Sparkles, Handshake } from "lucide-react";

export const ABOUT_CARDS = [
  {
    title: "Certified Expertise",
    desc: "As a 3M Authorized Center, we apply trusted technologies with precision and care.",
    icon: BadgeCheck,
  },
  {
    title: "Driven by Protection",
    desc: "At PRO SIGN, we focus on preserving every detail of your vehicle using industry-leading solutions.",
    icon: ShieldCheck,
  },
  {
    title: "Advanced Solutions",
    desc: "From PPF to Nano Ceramic and Window Films, we deliver protection built to last.",
    icon: Sparkles,
  },
  {
    title: "Built on Trust",
    desc: "We prioritize quality, consistency, and long-term value for every client.",
    icon: Handshake,
  },
];

export default function AboutUs() {
  return (
    <section
      id="about-us"
      className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 w-full overflow-hidden mt-25"
    >
      <SectionHeading
        title="About "
        highlightedWord="ProSign"
        className="mb-12"
      />{" "}
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-16 flex flex-col xl:flex-row items-center gap-12 lg:gap-20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100">
        {/* Left Column (Cards Grid) */}
        <div className="flex-1 w-full order-2 xl:order-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 sm:gap-y-16">
            {ABOUT_CARDS.map((card, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 cursor-default"
              >
                <div className="relative mb-5 flex items-center justify-center w-16 h-16">
                  {/* Organic blob background */}
                  <div
                    className="absolute inset-0 bg-red-500 opacity-80 transition-all duration-500 group-hover:scale-110  group-hover:opacity-100 group-hover:rotate-12"
                    style={{
                      borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
                    }}
                  ></div>
                  <card.icon
                    className="w-8 h-8 text-white  relative z-10 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-normal font-semibold px-2">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Video Box) */}
        <div className="flex-1 w-full max-w-125 xl:max-w-none mx-auto order-1 xl:order-2">
          <div className="bg-[#e2e8f0]/40 rounded-[2rem] p-3 sm:p-4 flex flex-col gap-4 aspect-square md:aspect-4/3 shadow-inner">
            <div className="bg-white rounded-[1.5rem] flex-1 w-full relative overflow-hidden group shadow-sm flex items-center justify-center">
              {/* ProSign Brand Reel or Action Video */}
              <video
                src="/videos/about.mp4"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                autoPlay
                loop
                muted
                playsInline
              />

              {/* Floating play button / waveform indicator over the video */}
              <div className="relative z-10 flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-3 rounded-full shadow-sm text-sm font-medium scale-90 group-hover:scale-100 transition-all opacity-80 group-hover:opacity-100">
                <div className="flex items-center gap-0.5 opacity-60">
                  <div className="w-0.5 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-0.5 h-3 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-0.5 h-4 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="w-0.5 h-3 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: "450ms" }}
                  ></div>
                  <div
                    className="w-0.5 h-2 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                </div>
                <Play className="w-4 h-4 fill-black text-black ml-1" />
                <span>Watch Process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
