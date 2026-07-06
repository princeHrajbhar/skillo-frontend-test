"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { memo } from "react";

type LearnerJourney = {
  id: number;
  name: string;
  image: string;
  company: string;
  companyLogo: string;
  beforeRole: string;
  afterRole: string;
};

const learners: LearnerJourney[] = [
  {
    id: 1,
    name: "Padmini Kadhirvel",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    company: "TachoMind",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    beforeRole: "Online Support Associate",
    afterRole: "Automation Testing Engineer",
  },
  {
    id: 2,
    name: "B Swathy",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
    company: "SmartHealth",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    beforeRole: "Associate",
    afterRole: "UI/UX Designer",
  },
  {
    id: 3,
    name: "Vignesh G",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    company: "Agnikul",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/4/4f/Typescript_logo_2020.svg",
    beforeRole: "Fresher, MSc (Arts & Science)",
    afterRole: "Junior Developer",
  },
  {
    id: 4,
    name: "Ramapriya Prasathe",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    company: "RemitBee",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    beforeRole: "9 years gap after graduation",
    afterRole: "Automation Testing Engineer",
  },
];

const JourneyCard = memo(
  ({ learner }: { learner: LearnerJourney }) => {
    return (
      <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative p-8">
          <div className="flex flex-col items-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-green-100">
              <Image
                src={learner.image}
                alt={learner.name}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              {learner.name}
            </h3>

            <div className="mt-4 flex items-center gap-2">
              <div className="relative h-6 w-6">
                <Image
                  src={learner.companyLogo}
                  alt={learner.company}
                  fill
                  sizes="24px"
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                {learner.company}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <div className="flex items-center gap-3">
                <Circle className="h-4 w-4 text-slate-300" />
                <span className="text-sm font-medium text-slate-700">
                  {learner.beforeRole}
                </span>
              </div>
            </div>

            <div className="ml-5 flex flex-col items-start py-4">
              <div className="h-5 w-[2px] bg-green-400" />
              <div className="flex items-center gap-2 py-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                  2
                </span>
                <span className="text-sm text-slate-500">
                  After Learning
                </span>
              </div>
              <div className="h-5 w-[2px] bg-green-400" />
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full border-2 border-green-500" />
                <span className="text-sm font-semibold text-slate-800">
                  {learner.afterRole}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
);

JourneyCard.displayName = "JourneyCard";

export default function LearnersJourneySection() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            Success Stories
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Journey Of Our Learners
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Real transformations from aspiring learners to successful
            professionals working in fast-growing organizations.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {learners.map((learner) => (
            <JourneyCard key={learner.id} learner={learner} />
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-5">
          <button
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white transition hover:bg-slate-50"
          >
            <ChevronLeft className="h-5 w-5 text-slate-700" />
          </button>

          <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
            {[...Array(7)].map((_, index) => (
              <span
                key={index}
                className={`h-2.5 w-2.5 rounded-full ${
                  index === 3 ? "bg-green-600" : "bg-green-400"
                }`}
              />
            ))}
          </div>

          <button
            aria-label="Next"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white transition hover:bg-slate-50"
          >
            <ChevronRight className="h-5 w-5 text-slate-700" />
          </button>
        </div>
      </div>
    </section>
  );
}