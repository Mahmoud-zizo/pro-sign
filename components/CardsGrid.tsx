// components/landing/CardsGrid.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./ui/SectionHeading";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
const CARDS = [
  {
    id: 1,
    title: "PPF",
    description:
      "Shield your car's paint from chips, scratches, and road debris with our ultra-durable PPF.",
    icon: "⚡",
    image: "/images/ppf.jpg",
  },
  {
    id: 2,
    title: "Nano Ceramic Coating",
    description:
      "Flexible long-term protection with extreme resistance to UV radiation, chemicals, and aggressive elements.",
    icon: "📊",
    image: "/images/nano.jpg",
  },
  {
    id: 3,
    title: "Window Tinting",
    description:
      "Reduce heat, block UV rays, and enhance privacy with premium window tint films that balance performance and style.",
    icon: "🌐",
    image: "/images/window.jpg",
  },
];

function Card({ card, index }: { card: (typeof CARDS)[0]; index: number }) {
  // Bento layout mapping
  // index 0: Top Left
  // index 1: Bottom Left
  // index 2: Right Tall
  const isTall = index === 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`relative w-full h-full overflow-hidden rounded-[2rem] group cursor-pointer border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500
        ${isTall ? "md:row-span-2 md:col-start-2 md:row-start-1" : ""}
      `}
    >
      {/* Background Image */}
      <Image
        src={card.image}
        alt={card.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Dark Overlay - Subtle red tint on hover for app identity */}
      <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-red-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center">
        <h1
          className={`text-white font-bold tracking-tight mb-2 drop-shadow-md transform transition-transform duration-500 group-hover:-translate-y-2
          ${isTall ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl md:text-4xl"}
        `}
        >
          {card.title}
        </h1>

        {/* Description fades in and slides up on hover */}
        <p className="text-gray-200 text-sm md:text-base font-medium max-w-[90%] md:max-w-[75%] mx-auto opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 line-clamp-3">
          {card.description}
        </p>

        {/* View Service pill button */}
        <div className="absolute bottom-10 opacity-0 translate-y-4 transition-all duration-500 delay-75 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-2 bg-red-500 text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <Link href="/login">Book Now</Link>
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function CardsGrid() {
  return (
    <section id="services" className="w-full mt-32 sm:mt-40">
      <SectionHeading
        title="Our Services"
        highlightedWord="Services"
        className="mb-12"
      />{" "}
      <div className="max-w-7xl mx-auto px-6 pb-24 lg:pb-32 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 auto-rows-fr min-h-[800px] md:h-[650px]">
          {CARDS.map((card, i) => (
            <Card key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
