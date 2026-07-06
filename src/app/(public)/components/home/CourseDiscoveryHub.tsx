"use client";

import Link from "next/link";
import {
  BrainCircuit,
  ShieldCheck,
  Cloud,
  Code2,
  Database,
  BriefcaseBusiness,
  Palette,
  Bot,
  ArrowRight,
  ChevronRight,
  Filter,
} from "lucide-react";

type Category = {
  title: string;
  icon: React.ElementType;
};

type Course = {
  id: number;
  title: string;
  image: string;
  duration: string;
  salary: string;
  projects: string;
  category: string;
};

const categories: Category[] = [
  {
    title: "AI & Machine Learning",
    icon: BrainCircuit,
  },
  {
    title: "Data Science & Analytics",
    icon: Database,
  },
  {
    title: "Generative AI",
    icon: Bot,
  },
  {
    title: "Software & Tech",
    icon: Code2,
  },
  {
    title: "Management",
    icon: BriefcaseBusiness,
  },
  {
    title: "Agentic AI",
    icon: Bot,
  },
  {
    title: "Cyber Security",
    icon: ShieldCheck,
  },
  {
    title: "Cloud Computing",
    icon: Cloud,
  },
  {
    title: "Design",
    icon: Palette,
  },
];

const courses: Course[] = [
  {
    id: 1,
    title: "AI Engineering Bootcamp",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    duration: "24 Weeks",
    salary: "₹12L - ₹35L",
    projects: "18 Projects",
    category: "AI",
  },
  {
    id: 2,
    title: "Agentic AI & Autonomous Systems",
    image:
      "https://images.unsplash.com/photo-1686191128892-3a6e9d8bca9d?q=80&w=1200&auto=format&fit=crop",
    duration: "16 Weeks",
    salary: "₹15L - ₹40L",
    projects: "12 Projects",
    category: "Agentic AI",
  },
  {
    id: 3,
    title: "Generative AI & LLM Development",
    image:
      "https://images.unsplash.com/photo-1694903120050-4b0f8d8c6e7c?q=80&w=1200&auto=format&fit=crop",
    duration: "20 Weeks",
    salary: "₹14L - ₹38L",
    projects: "15 Projects",
    category: "GenAI",
  },
  {
    id: 4,
    title: "Cloud & DevOps Engineering",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    duration: "18 Weeks",
    salary: "₹10L - ₹28L",
    projects: "20 Projects",
    category: "Cloud",
  },
  {
    id: 5,
    title: "Cyber Security Expert Program",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    duration: "22 Weeks",
    salary: "₹11L - ₹30L",
    projects: "16 Projects",
    category: "Cyber",
  },
  {
    id: 6,
    title: "Data Science & Analytics",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    duration: "20 Weeks",
    salary: "₹10L - ₹25L",
    projects: "14 Projects",
    category: "Data",
  },
];

export default function CourseDiscoveryHub() {
  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Explorer */}
        <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
          <div>
            <span className="text-sm font-black uppercase tracking-[0.3em] text-violet-600">
              Master Skills. Build A Career.
            </span>

            <h2 className="mt-5 text-5xl font-black leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
              Modern Skills
              <br />
              For Modern Careers
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Explore cutting-edge programs in AI, Agentic AI, Cloud,
              Cybersecurity, Software Engineering, Data Science, and more.
              Discover career-focused pathways designed for real-world success.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.title}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-6 w-6 text-slate-700" />
                    <span className="text-lg font-semibold text-slate-800">
                      {category.title}
                    </span>
                  </div>

                  <ChevronRight className="h-5 w-5 text-slate-500 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Discovery Hub */}
        <div className="mt-24">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-violet-700">
              Course Discovery Hub
            </span>

            <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
              Explore Our Flagship Programs
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Industry-designed programs focused on practical skills, portfolio
              projects, mentorship, certifications, and career acceleration.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3">
                <Filter className="h-5 w-5 text-slate-500" />
                <span className="font-medium text-slate-700">
                  Skill Level
                </span>
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-3 font-medium text-slate-700">
                Career Goal
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-3 font-medium text-slate-700">
                Technology Stack
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-3 font-medium text-slate-700">
                Duration
              </div>
            </div>
          </div>

          {/* Course Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
                    {course.category}
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-slate-900">
                    {course.title}
                  </h3>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <p className="text-xs text-slate-500">Salary</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {course.salary}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <p className="text-xs text-slate-500">Projects</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {course.projects}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <p className="text-xs text-slate-500">Duration</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {course.duration}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href="#"
                      className="flex-1 rounded-2xl bg-violet-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-violet-700"
                    >
                      Enroll Now
                    </Link>

                    <Link
                      href="#"
                      className="flex-1 rounded-2xl border border-slate-200 px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="#"
              className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-5 text-base font-bold text-white transition hover:bg-black"
            >
              View All Courses
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}