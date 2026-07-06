"use client";

import { useEffect, useRef } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const logoData = [
  { name: "ISO 9001", logo: "https://sn.shikshanation.com/certificates/iso-9001.webp" },
  { name: "MSME", logo: "https://sn.shikshanation.com/certificates/msme.webp" },
  { name: "Startup India", logo: "https://sn.shikshanation.com/certificates/startup-india.webp" },
  { name: "Skill India", logo: "https://sn.shikshanation.com/certificates/skill-india.webp" },
  { name: "NSDC", logo: "https://sn.shikshanation.com/certificates/nsdc.webp" },
];

export default function LogoSlider() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  // Manual scroll functionality
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.5;

      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll logic using requestAnimationFrame for smoothness
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 1.2;

    const autoScroll = () => {
      if (!isPausedRef.current) {
        container.scrollLeft += speed;
        // Reset scroll position for infinite loop effect
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full bg-white py-6 border-t border-b border-gray-100 relative group overflow-hidden m-0 p-0">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 relative">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/95 shadow-lg border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-start hover:text-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll Left"
        >
          <RiArrowLeftSLine size={24} />
        </button>

        {/* Logo Container */}
        <div
          ref={scrollContainerRef}
          className="w-full flex overflow-x-auto select-none no-scrollbar gap-8 items-center"
          onMouseEnter={() => (isPausedRef.current = true)}
          onMouseLeave={() => (isPausedRef.current = false)}
          style={{ scrollbarWidth: "none" }}
        >
          {[...logoData, ...logoData].map((item, index) => (
            <div
              key={index}
              style={{ width: "175px", height: "131px" }}
              className="flex items-center justify-center flex-shrink-0 p-2 mix-blend-multiply"
            >
              <img
                src={item.logo}
                alt={item.name}
                style={{
                  width: "175px",
                  height: "131px",
                  objectFit: "contain",
                }}
                className="pointer-events-none transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/95 shadow-lg border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-start hover:text-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll Right"
        >
          <RiArrowRightSLine size={24} />
        </button>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}