// app/components/testimonials/TestimonialCarousel.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { Star, Briefcase, Building2 } from "lucide-react";

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
};

const DUMMY_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    content:
      "The AI course completely transformed my career. Within 3 months of completing the program, I landed my dream job at Google!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "Amazon",
    content:
      "The product management course gave me practical skills that I immediately applied at work. Got promoted within 6 months!",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Data Scientist",
    company: "Microsoft",
    content:
      "Best investment in my career. The data science program is comprehensive and the mentors are exceptional.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Full Stack Developer",
    company: "Startup Founder",
    content:
      "From zero to job-ready in 8 months. The web development bootcamp changed my life completely.",
    rating: 4,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "UX Designer",
    company: "Apple",
    content:
      "The UI/UX course helped me build an impressive portfolio. Now working at Apple!",
    rating: 5,
  },
  {
    id: 6,
    name: "James Wilson",
    role: "CTO",
    company: "AI Startup",
    content:
      "The generative AI program gave me cutting-edge skills. Launched my own AI startup after graduation.",
    rating: 5,
  },
  {
    id: 7,
    name: "Maria Garcia",
    role: "Marketing Manager",
    company: "Meta",
    content:
      "Digital marketing course was game-changing. Increased my salary by 80% after certification.",
    rating: 5,
  },
  {
    id: 8,
    name: "Robert Taylor",
    role: "Cloud Architect",
    company: "AWS",
    content:
      "Cloud computing program is world-class. The hands-on projects prepared me for real-world challenges.",
    rating: 4,
  },
];

// Avatar background colors cycling through brand palette shades
const AVATAR_COLORS = [
  "#016AB7",
  "#6CB84D",
  "#0a52a0",
  "#52a035",
  "#015fa3",
  "#5aaa3e",
  "#024f8a",
  "#4d9933",
];

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
  title?: string;
  subtitle?: string;
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials = DUMMY_TESTIMONIALS,
  title = "Student Success Stories",
  subtitle = "Join 10,000+ successful graduates working at top companies worldwide",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(false);

  const duplicatedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    let animationId: number;

    const animate = () => {
      if (!isHoveredRef.current) {
        scrollPosition += 1.2;
        if (scrollPosition >= scrollContainer.scrollWidth / 4) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="w-full bg-white py-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span
            className="inline-block rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={{ borderColor: '#016AB7', color: '#016AB7' }}
          >
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-3 text-base text-slate-500 max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Scrolling cards */}
      <div
        ref={scrollRef}
        className="overflow-x-auto cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
      >
        <div className="flex gap-5 w-max px-6">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="w-[300px] sm:w-[320px] flex-shrink-0 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-5">
                {/* Stars */}
                <div className="mb-3">{renderStars(testimonial.rating)}</div>

                {/* Content */}
                <p className="text-sm leading-relaxed text-slate-700 line-clamp-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* User */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{
                      background: AVATAR_COLORS[testimonial.id % AVATAR_COLORS.length],
                    }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {testimonial.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                      <Briefcase className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{testimonial.role}</span>
                      <span className="text-slate-300 mx-0.5">•</span>
                      <Building2 className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{testimonial.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TestimonialCarousel;