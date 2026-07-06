"use client";

import { ArrowRight } from "lucide-react";

const DOT_STYLE = {
  backgroundImage:
    "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
};

export default function FreeResourcesBanner() {
  return (
    <section className="py-3 mx-6">
      <div
        className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-hidden rounded-md border border-[#0ca7a7] bg-[#08a99d] px-4 py-3"
      >
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-70"
          style={DOT_STYLE}
        />

        {/* Left Content */}
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-white md:text-base">
            Learn what your Industry seeks.
          </h3>

          <p className="mt-0.5 text-[10px] text-white/85 md:text-xs">
            Full course access and real instructor supports all in one place.
          </p>
        </div>

        {/* Right Buttons */}
        <div className="relative z-10 flex shrink-0 items-center gap-2">
          <button
            className="
              flex items-center gap-1
              rounded-md
              border border-white
              bg-white/10
              px-3 py-2
              text-xs font-semibold text-white
              transition hover:bg-white/20
            "
          >
            Self Assessment quiz
          </button>

          <button
            className="
              flex items-center gap-1
              rounded-md
              border border-white
              bg-white
              px-3 py-2
              text-xs font-semibold text-[#0a8f88]
              transition hover:bg-slate-100
            "
          >
            Talk to an Advisor
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}