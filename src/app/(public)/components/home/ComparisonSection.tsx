"use client";

import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

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