"use client";

import { Search } from "lucide-react";

export default function HeroSearchBanner() {
  return (
    <section className="relative overflow-hidden bg-[#006d70] py-10">
      {/* Dot Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        {/* Search Bar */}
        <div className="mx-auto flex max-w-4xl items-center">
          <div className="flex h-11 flex-1 items-center rounded-full border border-white/70 bg-white/10 px-4">
            <input
              type="text"
              placeholder="Search courses, skills or career paths"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
            />
          </div>

          <button className="ml-2 flex h-11 items-center gap-1 rounded-full border border-white bg-[#0a9ba0] px-5 text-sm font-semibold text-white hover:bg-[#088b8f]">
            Search
            <Search size={16} />
          </button>
        </div>

        {/* Heading */}
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Skills that get you hired,
            <span className="text-[#9de4e3]">
              {" "}
              before everyone else
            </span>
          </h1>

          <p className="mt-3 text-sm text-white/80 md:text-base">
            Career-ready courses across AI, product, marketing, data and design
          </p>
        </div>

        {/* Stats Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-white">
            5,000+ learners
          </span>

          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-white">
            92% Placement Rate
          </span>

          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-white">
            Dual certification, NSDC
          </span>

          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-white">
            Job placement support
          </span>
        </div>
      </div>
    </section>
  );
}