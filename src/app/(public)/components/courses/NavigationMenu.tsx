"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Bookmark, Share2, Menu, X } from "lucide-react";

interface NavigationMenuProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  isBookmarked: boolean;
  setIsBookmarked: (value: boolean) => void;
  handleShare: () => void;
  handleEnrollClick: () => void;
  showShareTooltip: boolean;
  scrolled: boolean;
}

const sections = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "curriculum", label: "Curriculum", icon: BookOpen },
  { id: "instructor", label: "Instructor", icon: BookOpen },
  { id: "reviews", label: "Reviews", icon: BookOpen },
  { id: "faqs", label: "FAQ", icon: BookOpen }
];

export default function NavigationMenu({
  activeSection,
  scrollToSection,
  isBookmarked,
  setIsBookmarked,
  handleShare,
  handleEnrollClick,
  showShareTooltip,
  scrolled
}: NavigationMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">LearnHub</span>
          </Link>

          <nav className="flex items-center gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`group px-5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <section.icon className="h-4 w-4" />
                {section.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full transition-all ${
                isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-blue-600' : ''}`} />
            </button>
            <div className="relative">
              <button 
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                <Share2 className="h-5 w-5" />
              </button>
              {showShareTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
                  Link copied!
                </div>
              )}
            </div>
            <button 
              onClick={handleEnrollClick}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Enroll Now
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">LearnHub</span>
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-gray-100 text-gray-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-down">
            <nav className="flex flex-col gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    scrollToSection(section.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  {section.label}
                </button>
              ))}
              <div className="flex gap-2 pt-4 mt-2 border-t">
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex-1 py-2 rounded-xl font-medium flex items-center justify-center gap-2 ${
                    isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
                  Save
                </button>
                <button 
                  onClick={handleEnrollClick}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold"
                >
                  Enroll Now
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
