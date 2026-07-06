import { ChevronRight } from "lucide-react";

interface BackToTopButtonProps {
  scrolled: boolean;
}

export default function BackToTopButton({ scrolled }: BackToTopButtonProps) {
  if (!scrolled) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 animate-slide-up"
    >
      <ChevronRight className="h-5 w-5 transform -rotate-90" />
    </button>
  );
}