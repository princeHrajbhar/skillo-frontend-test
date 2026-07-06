"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const modules = [
  {
    title: "Module 1: AI Foundations & Core Tools",
    content:
      "This module lays the groundwork for everything that follows. You'll start by understanding what AI, machine learning, and generative AI are, then go under the hood of large language models to see how they process and generate text. From there, you'll move into practical skills: writing effective prompts, optimizing context, and getting reliable results from AI tools. By the end, you'll have built your first working AI assistant using ChatGPT and Gemini, giving you hands-on experience with the tools that power most of the rest of the course.",
  },
  {
    title: "Module 2: Building Voice Agents & MCPs",
    content: "",
  },
  {
    title: "Module 3: Workflow Automation & Creative AI",
    content: "",
  },
  {
    title: "Module 4: AI Agents & Multi-Agent Systems",
    content: "",
  },
  {
    title: "Module 5: AI Applications & AI Clones",
    content: "",
  },
  {
    title: "Module 6: Enterprise Integration & Final Projects",
    content: "",
  },
];

const skills = [
  "Prompt engineering",
  "LLM fundamentals",
  "Conversational AI design",
  "Voice interface design",
  "AI content generation",
  "Agent architecture",
  "Prompt engineering",
  "Prompt engineering",
  "Prompt engineering",
  "Prompt engineering",
  "Prompt engineering",
  "Prompt engineering",
  "Prompt engineering",
  "Prompt engineering",
];

export default function CourseContent() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="w-full bg-[#f3f3f3] py-8">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        {/* Course Content */}
        <h2 className="mb-5 text-[30px] font-bold text-[#23363a]">
          Course Content
        </h2>

        <div className="space-y-3">
          {modules.map((module, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-md border border-[#9dd8e4]"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? -1 : index)
                  }
                  className="flex w-full items-center justify-between bg-[#cfeff5] px-4 py-3 text-left"
                >
                  <span className="text-[15px] font-semibold text-[#27434A]">
                    {module.title}
                  </span>

                  {isOpen ? (
                    <ChevronUp
                      size={18}
                      className="text-[#27434A]"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="text-[#27434A]"
                    />
                  )}
                </button>

                {isOpen && module.content && (
                  <div className="bg-[#dff4f8] px-5 py-4">
                    <p className="text-[14px] leading-relaxed text-[#5a6b70]">
                      {module.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Skills */}
        <div className="mt-10">
          <h3 className="mb-5 text-[30px] font-bold text-[#23363a]">
            Skills
          </h3>

          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-md border border-[#cfd8dc] bg-[#f7f7f7] px-4 py-2 text-[13px] text-[#6b7b80]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}