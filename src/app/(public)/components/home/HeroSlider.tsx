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

// Duplicate first slide for seamless infinite loop
const slides = [...banners, banners[0]];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto Slide
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Infinite Loop Reset
  useEffect(() => {
    if (currentSlide === banners.length) {
      const timer = setTimeout(() => {
        setEnableTransition(false);
        setCurrentSlide(0);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setEnableTransition(true);
          });
        });
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
    pauseAutoPlay();
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      setEnableTransition(false);
      setCurrentSlide(banners.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          setCurrentSlide(banners.length - 1);
        });
      });
    } else {
      setCurrentSlide((prev) => prev - 1);
    }

    pauseAutoPlay();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    pauseAutoPlay();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();

    setTouchStart(null);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white m-0 p-0 leading-[0]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div
        className="relative w-full m-0 p-0 leading-[0]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slider */}
        <div
          className={`flex ${
            enableTransition
              ? "transition-transform duration-700 ease-in-out"
              : ""
          } m-0 p-0 leading-[0]`}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((banner, index) => (
            <div
              key={index}
              className="min-w-full w-full flex justify-center items-center bg-white m-0 p-0 leading-[0]"
            >
              <div className="relative w-full m-0 p-0 leading-[0]">
                <Image
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  width={1920}
                  height={600}
                  priority={index === 0}
                  className="block w-full h-auto m-0 p-0 leading-[0]"
                  sizes="100vw"
                  style={{ display: 'block' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Previous */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur transition hover:scale-110 border border-gray-200"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Next */}
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur transition hover:scale-110 border border-gray-200"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide % banners.length === index
                  ? "w-10 h-2 bg-[#016ab7]"
                  : "w-2 h-2 bg-[#016ab7]/40 hover:bg-[#016ab7]/60"
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="absolute bottom-5 right-5 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
          {(currentSlide % banners.length) + 1} / {banners.length}
        </div>
      </div>
    </section>
  );
}