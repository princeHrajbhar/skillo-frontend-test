"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Pause, Play } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
  course: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Michael Chen",
    role: "Frontend Developer",
    company: "Tech Corp",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "This course completely transformed my career! The hands-on projects and real-world examples helped me land my first React developer job. The instructor explains complex concepts in a way that's easy to understand.",
    course: "Master React & TypeScript",
  },
  {
    id: 2,
    name: "Emily Rodriguez",
    role: "Software Engineer",
    company: "Startup Inc",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "Best investment I've made in my career. The TypeScript section alone was worth the price. I'm now writing type-safe code confidently and my team has noticed the improvement.",
    course: "Master React & TypeScript",
  },
  {
    id: 3,
    name: "David Kim",
    role: "Full Stack Developer",
    company: "E-commerce Co",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 4,
    text: "Excellent curriculum covering everything from basics to advanced patterns. The community support is amazing - instructors respond quickly and the Discord community is very helpful.",
    course: "Master React & TypeScript",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    role: "Tech Lead",
    company: "Innovation Lab",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    text: "I've taken many online courses, but this one stands out. The projects are challenging and relevant, and the instructor's teaching style keeps you engaged throughout.",
    course: "Master React & TypeScript",
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Junior Developer",
    company: "Digital Agency",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5,
    text: "From zero to job-ready in 3 months! The portfolio projects gave me something concrete to show employers. Landed my first dev job within weeks of completing the course.",
    course: "Master React & TypeScript",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    role: "Software Engineer",
    company: "FinTech Solutions",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    rating: 5,
    text: "The instructor's teaching style is amazing. Complex concepts are broken down into simple, easy-to-understand lessons. Highly recommended!",
    course: "Master React & TypeScript",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Scroll to active testimonial when index changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollAmount = currentIndex * (scrollContainerRef.current.clientWidth / 1.5);
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const visibleTestimonials = 3;

  return (
    <div className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-block rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={{ borderColor: '#6CB84D', color: '#6CB84D' }}
          >
            Testimonials
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            What Our Students Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Join 5000+ successful students who transformed their careers
          </p>
        </div>

        {/* Auto-play Toggle Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={toggleAutoPlay}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            {isAutoPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause Auto-play</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Resume Auto-play</span>
              </>
            )}
          </button>
        </div>

        {/* Scrollable Testimonials Container */}
        <div className="relative mt-8">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-50 md:-left-4"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-50 md:-right-4"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth px-2 pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {testimonials.map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className={`w-full flex-shrink-0 transition-all duration-500 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${
                  idx === currentIndex ? "scale-100 opacity-100" : "scale-95 opacity-70"
                }`}
              >
                <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg">
                  {/* Rating */}
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>

                  {/* Text */}
                  <p className="mb-6 text-gray-600 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl bg-white p-8 shadow-sm md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">4.8</div>
            <div className="mt-1 text-sm text-gray-600">Average Rating</div>
            <div className="mt-2 flex justify-center">
              <StarRating rating={5} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">5,000+</div>
            <div className="mt-1 text-sm text-gray-600">Students Enrolled</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">98%</div>
            <div className="mt-1 text-sm text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1,200+</div>
            <div className="mt-1 text-sm text-gray-600">Reviews</div>
          </div>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}