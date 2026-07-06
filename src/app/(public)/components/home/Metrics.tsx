"use client";

const stats = [
  { value: "80%", label: "Average Salary Hike" },
  { value: "92%", label: "Placement Rate" },
  { value: "5,000+", label: "Career Transitions" },
  { value: "100+", label: "Companies Trust Us" },
];

export default function Metrics() {
  return (
    <section className="bg-[#07163B] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-brand-end/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-end">
            Our Impact
          </span>

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Numbers That Define Excellence
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center transition-all hover:bg-white/[0.08]"
            >
              <p className="text-3xl font-bold text-brand-end sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}