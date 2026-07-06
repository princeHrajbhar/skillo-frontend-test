"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { 
  Search, 
  Star, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Filter,
  ChevronDown,
  X,
  BookOpen,
  Clock,
  Users,
  Sparkles,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCourse } from "@/features/course/hooks/useCourse";
import type { GetCoursesQuery } from "@/features/course/api/courseApi";

// Helper function to format price in Indian Rupees
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Helper function to calculate discount percentage
const calculateDiscount = (original: number, discounted: number) => {
  return Math.round(((original - discounted) / original) * 100);
};

// Helper function to create slug from title
const slugify = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Dynamic categories from API
const categories = [
  "All Courses",
  "Technology",
  "AI",
  "Web Development",
  "Data Science",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
];

export default function CourseListing() {
  const { useGetCourses } = useCourse();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [activeCategory, setActiveCategory] = useState("All Courses");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Build query params - Increase limit to get all courses
  const queryParams: GetCoursesQuery = {
    page: currentPage,
    limit: 50, // Increased to show more courses
    ...(activeCategory !== "All Courses" && { category: activeCategory }),
  };

  // Fetch courses from API
  const { 
    data: coursesData, 
    isLoading, 
    error, 
    refetch 
  } = useGetCourses(queryParams);

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [currentPage, activeCategory, refetch]);

  const courses = coursesData?.data || [];
  const pagination = coursesData?.pagination;

  // Filter and sort courses (additional client-side filtering if needed)
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Client-side category filter (as backup)
    if (activeCategory !== "All Courses") {
      result = result.filter(course => 
        course.category === activeCategory
      );
    }

    return result;
  }, [courses, activeCategory]);

  const handleViewDetails = (course: any) => {
    const slug = course.slug || slugify(course.title);
    router.push(`/course/${course.category}/${slug}`);
  };

  const handleClearFilters = () => {
    setActiveCategory("All Courses");
    setCurrentPage(1);
  };

  // Scroll functions for category navigation
  const scrollCategories = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 200;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({ 
      left: targetScroll, 
      behavior: 'smooth' 
    });
  };

  // Loading state
  if (isLoading && !courses.length) {
    return (
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-[#016ab7]/20"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#016ab7] border-t-transparent"></div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 p-8">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-semibold text-red-700">Failed to Load Courses</h3>
            <p className="mt-2 text-sm text-red-600">Please try again later</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header with Stats */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-slate-900">
                All Courses
              </h2>
              <span className="rounded-full bg-[#016ab7]/10 px-3 py-1 text-sm font-medium text-[#016ab7]">
                {pagination?.total || courses.length} Courses
              </span>
            </div>
            <p className="mt-1 text-slate-500">
              Learn industry-ready skills from experts.
            </p>
          </div>

          {/* Controls - Only Filter Button on Mobile */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#016ab7] hover:text-[#016ab7] lg:hidden"
            >
              <Filter size={16} />
              Filters
              <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Filters with Scroll Buttons */}
        <div className="relative mb-6">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollCategories('left')}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-md border border-slate-200 p-1.5 text-slate-600 transition-all hover:bg-slate-50 hover:border-[#016ab7] hover:text-[#016ab7]"
            aria-label="Scroll categories left"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scroll-smooth px-8 py-1 hide-scrollbar"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white shadow-sm shadow-[#016ab7]/25"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#016ab7] hover:text-[#016ab7]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollCategories('right')}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-md border border-slate-200 p-1.5 text-slate-600 transition-all hover:bg-slate-50 hover:border-[#016ab7] hover:text-[#016ab7]"
            aria-label="Scroll categories right"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:hidden">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setShowFilters(false);
                      }}
                      className={`rounded-full px-3 py-1.5 text-sm ${
                        activeCategory === category
                          ? "bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleClearFilters}
                className="text-sm text-[#016ab7] hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {filteredCourses.length} of {pagination?.total || courses.length} courses
          </p>
          {filteredCourses.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-[#016ab7]/10 text-[#016ab7]' : 'hover:bg-slate-100'
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-[#016ab7]/10 text-[#016ab7]' : 'hover:bg-slate-100'
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Course Cards */}
        {filteredCourses.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              : "space-y-4"
          }>
            {filteredCourses.map((course) => {
              const hasDiscount = course.discountedPrice !== undefined && 
                                  course.discountedPrice !== null && 
                                  course.discountedPrice < (course.price || 0);
              
              const finalPrice: number = hasDiscount 
                ? course.discountedPrice as number 
                : course.price || 0;
              
              const discountPercentage = hasDiscount && course.price 
                ? calculateDiscount(course.price, course.discountedPrice as number) 
                : 0;

              const imageUrl = course.bannerImage?.url || 
                              'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800';

              const rating = 4.5;
              const studentCount = 0;

              return (
                <div
                  key={course._id}
                  className={`group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    viewMode === 'list' ? 'flex gap-6 p-4' : ''
                  }`}
                >
                  {/* Image - Badges repositioned to avoid overlap */}
                  <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className={`w-full object-cover ${
                        viewMode === 'grid' ? 'h-48' : 'h-40'
                      }`}
                      loading="lazy"
                    />
                    {/* Discount/Popular Badge - Top Left */}
                    {hasDiscount && (
                      <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-md">
                        SAVE {discountPercentage}%
                      </div>
                    )}
                    {!hasDiscount && course.status === 'active' && (
                      <div className="absolute left-2 top-2 rounded-full bg-[#6cb84d] px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-md">
                        POPULAR
                      </div>
                    )}
                    {course.status === 'upcoming' && (
                      <div className="absolute left-2 top-2 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-md">
                        UPCOMING
                      </div>
                    )}
                    {/* Rating Badge - Top Right, moved to corner */}
                    <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 shadow-md backdrop-blur-sm">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] font-semibold text-slate-700">
                        {rating}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ${viewMode === 'grid' ? 'p-4' : 'py-2 pr-2'}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-[#016ab7]/10 px-3 py-1 text-xs font-medium text-[#016ab7]">
                        {course.category || 'General'}
                      </span>
                      {course.subCategory && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {course.subCategory}
                        </span>
                      )}
                      {course.status === 'active' && (
                        <span className="rounded-full bg-[#6cb84d]/10 px-3 py-1 text-xs font-medium text-[#6cb84d]">
                          Active
                        </span>
                      )}
                      {course.status === 'upcoming' && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <h3 className={`font-bold leading-tight text-slate-900 group-hover:text-[#016ab7] transition-colors ${
                      viewMode === 'grid' ? 'mt-3 text-lg' : 'mt-2 text-xl'
                    }`}>
                      {course.title}
                    </h3>

                    <p className={`text-slate-600 ${
                      viewMode === 'grid' ? 'mt-2 text-sm line-clamp-2' : 'mt-1 text-sm line-clamp-2'
                    }`}>
                      {course.shortDescription || 'Learn the fundamentals and advanced concepts of this subject.'}
                    </p>

                    <div className={`flex items-center gap-4 text-xs text-slate-500 ${
                      viewMode === 'grid' ? 'mt-3' : 'mt-2'
                    }`}>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{studentCount} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Self-paced</span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 ${
                      viewMode === 'grid' ? 'mt-3' : 'mt-2'
                    }`}>
                      <span className="text-2xl font-bold text-slate-900">
                        {formatPrice(finalPrice)}
                      </span>
                      {hasDiscount && course.price && (
                        <>
                          <span className="text-sm text-slate-400 line-through">
                            {formatPrice(course.price)}
                          </span>
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                            -{discountPercentage}%
                          </span>
                        </>
                      )}
                      {!hasDiscount && course.price === 0 && (
                        <span className="text-sm font-medium text-[#6cb84d]">Free</span>
                      )}
                    </div>

                    {/* Buttons - Changed "Add to Cart" to "Buy Now" */}
                    <div className={`grid gap-2 ${
                      viewMode === 'grid' ? 'mt-4 grid-cols-2' : 'mt-3 flex'
                    }`}>
                      <button
                        onClick={() => handleViewDetails(course)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#016ab7] to-[#6cb84d] px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-[#016ab7]/25 hover:scale-[1.02]"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => {
                          console.log(`Added ${course.title} to cart`);
                        }}
                        className="rounded-lg border-2 border-[#016ab7] bg-transparent px-4 py-2.5 text-sm font-medium text-[#016ab7] transition-all hover:bg-gradient-to-r hover:from-[#016ab7] hover:to-[#6cb84d] hover:text-white hover:shadow-lg hover:shadow-[#016ab7]/25 hover:border-transparent"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-8">
            <BookOpen className="h-12 w-12 text-slate-400" />
            <p className="mt-4 text-lg font-medium text-slate-600">
              No courses found
            </p>
            <p className="text-sm text-slate-400">
              Try adjusting your filter
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 rounded-lg bg-gradient-to-r from-[#016ab7] to-[#6cb84d] px-6 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-[#016ab7]/25"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#016ab7] hover:text-[#016ab7] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white shadow-sm shadow-[#016ab7]/25"
                        : "border border-slate-200 text-slate-600 hover:border-[#016ab7] hover:text-[#016ab7]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {pagination.totalPages > 5 && (
                <span className="px-2 text-slate-400">...</span>
              )}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#016ab7] hover:text-[#016ab7] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Global styles for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}