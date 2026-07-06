"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  User,
} from "lucide-react";

const reviews = [
  {
    name: "Wanda Wingleton",
    role: "Lepidopterist at Butterflai",
    review:
      "Your expectations will fly sky high. I felt like I was soaring.",
  },
  {
    name: "Sarah Johnson",
    role: "AI Product Manager",
    review:
      "One of the best AI learning experiences I've had. Practical and easy to follow.",
  },
  {
    name: "Michael Lee",
    role: "Software Engineer",
    review:
      "The projects were incredibly useful and helped me land freelance work.",
  },
  {
    name: "Emily Carter",
    role: "Digital Strategist",
    review:
      "Loved the hands-on approach. Everything was explained clearly.",
  },
  {
    name: "David Brown",
    role: "Automation Specialist",
    review:
      "Fantastic course. I started automating tasks at work after just a few modules.",
  },
];

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let frame: number;

    const animate = () => {
      if (!paused) {
        container.scrollLeft += 0.5;

        const firstCard =
          container.children[0] as HTMLElement;

        if (
          firstCard &&
          container.scrollLeft >=
            firstCard.offsetWidth + 16
        ) {
          container.appendChild(firstCard);
          container.scrollLeft -=
            firstCard.offsetWidth + 16;
        }
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [paused]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  const items = [
    ...reviews,
    ...reviews,
    ...reviews,
  ];

  return (
    <section className="w-full bg-[#f5f5f5] py-8">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[30px] font-bold text-[#23363A]">
            Reviews
          </h2>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7dcdf] bg-white transition hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={scrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7dcdf] bg-white transition hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="
            flex
            gap-4
            overflow-x-auto
            scroll-smooth
            select-none
            pb-2
            [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none]
            [scrollbar-width:none]
          "
        >
          {items.map((review, index) => (
            <div
              key={`${review.name}-${index}`}
              className="
                min-w-[280px]
                max-w-[280px]
                flex-shrink-0
                rounded-lg
                border
                border-[#b7dfe6]
                bg-white
                p-4
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >
              {/* Stars */}
              <div className="mb-3 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-[#00B6C1] text-[#00B6C1]"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="min-h-[70px] text-[13px] leading-relaxed text-[#2f4b52]">
                {review.review}
              </p>

              {/* User */}
              <div className="mt-4 flex items-center gap-3 border-t border-[#eef2f3] pt-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d7dcdf] bg-[#fafafa]">
                  <User
                    size={14}
                    className="text-[#607076]"
                  />
                </div>

                <div>
                  <h4 className="text-[12px] font-semibold text-[#2f4b52]">
                    {review.name}
                  </h4>

                  <p className="text-[11px] text-[#8b9ca1]">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}