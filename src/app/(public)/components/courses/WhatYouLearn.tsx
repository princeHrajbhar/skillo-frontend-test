export default function WhatYouLearn() {
  const items = [
    "Understand how AI, machine learning, and generative AI actually work, including the fundamentals of how large language models process and generate text",
    "Write effective prompts and optimize context to get consistent, high-quality results from any AI tool",
    "Build voice-enabled AI agents that can listen, respond, and handle real conversations using leading speech AI tools",
    "Automate multi-step workflows and generate AI-powered content across images, video, text, and 3D/AR",
    "Design multi-agent AI systems that reason, plan, and connect to real APIs, databases, and live data",
    "Build and deploy your own AI-powered web apps, including AI clones, using low-code platforms",
    "Apply AI to real business problems like marketing automation, growth analytics, and monetization",
    "Finish with a portfolio of 6 progressively advanced projects, from your first AI assistant to a deployed product",
  ];

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-4">
      <h2 className="mb-3 text-[18px] font-bold text-[#24424a]">
        What You'll Learn
      </h2>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-[12px] leading-[18px] text-[#475d63]"
          >
            <span className="mt-[4px] h-[4px] w-[4px] rounded-full bg-[#475d63]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}