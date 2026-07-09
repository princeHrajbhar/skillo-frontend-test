'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCourse } from '@/features/course/hooks/useCourse';
import {
  Search,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Star,
  BookOpen,
  Sparkles,
  Tag,
  X,
  Clock,
  Briefcase,
  GraduationCap,
  BarChart,
  Code,
  Database,
  LineChart,
  Settings,
  Globe,
  Layers,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface ICourse {
  _id: string;
  title: string;
  slug: string;
  category: string;
  subCategory?: string;
  shortDescription: string;
  price: number;
  discountedPrice: number;
  currency: string;
  bannerImage?: {
    url: string;
  };
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatPrice = (price: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const calculateDiscount = (price: number, discountedPrice: number) => {
  if (price <= 0 || discountedPrice >= price) return 0;
  return Math.round(((price - discountedPrice) / price) * 100);
};

// ============================================
// SKILLS DATA
// ============================================

const careerSkills = [
  'Data Analysis',
  'SQL',
  'Python Programming',
  'Data Visualization',
  'Microsoft Excel',
  'Statistics',
  'Problem Solving',
  'Data Quality',
  'Machine Learning',
  'Business Intelligence',
  'Tableau',
  'Power BI',
];

const careerPaths = [
  { icon: Briefcase, label: 'Start my career' },
  { icon: TrendingUp, label: 'Change my career' },
  { icon: Award, label: 'Grow in my current role' },
  { icon: Globe, label: 'Explore topics outside of work' },
];

// ============================================
// COURSE CARD COMPONENT
// ============================================

const CourseCard: React.FC<{
  course: ICourse;
}> = ({ course }) => {
  const categorySlug = course.category.toLowerCase().replace(/\s+/g, '-');

  // Safe check for valid image URL with proper null checks
  const imageUrl = course.bannerImage?.url;
  const isValidImage = imageUrl && 
    typeof imageUrl === 'string' &&
    imageUrl.trim() !== '' &&
    (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

  return (
    <Link
      href={`/course/${categorySlug}/${course.slug}`}
      className="block h-full group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-[#016ab7]/30 flex flex-col">
        {/* Image Container - 614x306 dimensions (landscape) */}
        <div className="relative w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: '614/306' }}>
          {isValidImage ? (
            <Image
              src={imageUrl}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width:640px) 100vw,
                     (max-width:768px) 50vw,
                     (max-width:1024px) 33vw,
                     320px"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#016ab7]/5">
              <BookOpen className="h-16 w-16 text-[#016ab7]/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Category */}
          <span className="text-xs font-medium text-[#016ab7] mb-1 truncate">
            {course.category}
          </span>

          <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#016ab7] transition-colors line-clamp-2 mb-1.5">
            {course.title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
            {course.shortDescription}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between gap-2 mt-auto">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base sm:text-lg font-bold text-[#016ab7] whitespace-nowrap">
                {formatPrice(course.discountedPrice, course.currency)}
              </span>
              {course.discountedPrice < course.price && (
                <span className="text-xs sm:text-sm text-gray-400 line-through whitespace-nowrap">
                  {formatPrice(course.price, course.currency)}
                </span>
              )}
            </div>
            <button className="flex-shrink-0 px-4 sm:px-5 py-2 bg-[#016ab7] hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02]">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function CourseDiscoveryPage() {
  // ============================================
  // STATE
  // ============================================

  const { useGetCourses } = useCourse();
  const { data, isLoading, error } = useGetCourses({
    status: 'active',
    limit: 100,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const courses = data?.data || [];

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const groupedCourses = useMemo(() => {
    const groups: { [key: string]: ICourse[] } = {};
    courses.forEach((course) => {
      const category = course.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(course);
    });
    return groups;
  }, [courses]);

  const categories = useMemo(() => {
    return Object.keys(groupedCourses).sort();
  }, [groupedCourses]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        (course.subCategory?.toLowerCase() || '').includes(query) ||
        course.keywords.some((k) => k.toLowerCase().includes(query))
    );
  }, [courses, searchQuery]);

  const recommendedCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [courses]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(!!query);
  };

  const handleCategoryClick = (category: string) => {
    setIsSearching(false);
    setSearchQuery('');
    setTimeout(() => {
      const element = document.getElementById(`category-${category}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollCategory = (category: string, direction: 'left' | 'right') => {
    const container = categoryRefs.current[category];
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Search Bar Skeleton */}
          <div className="h-14 bg-white rounded-2xl shadow-sm border border-gray-200 animate-pulse"></div>
          
          {/* Course Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full bg-gray-200" style={{ aspectRatio: '614/306' }}></div>
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex justify-between pt-2">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">Failed to load courses. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#016ab7] text-white rounded-xl hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 transition-all font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* ============================================
            SEARCH BAR
            ============================================ */}
        <div className="relative max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-[#016ab7] focus-within:border-transparent transition-all">
            <Search className="absolute left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, categories, or skills..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-9 sm:pl-12 pr-8 sm:pr-12 py-3 sm:py-4 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm sm:text-base rounded-2xl"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 sm:right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* ============================================
            SEARCH RESULTS
            ============================================ */}
        {isSearching && searchResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">{searchResults.length} courses found</p>
              </div>
              <button
                onClick={clearSearch}
                className="text-sm text-gray-500 hover:text-[#016ab7] transition-colors"
              >
                Clear Search
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {searchResults.slice(0, 6).map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                />
              ))}
            </div>
          </div>
        )}

        {isSearching && searchResults.length === 0 && (
          <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 mb-6 sm:mb-8">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search terms</p>
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-[#016ab7] text-white rounded-lg hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 transition-all"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* ============================================
            RECOMMENDED COURSES - Only 3 cards - Mobile responsive
            ============================================ */}
        {!isSearching && recommendedCourses.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recommended for You</h2>
                <p className="text-xs sm:text-sm text-gray-500">Handpicked courses based on popularity</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {recommendedCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                />
              ))}
            </div>
          </div>
        )}

        {/* ============================================
            CATEGORY SECTIONS - Mobile responsive
            ============================================ */}
        {!isSearching &&
          categories.map((category) => {
            const categoryCourses = groupedCourses[category] || [];
            if (categoryCourses.length === 0) return null;

            return (
              <div
                key={category}
                id={`category-${category}`}
                className="mb-6 sm:mb-8 scroll-mt-20"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{category}</h2>
                    <p className="text-xs sm:text-sm text-gray-500">{categoryCourses.length} courses available</p>
                  </div>
                </div>

                {/* Horizontal Scroll Section - Mobile responsive */}
                <div className="relative group">
                  {/* Left Navigation Button */}
                  <button
                    onClick={() => scrollCategory(category, 'left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1.5 sm:p-2.5 border border-gray-200 text-gray-700 hover:bg-[#016ab7] hover:text-white transition-all -translate-x-2 sm:-translate-x-4 opacity-0 group-hover:opacity-100 focus:opacity-100 hidden sm:block"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Scroll Container - Mobile first */}
                  <div
                    ref={(el) => {
                      categoryRefs.current[category] = el;
                    }}
                    className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar px-0.5"
                  >
                    {categoryCourses.map((course) => (
                      <div
                        key={course._id}
                        className="flex-shrink-0 w-[280px] xs:w-[300px] sm:w-[280px] md:w-[300px] lg:w-[320px] snap-start"
                      >
                        <CourseCard
                          course={course}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Right Navigation Button */}
                  <button
                    onClick={() => scrollCategory(category, 'right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1.5 sm:p-2.5 border border-gray-200 text-gray-700 hover:bg-[#016ab7] hover:text-white transition-all translate-x-2 sm:translate-x-4 opacity-0 group-hover:opacity-100 focus:opacity-100 hidden sm:block"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            );
          })}

        {/* ============================================
            EMPTY STATE
            ============================================ */}
        {!isLoading && courses.length === 0 && (
          <div className="text-center bg-white rounded-3xl shadow-sm border border-gray-200 p-8 sm:p-16">
            <div className="text-7xl mb-6">📚</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">No Courses Available</h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
              We're currently preparing new courses for you. Please check back later.
            </p>
          </div>
        )}

      </div>

      {/* ============================================
          GLOBAL STYLES
          ============================================ */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}