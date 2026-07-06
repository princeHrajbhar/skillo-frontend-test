"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export default function CourseHero() {
  return (
    <section className="relative border-t-2 border-[#00C4CC] bg-[#CBE4E7]">
      <div className="mx-auto max-w-[1280px] px-6 pt-3 pb-10">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1 text-[11px] font-medium text-[#168e98]">
          <Link href="/">Home</Link>
          <span>{">"}</span>
          <Link href="/courses">Courses</Link>
          <span>{">"}</span>
          <span>Machine Learning</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left */}
          <div className="pr-8">
            <h1 className="text-[44px] font-extrabold leading-none text-[#27434A]">
              AI-ML Automation Mastery
            </h1>

            <p className="mt-3 max-w-[470px] text-[15px] leading-[1.2] text-[#34545B]">
              Dive deep into neural networks, computer vision,
              natural language processing, and cutting-edge AI
              technologies.
            </p>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#00B4AC] px-3 py-1 text-[10px] font-bold text-white">
                POPULAR
              </span>

              <div className="flex items-center gap-1 rounded-md border bg-white px-2 py-1 text-[11px]">
                <Star
                  size={11}
                  className="fill-yellow-400 text-yellow-400"
                />
                <span className="font-bold">4.7</span>
                <span className="text-[#2380C4]">(159 Ratings)</span>
              </div>

              <div className="rounded-md border bg-white px-2 py-1 text-[11px] font-semibold">
                1,194 Students
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5 flex h-[72px] w-[315px] overflow-hidden rounded-2xl bg-[#00A651] shadow-sm">
              <div className="flex flex-1 items-center justify-center">
                <span className="text-[18px] font-bold text-white">
                  Enroll Now
                </span>
              </div>

              <div className="flex items-center border-l border-white/30 px-6">
                <div>
                  <div className="text-[24px] font-bold text-white">
                    ₹15,999
                  </div>
                  <div className="text-[11px] text-white/70 line-through">
                    ₹31,999
                  </div>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="mt-4 text-[13px] text-[#2E4B52]">
              <span className="font-semibold">Instructors:</span>{" "}
              <a href="#" className="text-[#2380C4] underline">
                Julie S.
              </a>
              ,
              <a href="#" className="ml-1 text-[#2380C4] underline">
                Andrea D.
              </a>
            </div>

            <div className="text-[13px] text-[#2E4B52]">
              <span className="font-semibold">Last Updated:</span>{" "}
              20<sup>th</sup> June 2026
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[Z40px] w-full overflow-hidden bg-[#79BEC5]">
            <Image
              src="https://wesoftyou.com/wp-content/uploads/2024/07/AI-art-statistics-thumbnail-2.jpg"
              alt="Course Banner"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Stats Card */}
        <div className="absolute left-1/2 bottom-[-22px] w-[92%] -translate-x-1/2">
          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#6D777A] bg-[#ECECEC] md:grid-cols-4">
            {[
              ["6 Week", "Duration"],
              ["1000+", "Students"],
              ["4.8", "Avg Rating"],
              ["Beginner", "Req. Experience"],
            ].map(([title, subtitle], index) => (
              <div
                key={title}
                className={`py-3 text-center ${
                  index !== 0 ? "border-l border-[#B5BDBF]" : ""
                }`}
              >
                <div className="text-[28px] font-bold leading-none text-[#2F4B52]">
                  {title}
                </div>
                <div className="mt-1 text-[11px] text-[#6E787B]">
                  {subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-10" />
    </section>
  );
}