"use client";

const learnItems = [
  "Understand how AI, machine learning, and generative AI actually work, including the fundamentals of how large language models process and generate text",
  "Write effective prompts and optimize context to get consistent, high-quality results from any AI tool",
  "Build voice-enabled AI agents that can listen, respond, and handle real conversations using leading speech AI tools",
  "Automate multi-step workflows and generate AI-powered content across images, video, text, and 3D/AR",
  "Design multi-agent AI systems that reason, plan, and connect to real APIs, databases, and live data",
  "Build and deploy your own AI-powered web apps, including AI clones, using low-code platforms",
  "Apply AI to real business problems like marketing automation, growth analytics, and monetization",
  "Finish with a portfolio of 6 progressively advanced projects, from your first AI assistant to a deployed product",
];

export default function CourseContentTabs() {
  return (
    <section className="mt-14 w-full bg-[#f5f5f5] py-6">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="overflow-hidden rounded-md border border-[#7d8b8c] bg-[#f5f5f5]">
          {/* Tabs */}
          <div className="flex flex-wrap items-center border-b border-[#7d8b8c] text-[12px]">
            <button className="border-r border-[#7d8b8c] bg-[#7fa9a7] px-4 py-2 font-medium text-[#1f2f30]">
              What You'll Learn
            </button>

            <button className="px-4 py-2 text-[#4d5b5c]">
              Course Content
            </button>

            <button className="px-4 py-2 text-[#4d5b5c]">
              Skills
            </button>

            <button className="px-4 py-2 text-[#4d5b5c]">
              Tools
            </button>

            <button className="px-4 py-2 text-[#4d5b5c]">
              Reviews
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-5 md:px-6">
            <h2 className="mb-4 text-[28px] font-bold text-[#23363a]">
              What You'll Learn
            </h2>

            <ul className="space-y-4">
              {learnItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[15px] leading-[1.5] text-[#53696d]"
                >
                  <span className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#53696d]" />

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}