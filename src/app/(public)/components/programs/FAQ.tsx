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
    question: "How long do I have access to the course?",
    answer: "You get lifetime access to all course materials, including future updates. Once you enroll, you can learn at your own pace and revisit the content anytime.",
  },
  {
    id: 2,
    question: "Is there a money-back guarantee?",
    answer: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with the course, you can request a full refund within 30 days of purchase.",
  },
  {
    id: 3,
    question: "Do I need prior React experience?",
    answer: "Basic JavaScript knowledge is recommended, but we start from the fundamentals. The course includes a refresher on essential JavaScript concepts before diving into React.",
  },
  {
    id: 4,
    question: "Will I get a certificate?",
    answer: "Yes, you'll receive a verified certificate of completion that you can share on LinkedIn, add to your resume, or showcase in your portfolio.",
  },
  {
    id: 5,
    question: "Can I access the course on mobile?",
    answer: "Absolutely! The course platform is fully responsive, and you can access all content on your phone, tablet, or computer.",
  },
  {
    id: 6,
    question: "Is there any support if I get stuck?",
    answer: "Yes! You'll get access to our private Discord community where you can ask questions, share projects, and get help from instructors and fellow students.",
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-7"
        aria-expanded={isOpen}
      >
        <h3 className="text-sm font-semibold leading-6 text-slate-900 sm:text-base">
          {faq.question}
        </h3>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen ? "rotate-180 border-[#016AB7] bg-[#016AB7]" : "border-slate-200 bg-white"
          }`}
        >
          <ChevronDown className={`h-4 w-4 transition-colors ${isOpen ? "text-white" : "text-slate-500"}`} />
        </div>
      </button>
      <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-5 py-5 sm:px-7">
            <p className="text-sm leading-7 text-slate-600">{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span
            className="inline-block rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={{ borderColor: '#6CB84D', color: '#6CB84D' }}
          >
            Frequently Asked Questions
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Everything You Need To Know
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Answers to the most common questions about the course
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