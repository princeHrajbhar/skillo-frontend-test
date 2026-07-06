'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    badge: '📝 Latest Articles',
    title: 'Master the Art of',
    highlight: 'Technical Writing',
    description:
      'Learn how to write clear, engaging, and impactful technical content that resonates with developers.',
  },
  {
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    badge: '📚 Trending Topics',
    title: 'Stay Ahead with',
    highlight: 'Modern Tech Trends',
    description:
      'Discover the latest developments in AI, Web3, cloud computing, and software architecture.',
  },
  {
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    badge: '💡 In-Depth Guides',
    title: 'Build Your',
    highlight: 'Developer Knowledge Base',
    description:
      'Access comprehensive tutorials, case studies, and expert insights to level up your skills.',
  },
  {
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
    badge: '🎯 Career Growth',
    title: 'Accelerate Your',
    highlight: 'Developer Career',
    description:
      'Get actionable advice, interview tips, and career strategies from industry professionals.',
  },
];

export default function BlogHeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[400px] overflow-hidden bg-white">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === index
              ? 'opacity-100 z-10'
              : 'opacity-0 z-0'
          }`}
        >
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <div className="relative z-20 flex h-full items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <div className="mb-6 inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
                {slide.badge}
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {slide.title}
                <span className="block bg-gradient-to-r from-[#016ab7] to-[#6cb84d] bg-clip-text text-transparent">
                  {slide.highlight}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-gray-200 sm:text-xl">
                {slide.description}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#016ab7] to-[#6cb84d] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-[#016ab7]/25"
                >
                  Read Our Blog
                </Link>

                <Link
                  href="/blog/subscribe"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-gradient-to-r hover:from-[#016ab7] hover:to-[#6cb84d] hover:text-white"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-gradient-to-r hover:from-[#016ab7] hover:to-[#6cb84d] hover:text-white"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              current === index
                ? 'w-8 bg-gradient-to-r from-[#016ab7] to-[#6cb84d]'
                : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}