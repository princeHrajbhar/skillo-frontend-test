
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">

        <div className="relative overflow-hidden rounded-3xl border border-slate-300 bg-white">

          {/* Blue Glow */}
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-start/30 blur-3xl" />

          {/* Green Glow */}
          <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-brand-end/30 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">

            {/* Content */}
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-brand-start/20 bg-brand-start-soft px-3 py-1 text-sm font-medium text-brand-start">
                Start Learning Today
              </span>

              <h2 className="mt-4 text-3xl font-bold text-slate-900 lg:text-4xl">
                Turn Your Skills Into Career Opportunities
              </h2>

              <p className="mt-3 text-slate-600">
                Learn from industry experts, build real-world projects,
                and get job-ready with structured programs.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="btn-brand inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold"
              >
                Explore Courses
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-brand-start px-6 py-3 font-semibold text-brand-start transition-all hover:bg-brand-start-soft"
              >
                Talk to Expert
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}