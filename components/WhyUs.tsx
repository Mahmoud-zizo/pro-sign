import { WobbleCard } from "./ui/wobble-card";
import Image from "next/image";
const WhyUs = () => {
  return (
    <div className="bg-gray-900 m-4 p-6 rounded-[20px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* 🔴 BIG LEFT CARD */}
        <WobbleCard containerClassName="md:col-span-2 bg-gradient-to-br from-pink-600 to-red-500 rounded-[20px] h-130 md:h-80">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 h-full">
            <div className="text-white max-w-lg">
              <h2 className="text-3xl font-bold mb-2">3M Authorized Center</h2>
              <p className="text-white/80 text-lg font-semibold">
                We use certified 3M products to guarantee unmatched quality and
                performance
              </p>
            </div>

            <Image
              src="/images/copra.jpg"
              alt="dashboard"
              width={170}
              height={170}
              className="rounded-2xl"
            />
          </div>
        </WobbleCard>

        {/* 🟣 SMALL RIGHT CARD */}
        <WobbleCard containerClassName="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[20px]  h-60 md:h-80">
          <div className="text-white">
            <h3 className="text-3xl text-center font-bold mb-2">
              Up to 10 Years Warranty
            </h3>
            <p className="text-white/80 font-semibold text-center">
              Long-term protection backed by extended warranty coverage for
              peace of mind
            </p>
          </div>
        </WobbleCard>

        {/* 🔵 BIG BOTTOM CARD */}
        <WobbleCard containerClassName="md:col-span-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[20px]  h-130 md:h-80">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 h-full">
            <div className="text-white max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                Precision Installation
              </h1>
              <p className="text-white/80 text-lg sm:text-xl font-semibold">
                Expert technicians ensure flawless application with attention to
                every detail
              </p>
            </div>

            <Image
              src="/images/lotus.jpg"
              alt="dashboard"
              width={180}
              height={180}
              className="rounded-2xl"
            />
          </div>
        </WobbleCard>
      </div>
    </div>
  );
};

export default WhyUs;
