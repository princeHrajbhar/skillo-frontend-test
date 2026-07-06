"use client";



export default function CurriculumFrameworkTeaser() {
  return (
  <section className="bg-white py-20 lg:py-28">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-violet-700">
        Curriculum Framework
      </span>

      <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
        Learn → Build → Deploy → Get Hired
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
        A structured learning ecosystem designed to transform beginners into
        industry-ready AI Engineers, Agentic AI Developers, Cloud Experts, and
        Cybersecurity Professionals.
      </p>
    </div>

    <div className="relative mt-20">
      <div className="absolute left-0 top-10 hidden h-1 w-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 via-emerald-500 to-orange-500 lg:block" />

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Learn */}
        <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-2xl font-black text-white">
            1
          </div>

          <h3 className="mt-6 text-3xl font-black text-slate-900">
            Learn
          </h3>

          <p className="mt-4 leading-7 text-slate-600">
            Master fundamentals through structured learning paths,
            expert-led sessions, and industry-aligned content.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Generative AI",
              "Prompt Engineering",
              "LLM Fundamentals",
              "AI Engineering",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-slate-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Build */}
        <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white">
            2
          </div>

          <h3 className="mt-6 text-3xl font-black text-slate-900">
            Build
          </h3>

          <p className="mt-4 leading-7 text-slate-600">
            Create real-world projects, AI applications, autonomous agents,
            and production-ready systems.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Agentic Systems",
              "RAG Pipelines",
              "MCP Architecture",
              "AI Products",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-slate-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Deploy */}
        <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-black text-white">
            3
          </div>

          <h3 className="mt-6 text-3xl font-black text-slate-900">
            Deploy
          </h3>

          <p className="mt-4 leading-7 text-slate-600">
            Learn cloud deployment, observability, scaling, monitoring,
            and enterprise-grade operations.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "LLM Ops",
              "Cloud Deployment",
              "Vector Databases",
              "Production Systems",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-slate-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Get Hired */}
        <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-black text-white">
            4
          </div>

          <h3 className="mt-6 text-3xl font-black text-slate-900">
            Get Hired
          </h3>

          <p className="mt-4 leading-7 text-slate-600">
            Portfolio reviews, mock interviews, resume optimization,
            networking, and placement support.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Interview Prep",
              "Portfolio Building",
              "Career Mentorship",
              "Placement Support",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-slate-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}