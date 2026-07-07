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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      nextSlide();
      pauseAutoPlay();
    } else if (diff < -50) {
      prevSlide();
      pauseAutoPlay();
    }

    setTouchStart(null);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div
        className="relative w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slider */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className="relative min-w-full w-full
                         h-[180px]
                         sm:h-[250px]
                         md:h-[340px]
                         lg:h-[430px]
                         xl:h-[520px]
                         overflow-hidden bg-white"
            >
              <Image
                src={banner}
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-contain object-center"
              />
            </div>
          ))}
        </div>

        {/* Previous */}
        <button
          onClick={() => {
            prevSlide();
            pauseAutoPlay();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-3 shadow-lg transition hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next */}
        <button
          onClick={() => {
            nextSlide();
            pauseAutoPlay();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-3 shadow-lg transition hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                pauseAutoPlay();
              }}
              className={`rounded-full transition-all ${
                currentSlide === index
                  ? "w-10 h-2 bg-[#016ab7]"
                  : "w-2 h-2 bg-[#016ab7]/40"
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
          {currentSlide + 1} / {banners.length}
        </div>
      </div>
    </section>
  );
}