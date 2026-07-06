"use client";

import Image from "next/image";

const toolCategories = [
  {
    title: "LLMs & assistants",
    tools: [
      "ChatGPT",
      "Claude",
      "Gemini",
      "NotebookLM",
      "Chatbot Arena",
      "Hugging Face",
    ],
  },
  {
    title: "Voice & Audio",
    tools: [
      "ChatGPT",
      "Claude",
      "Gemini",
      "NotebookLM",
      "Chatbot Arena",
      "Hugging Face",
    ],
  },
  {
    title: "Creative & Generative",
    tools: [
      "ChatGPT",
      "Claude",
      "Gemini",
      "NotebookLM",
      "Chatbot Arena",
      "Hugging Face",
    ],
  },
  {
    title: "Agent Frameworks",
    tools: [
      "ChatGPT",
      "Claude",
      "Gemini",
      "NotebookLM",
      "Chatbot Arena",
      "Hugging Face",
    ],
  },
  {
    title: "App Building & Deployment",
    tools: [
      "ChatGPT",
      "Claude",
      "Gemini",
      "NotebookLM",
      "Chatbot Arena",
      "Hugging Face",
    ],
  },
  {
    title: "Automation & Productivity",
    tools: [
      "ChatGPT",
      "Claude",
      "Gemini",
      "NotebookLM",
      "Chatbot Arena",
      "Hugging Face",
    ],
  },
];

const iconMap: Record<string, string> = {
  ChatGPT:
    "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/chatgpt-icon.png",

  Claude:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/960px-Claude_AI_symbol.svg.png",

  Gemini:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqAKlh4D6yGleH-NKMlxKzAF7rZytqvFuEGQ&s",

  NotebookLM:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7QuXjdeQi5YmwhP-qyRiaYSIe5t83jFfGJg&s",

  "Chatbot Arena":
    "https://chatbotarena.com/static/images/logo.svg",

  "Hugging Face":
    "https://w7.pngwing.com/pngs/839/288/png-transparent-hugging-face-favicon-logo-tech-companies-thumbnail.png",
};

export default function ToolsSection() {
  return (
    <section className="w-full bg-[#f5f5f5] py-8">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        {/* Title */}
        <h2 className="mb-6 text-[28px] font-bold text-[#23363A]">
          Tools
        </h2>

        <div className="space-y-6">
          {toolCategories.map((category) => (
            <div key={category.title}>
              {/* Category Heading */}
              <h3 className="mb-3 text-[14px] font-semibold text-[#33474d]">
                {category.title}:
              </h3>

              {/* Tools Row */}
              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool) => (
                  <div
                    key={tool}
                    className="
                      flex
                      h-[38px]
                      items-center
                      gap-2
                      rounded-md
                      border
                      border-[#d7dcdf]
                      bg-white
                      px-3
                      text-[11px]
                      font-medium
                      text-[#4b5b60]
                      shadow-sm
                      transition-all
                      duration-200
                      hover:border-[#bfc7cb]
                    "
                  >
                    <Image
                      src={iconMap[tool]}
                      alt={tool}
                      width={18}
                      height={18}
                      className="h-[28px] w-[58px] object-contain"
                      unoptimized
                    />

                    <span className="whitespace-nowrap">
                      {tool}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}