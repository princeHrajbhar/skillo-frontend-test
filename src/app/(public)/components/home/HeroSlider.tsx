"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  "/home/1.png",
  "/home/2.png",
  "/home/3.png",
  "/home/4.png",
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Keeps section height equal to banner */}
      <Image
        src={banners[0]}
        alt=""
        width={1920}
        height={650}
        priority
        className="w-full h-auto invisible pointer-events-none"
      />

      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={banner}
            alt={`Banner ${index + 1}`}
            width={1920}
            height={650}
            priority={index === 0}
            draggable={false}
            className="w-full h-auto select-none"
          />
        </div>
      ))}

      {/* Previous */}
      <button
        onClick={prevSlide}
        aria-label="Previous"
        className="absolute left-2 sm:left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition p-1.5 sm:p-2 md:p-3"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
      </button>

      {/* Next */}
      <button
        onClick={nextSlide}
        aria-label="Next"
        className="absolute right-2 sm:right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition p-1.5 sm:p-2 md:p-3"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              current === index
                ? "w-5 sm:w-7 md:w-8 h-1.5 sm:h-2 bg-blue-600"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}