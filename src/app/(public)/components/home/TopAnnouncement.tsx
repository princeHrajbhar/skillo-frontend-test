'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

export default function TopAnnouncement() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-brand-gradient text-white">
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-between px-4 sm:px-6 text-sm font-medium">
        <div className="flex items-center gap-3 min-w-0">
          <span className="hidden sm:inline-block shrink-0 rounded bg-white/20 px-2 py-0.5 text-xs font-bold tracking-wide">
            NEW
          </span>
          <p className="truncate text-xs sm:text-sm">
            Skilo AI Engineering Programme — Applications Open for Summer 2026 Batch
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 ml-4">
          <a
            href="#"
            className="hidden sm:block text-white/90 text-xs hover:text-white hover:underline transition-colors"
          >
            Learn More
          </a>
          <button
            onClick={() => setIsVisible(false)}
            className="rounded-full p-1 hover:bg-white/15 transition"
            aria-label="Dismiss announcement"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}