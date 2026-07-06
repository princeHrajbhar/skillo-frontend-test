"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const banners = [
  "/home/1.png",
  "/home/2.png",
  "/home/3.png",
  "/home/4.png",
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();

    setTouchStart(null);
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div
        className="relative w-full h-[160px] sm:h-[260px] lg:h-[380px] xl:h-[450px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className="relative min-w-full h-full flex-shrink-0"
            >
              <Image
                src={banner}
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Previous */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous"
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
        >
          ❮
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next"
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
        >
          ❯
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-7 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}