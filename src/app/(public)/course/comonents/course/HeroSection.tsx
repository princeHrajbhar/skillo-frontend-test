'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'https://img.magnific.com/free-photo/handsome-young-man-shirt-pointing-fingers-left-promo-showing-logo-standing-blue-background_1258-153241.jpg?semt=ais_hybrid&w=740&q=80',
    badge: '🚀 Start Your Journey Today',
    title: 'Master Modern',
    highlight: 'Web Development',
    description:
      'Learn Next.js, TypeScript, and TailwindCSS through project-based courses.',
  },
  {
    image: 'https://img.magnific.com/free-photo/portrait-smiling-korean-woman-pointing-upper-left-corner-showing-discount-sale-banner-standing_1258-149432.jpg?semt=ais_hybrid&w=740&q=80',
    badge: '🔥 Trending Courses',
    title: 'Become an',
    highlight: 'Full Stack Developer',
    description:
      'Build real-world applications using React, Node.js, MongoDB and Next.js.',
  },
  {
    image: 'https://static.vecteezy.com/system/resources/previews/048/912/104/non_2x/portrait-of-enthusiastic-smiling-woman-female-entrepreneur-pointing-fingers-left-and-showing-advertisement-showing-announcement-white-background-photo.jpg',
    badge: '💡 Learn by Building',
    title: 'AI &',
    highlight: 'Modern Technologies',
    description:
      'Explore AI, cloud computing, system design and scalable architectures.',
  },
  {
    image: '/course_page_banner.avif',
    badge: '🎯 Career Focused',
    title: 'Land Your',
    highlight: 'Dream Job',
    description:
      'Interview preparation, resume building and placement assistance included.',
  },
];

export default function HeroSection() {
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
                  href="#courses"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#016ab7] to-[#6cb84d] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-[#016ab7]/25"
                >
                  Browse Courses
                </Link>

                <Link
                  href="/free-lesson"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
                >
                  Watch Free Lesson
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