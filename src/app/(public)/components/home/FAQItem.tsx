"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    id: 1,
    question: "Is AI still a good career choice in 2026 and beyond?",
    answer:
      "Yes. AI, Agentic AI, Cybersecurity, Cloud Computing, and Data Engineering continue to be among the fastest-growing technology domains globally. Organizations are actively hiring professionals who can build, deploy, and manage real-world AI systems.",
  },
  {
    id: 2,
    question: "Do I need a coding background to learn AI and Generative AI?",
    answer:
      "No. Many learners start with little or no coding experience. Structured programs typically begin with fundamentals and gradually progress to advanced topics like LLMs, RAG systems, AI agents, and production deployments.",
  },
  {
    id: 3,
    question: "What is the difference between Generative AI and Agentic AI?",
    answer:
      "Generative AI focuses on creating content such as text, images, code, and audio. Agentic AI goes further by enabling AI systems to reason, plan, use tools, take actions, and complete multi-step tasks autonomously.",
  },
  {
    id: 4,
    question: "How long does it take to become job-ready in AI?",
    answer:
      "The timeline depends on your background and learning commitment. Most learners can build practical AI skills within a few months by combining structured learning, hands-on projects, portfolio development, and interview preparation.",
  },
  {
    id: 5,
    question: "What projects should I build to get hired in AI?",
    answer:
      "Strong portfolio projects include AI chatbots, RAG applications, AI agents, recommendation systems, LLM-powered tools, cloud-deployed applications, and cybersecurity automation solutions that solve real business problems.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
        aria-expanded={isOpen}
        aria-label={faq.question}
      >
        <h3 className="text-sm font-semibold leading-6 text-slate-900 sm:text-base flex-1">
          {faq.question}
        </h3>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen 
              ? "bg-gradient-to-r from-[#016ab7] to-[#6cb84d] rotate-180" 
              : "border border-slate-200 bg-white hover:border-[#016ab7]"
          }`}
        >
          <ChevronDown
            className={`h-4 w-4 transition-colors duration-300 ${
              isOpen ? "text-white" : "text-slate-500 group-hover:text-[#016ab7]"
            }`}
          />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-5 py-5 sm:px-7">
            <p className="text-sm leading-7 text-slate-600">{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-brand-end px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-end">
            Frequently Asked Questions
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Everything You Need To Know
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Answers to the most searched questions about AI careers, Generative AI,
            Agentic AI, RAG, cybersecurity, certifications, salaries, and job opportunities.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}