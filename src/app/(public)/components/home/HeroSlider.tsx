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
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images to prevent empty space
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = banners.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error loading images:", error);
        setImagesLoaded(true); // Still show slider even if images fail
      }
    };

    loadImages();
  }, []);

  // Auto Slide
  useEffect(() => {
    if (!isAutoPlaying || !imagesLoaded) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, imagesLoaded]);

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

  // Don't render until images are loaded to prevent empty space
  if (!imagesLoaded) {
    return (
      <section className="hero-slider w-full overflow-hidden bg-white">
        <div className="relative w-full" style={{ paddingBottom: "31.25%" }}>
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="hero-slider w-full overflow-hidden bg-white m-0 p-0 leading-[0]"
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
                  style={{ 
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    margin: 0,
                    padding: 0,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Previous Button - Smaller */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition hover:scale-110 border border-gray-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Next Button - Smaller */}
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition hover:scale-110 border border-gray-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide % banners.length === index
                  ? "w-8 h-1.5 bg-[#016ab7]"
                  : "w-1.5 h-1.5 bg-[#016ab7]/40 hover:bg-[#016ab7]/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter - Smaller */}
        <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur">
          {(currentSlide % banners.length) + 1} / {banners.length}
        </div>
      </div>
    </section>
  );
}