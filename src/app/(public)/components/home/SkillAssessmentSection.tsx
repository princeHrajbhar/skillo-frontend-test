"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  TrendingUp,
  Briefcase,
  Sparkles,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";

const stats = [
  {
    value: "83%",
    title: "Employers Prioritize AI Skills",
    source: "IBM Global AI Adoption Index",
    icon: BrainCircuit,
  },
  {
    value: "2.3M+",
    title: "AI Jobs Expected Globally",
    source: "World Economic Forum",
    icon: Briefcase,
  },
  {
    value: "74%",
    title: "Professionals Need Reskilling",
    source: "LinkedIn Workplace Learning Report",
    icon: TrendingUp,
  },
  {
    value: "5X",
    title: "Higher Demand For AI Talent",
    source: "McKinsey & Company",
    icon: Sparkles,
  },
];

export default function SkillAssessmentSection() {
  return (
    <section className="bg-slate-50 py-14 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Assessment CTA */}
        <div className="relative overflow-hidden rounded-[36px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-purple-50 shadow-xl">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_35%)]" />
          <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.15),transparent_35%)]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left */}
            <div className="px-8 py-10 md:px-12 lg:py-14">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-violet-700">
                Career Assessment
              </span>

              <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
                Not Sure Which
                <br />
                Path To Choose?
              </h2>

              <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-600">
                Take our AI-powered Skill Assessment and discover the perfect
                learning roadmap tailored to your goals, experience level, and
                dream career.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "AI Engineering",
                  "Full Stack",
                  "Cybersecurity",
                  "Data Science",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="#"
                  className="inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-5 text-base font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600"
                >
                  Free Skill Assessment
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Exclusive Scholarship upto ₹7,500
                </div>
              </div>

              <p className="mt-6 text-base font-semibold italic text-violet-600">
                Hurry up! Don't miss the exclusive discount ₹7500 on courses.
              </p>
            </div>

            {/* Right */}
            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden">
              <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-violet-200/40 blur-3xl" />
              <div className="absolute left-10 bottom-10 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl" />

              <div className="absolute right-12 top-16 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white shadow-2xl rotate-[-12deg]">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest opacity-80">
                    Scholarship
                  </p>
                  <p className="mt-2 text-4xl font-black">₹7500</p>
                  <p className="text-lg font-bold">OFF</p>
                </div>
              </div>

              <div className="relative">
                <div className="h-96 w-80 rounded-[40px] bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center px-10 text-center text-white">
                    <BrainCircuit className="h-20 w-20" />
                    <h3 className="mt-6 text-3xl font-black">
                      AI Career Match
                    </h3>
                    <p className="mt-4 text-white/80">
                      Discover the best technology path based on your skills and
                      interests.
                    </p>
                  </div>
                </div>
              </div>

              <svg
                className="absolute right-0 top-12 h-40 w-40 text-violet-300"
                viewBox="0 0 200 100"
                fill="none"
              >
                <path
                  d="M0 80C30 20 60 20 90 60C120 100 150 10 200 30"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Problem Awareness */}
        <div className="mt-20">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-red-700">
              Problem Awareness
            </span>

            <h2 className="mx-auto mt-6 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
              The AI Skills Gap Is Real —
              <br />
              Traditional Learning Won't Get You Hired
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Employers are hiring for practical AI, Agentic AI, LLM, Cloud,
              and Cybersecurity skills while most graduates still learn outdated
              theory-first content.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Icon className="h-12 w-12 text-violet-600" />

                  <h3 className="mt-5 text-5xl font-black text-slate-900">
                    {stat.value}
                  </h3>

                  <p className="mt-4 text-lg font-bold text-slate-800">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-sm text-slate-500">
                    Source: {stat.source}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Testimonial / Video */}
          <div className="mt-14 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
            <div className="grid lg:grid-cols-[1fr_420px]">
              <div className="p-8 md:p-12">
                <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                  Learner Success Story
                </span>

                <h3 className="mt-5 text-3xl font-black text-slate-900 md:text-4xl">
                  From Non-Tech Background To AI Engineer
                </h3>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  "I spent years learning through traditional courses but never
                  felt job-ready. After working on real AI projects, deploying
                  LLM applications, and building portfolio-ready systems, I
                  landed my first AI Engineering role."
                </p>

                <div className="mt-8">
                  <h4 className="font-bold text-slate-900">
                    Priya Sharma
                  </h4>
                  <p className="text-slate-500">
                    AI Engineer • Product Company
                  </p>
                </div>
              </div>

              <div className="relative flex min-h-[320px] items-center justify-center bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700">
                <button
                  aria-label="Play testimonial video"
                  className="group flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl transition-all duration-300 hover:scale-110"
                >
                  <PlayCircle className="h-14 w-14 text-violet-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}