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
  className="relative w-full"
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
  <div
    className="flex transition-transform duration-700 ease-in-out"
    style={{
      transform: `translateX(-${currentSlide * 100}%)`,
    }}
  >
    {banners.map((banner, index) => (
      <div
        key={index}
        className="min-w-full flex justify-center bg-white"
      >
        <Image
          src={banner}
          alt={`Banner ${index + 1}`}
          width={1920}
          height={700}
          priority={index === 0}
          className="w-full h-auto max-w-full"
          sizes="100vw"
        />
      </div>
    ))}
  </div>
</div>
    </section>
  );
}