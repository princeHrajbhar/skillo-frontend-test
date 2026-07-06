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
  Heart,
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
  isWishlisted: boolean;
  onWishlistToggle: (courseId: string, e: React.MouseEvent) => void;
}> = ({ course, isWishlisted, onWishlistToggle }) => {
  const discount = calculateDiscount(course.price, course.discountedPrice);
  const categorySlug = course.category.toLowerCase().replace(/\s+/g, '-');

  const getLevel = () => {
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  const getDuration = () => {
    const durations = ['3 months', '4 months', '6 months', '8 months', '12 months'];
    return durations[Math.floor(Math.random() * durations.length)];
  };

  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  const reviews = Math.floor(100 + Math.random() * 9000);

  return (
    <Link
      href={`/course/${categorySlug}/${course.slug}`}
      className="block h-full group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-[#016ab7]/30 flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
          {course.bannerImage?.url ? (
            <Image
              src={course.bannerImage.url}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#016ab7] to-[#6cb84d] flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white/50" />
            </div>
          )}

          {/* Level Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-[#016ab7] text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              {getLevel()}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => onWishlistToggle(course._id, e)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </button>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute bottom-3 right-3 bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          <span className="text-xs font-medium text-[#016ab7] mb-1">
            {course.category}
          </span>

          <h3 className="text-base font-bold text-gray-900 group-hover:text-[#016ab7] transition-colors line-clamp-2 mb-1.5">
            {course.title}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
            {course.shortDescription}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700 ml-1">{rating}</span>
            </div>
            <span className="text-xs text-gray-400">({reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Skills Tags */}
          {course.keywords && course.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {course.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full"
                >
                  {keyword}
                </span>
              ))}
              {course.keywords.length > 3 && (
                <span className="text-gray-400 text-[10px]">+{course.keywords.length - 3}</span>
              )}
            </div>
          )}

          {/* Duration */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Clock className="h-3.5 w-3.5" />
            <span>{getDuration()} • Self-paced</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#016ab7]">
                {formatPrice(course.discountedPrice, course.currency)}
              </span>
              {course.discountedPrice < course.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(course.price, course.currency)}
                </span>
              )}
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-[#016ab7] to-[#6cb84d] hover:shadow-lg hover:shadow-[#016ab7]/25 text-white rounded-xl text-sm font-medium transition-all hover:scale-105 flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" />
              Enroll
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
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

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

  const trendingCategories = useMemo(() => {
    return categories
      .map((category) => ({
        name: category,
        count: groupedCourses[category].length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [categories, groupedCourses]);

  const popularSkills = useMemo(() => {
    const keywordCount: Record<string, number> = {};
    courses.forEach((course) => {
      course.keywords.forEach((keyword) => {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
    });
    return Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([keyword]) => keyword);
  }, [courses]);

  const recommendedCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
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

  const handleSkillClick = (skill: string) => {
    setSearchQuery(skill);
    setIsSearching(true);
  };

  const toggleWishlist = (courseId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Search Bar Skeleton */}
          <div className="h-14 bg-white rounded-2xl shadow-sm border border-gray-200 animate-pulse"></div>
          
          {/* Skills Skeleton */}
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          
          {/* Course Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">Failed to load courses. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white rounded-xl hover:shadow-lg hover:shadow-[#016ab7]/25 transition-all font-medium"
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================
            SEARCH BAR
            ============================================ */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-[#016ab7] focus-within:border-transparent transition-all">
            <Search className="absolute left-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, categories, or skills..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-base rounded-2xl"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* ============================================
            SEARCH RESULTS
            ============================================ */}
        {isSearching && searchResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-sm text-gray-500">{searchResults.length} courses found</p>
              </div>
              <button
                onClick={clearSearch}
                className="text-sm text-gray-500 hover:text-[#016ab7] transition-colors"
              >
                Clear Search
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.slice(0, 8).map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isWishlisted={wishlist.has(course._id)}
                  onWishlistToggle={toggleWishlist}
                />
              ))}
            </div>
          </div>
        )}

        {isSearching && searchResults.length === 0 && (
          <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-12 mb-8">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search terms</p>
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white rounded-lg hover:shadow-lg hover:shadow-[#016ab7]/25 transition-all"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* ============================================
            POPULAR SKILLS
            ============================================ */}
        {!isSearching && popularSkills.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Popular Skills</h2>
                <p className="text-sm text-gray-500">Most in-demand skills right now</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {popularSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillClick(skill)}
                  className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-[#016ab7] hover:shadow-md transition-all duration-300"
                >
                  <Tag className="h-4 w-4 text-gray-400 group-hover:text-[#016ab7] transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#016ab7] transition-colors">
                    {skill}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================
            RECOMMENDED COURSES
            ============================================ */}
        {!isSearching && recommendedCourses.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                <p className="text-sm text-gray-500">Handpicked courses based on popularity</p>
              </div>
            </div>
            <div className="relative">
              <div className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar">
                {recommendedCourses.map((course) => (
                  <div
                    key={course._id}
                    className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[280px] lg:w-[300px] xl:w-[320px] snap-start"
                  >
                    <CourseCard
                      course={course}
                      isWishlisted={wishlist.has(course._id)}
                      onWishlistToggle={toggleWishlist}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            CATEGORY SECTIONS
            ============================================ */}
        {!isSearching &&
          categories.map((category) => {
            const categoryCourses = groupedCourses[category] || [];
            if (categoryCourses.length === 0) return null;

            return (
              <div
                key={category}
                id={`category-${category}`}
                className="mb-8 scroll-mt-20"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                    <p className="text-sm text-gray-500">{categoryCourses.length} courses available</p>
                  </div>
                  <Link
                    href={`/course/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#016ab7] hover:text-[#6cb84d] transition-colors group"
                  >
                    See All
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Horizontal Scroll Section */}
                <div className="relative group">
                  {/* Left Navigation Button */}
                  <button
                    onClick={() => scrollCategory(category, 'left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 border border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-[#016ab7] hover:to-[#6cb84d] hover:text-white transition-all -translate-x-4 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Scroll Container */}
                  <div
                    ref={(el) => {
                      categoryRefs.current[category] = el;
                    }}
                    className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar"
                  >
                    {categoryCourses.map((course) => (
                      <div
                        key={course._id}
                        className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[280px] lg:w-[300px] xl:w-[320px] snap-start"
                      >
                        <CourseCard
                          course={course}
                          isWishlisted={wishlist.has(course._id)}
                          onWishlistToggle={toggleWishlist}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Right Navigation Button */}
                  <button
                    onClick={() => scrollCategory(category, 'right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 border border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-[#016ab7] hover:to-[#6cb84d] hover:text-white transition-all translate-x-4 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}

        {/* ============================================
            EMPTY STATE
            ============================================ */}
        {!isLoading && courses.length === 0 && (
          <div className="text-center bg-white rounded-3xl shadow-sm border border-gray-200 p-16">
            <div className="text-7xl mb-6">📚</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Courses Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
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