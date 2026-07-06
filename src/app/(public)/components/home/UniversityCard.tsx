"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { memo } from "react";

type University = {
  id: number;
  name: string;
  logo: string;
};

const universities: University[] = [
  {
    id: 1,
    name: "Government of India",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/8/84/Government_of_India_logo.svg",
  },
  {
    id: 2,
    name: "Skill Development",
    logo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHOGd-BrSCn5DMrPMaRybtVzXP2TIl5x7t0Q&s",
  },
  {
    id: 3,
    name: "Education Partner",
    logo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROLH-0dY9o69X_CJtkwgjyb9hCB7k9rO__2A&s",
  },
  {
    id: 4,
    name: "Ministry Initiative",
    logo:
      "https://www.ngoregistration.org/wp-content/uploads/2014/07/scheme-of-ministry-of-overseas-indian-affairs.jpg",
  },
  {
    id: 5,
    name: "Government Program",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/8/84/Government_of_India_logo.svg",
  },
  {
    id: 6,
    name: "National Initiative",
    logo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHOGd-BrSCn5DMrPMaRybtVzXP2TIl5x7t0Q&s",
  },
  {
    id: 7,
    name: "Digital India",
    logo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROLH-0dY9o69X_CJtkwgjyb9hCB7k9rO__2A&s",
  },
  {
    id: 8,
    name: "Skill Mission",
    logo:
      "https://www.ngoregistration.org/wp-content/uploads/2014/07/scheme-of-ministry-of-overseas-indian-affairs.jpg",
  },
  {
    id: 9,
    name: "National Program",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/8/84/Government_of_India_logo.svg",
  },
];

const UniversityCard = memo(
  ({ university }: { university: University }) => {
    return (
      <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-100/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex h-24 items-center justify-center">
          <img
            src={university.logo}
            alt={university.name}
            className="max-h-20 w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
    );
  }
);

UniversityCard.displayName = "UniversityCard";

export default function PrestigiousUniversitiesSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 py-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[430px_1fr]">
          <div>
            <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-violet-700">
              Trusted By
            </span>

            <h2 className="mt-6 text-5xl font-black leading-none tracking-tight text-slate-900 md:text-6xl">
              Prestigious
              <br />
              Institutions
            </h2>

            <p className="mt-8 text-lg leading-8 text-slate-600">
              Learn through industry-recognized programs backed by government
              initiatives, national missions, and leading educational
              organizations that help accelerate your professional growth.
            </p>

            <Link
              href="#"
              className="group mt-10 inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-5 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:bg-blue-700"
            >
              Explore Partnerships
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {universities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}