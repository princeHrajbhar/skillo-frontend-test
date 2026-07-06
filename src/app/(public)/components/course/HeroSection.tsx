// HeroSection with image as background
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    // Added 'h-[400px]' (or your preferred height) to fix the section size
    <section className="relative bg-white h-[400px] overflow-hidden ">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 py-40">
        <Image
          src="/course_page_banner.avif"
          alt="Coding workspace with laptop and coffee"
          fill
          // Changed to 'object-center' and 'object-cover' 
          // to ensure the image fills the area gracefully
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      {/* Changed flex classes to center content vertically within the fixed height */}
      <div className="relative z-10 flex h-full items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-white">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
            <span className="mr-2">🚀</span>
            Start Your Journey Today
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Master Modern
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Web Development
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-gray-200 sm:text-xl max-w-xl">
            Learn Next.js, TypeScript, and TailwindCSS through project-based courses.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="#courses"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105"
            >
              Browse Courses
            </Link>
            <Link
              href="/free-lesson"
              className="inline-flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/20 hover:scale-105"
            >
              Watch Free Lesson
            </Link>
          </div>
        </div>
      </div>
    </section>
    
  );
}