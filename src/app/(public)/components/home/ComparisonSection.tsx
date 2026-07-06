"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, Rocket, BrainCircuit, Briefcase, Trophy } from "lucide-react";

const comparisonData = [
  {
    feature: "Live Industry Mentorship",
    platform: true,
    traditional: false,
    recorded: false,
    bootcamp: false,
    academy: true,
  },
  {
    feature: "Agentic AI & MCP Curriculum",
    platform: true,
    traditional: false,
    recorded: false,
    bootcamp: false,
    academy: false,
  },
  {
    feature: "Hands-on Deployment Projects",
    platform: true,
    traditional: true,
    recorded: false,
    bootcamp: false,
    academy: true,
  },
  {
    feature: "Real Production Systems",
    platform: true,
    traditional: false,
    recorded: false,
    bootcamp: true,
    academy: true,
  },
  {
    feature: "Career Guidance & Job Support",
    platform: true,
    traditional: false,
    recorded: false,
    bootcamp: false,
    academy: true,
  },
  {
    feature: "Portfolio Building",
    platform: true,
    traditional: false,
    recorded: true,
    bootcamp: true,
    academy: true,
  },
  {
    feature: "AI + Cybersecurity Tracks",
    platform: true,
    traditional: false,
    recorded: true,
    bootcamp: false,
    academy: false,
  },
  {
    feature: "Emerging Technology Focus",
    platform: true,
    traditional: false,
    recorded: true,
    bootcamp: true,
    academy: true,
  },
];

const highlights = [
  {
    icon: Rocket,
    title: "Real Deployments",
    description: "Build, deploy, monitor, and scale production-grade applications.",
    color: "#016AB7",
  },
  {
    icon: BrainCircuit,
    title: "Emerging Technologies",
    description: "Learn Agentic AI, MCP, RAG, LLM Ops, and next-generation systems.",
    color: "#6CB84D",
  },
  {
    icon: Briefcase,
    title: "Career Acceleration",
    description: "Interview preparation, resume optimization, and hiring guidance.",
    color: "#016AB7",
  },
  {
    icon: Trophy,
    title: "Outcome Driven",
    description: "Structured around skills, projects, and measurable career growth.",
    color: "#6CB84D",
  },
];

export default function ComparisonSection() {
  return (
    <section className="bg-slate-50 py-10 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-brand-end px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-end">
            Why Choose Us
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            What Makes Us Different
          </h2>

          {/* <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Compare the learning experience, industry relevance, and career outcomes
            offered by different types of learning platforms.
          </p> */}
        </div>

        {/* Highlights - Title and Icon Inline */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: `${item.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Comparison Table - Same table for all devices with horizontal scroll on mobile */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {/* Horizontal scroll container for mobile */}
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full lg:min-w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 sm:px-8 py-4 sm:py-5 text-left text-sm font-semibold text-slate-700 sticky left-0 bg-slate-50 z-10">
                    Features
                  </th>
                  <th className="bg-brand-gradient px-4 sm:px-6 py-4 sm:py-5 text-center text-sm font-bold text-white">
                    Our Platform
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center text-sm font-semibold text-slate-600">
                    Traditional
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center text-sm font-semibold text-slate-600">
                    Recorded Courses
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center text-sm font-semibold text-slate-600">
                    Tech Bootcamps
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center text-sm font-semibold text-slate-600">
                    Career Academies
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisonData.map((row, index) => (
                  <tr
                    key={row.feature}
                    className="border-b border-slate-100 last:border-none transition-colors hover:bg-slate-50"
                  >
                    <td className="px-4 sm:px-8 py-3 sm:py-4 text-sm font-semibold text-slate-800 sticky left-0 bg-white z-10">
                      {row.feature}
                    </td>

                    {/* Our Platform - Green Check */}
                    <td className="bg-brand-start-soft/60 text-center py-3 sm:py-4">
                      <CheckCircle2 className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-brand-end" />
                    </td>

                    {/* Traditional - Red X for false, Green Check for true */}
                    <td className="text-center py-3 sm:py-4">
                      {row.traditional ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-brand-end" />
                      ) : (
                        <XCircle className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                      )}
                    </td>

                    {/* Recorded Courses - Red X for false, Green Check for true */}
                    <td className="text-center py-3 sm:py-4">
                      {row.recorded ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-brand-end" />
                      ) : (
                        <XCircle className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                      )}
                    </td>

                    {/* Tech Bootcamps - Red X for false, Green Check for true */}
                    <td className="text-center py-3 sm:py-4">
                      {row.bootcamp ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-brand-end" />
                      ) : (
                        <XCircle className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                      )}
                    </td>

                    {/* Career Academies - Red X for false, Green Check for true */}
                    <td className="text-center py-3 sm:py-4">
                      {row.academy ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-brand-end" />
                      ) : (
                        <XCircle className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}