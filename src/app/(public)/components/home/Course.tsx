"use client";

import { useMemo, useState, useEffect } from "react";
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
import Image from "next/image";

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

export default function CourseListing() {
  const { useGetCourses } = useCourse();
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Build query params - Increase limit to get all courses
  const queryParams: GetCoursesQuery = {
    page: currentPage,
    limit: 50, // Increased to show more courses
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
  }, [currentPage, refetch]);

  const courses = coursesData?.data || [];
  const pagination = coursesData?.pagination;

  const handleViewDetails = (course: any) => {
    const slug = course.slug || slugify(course.title);
    router.push(`/course/${course.category}/${slug}`);
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
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {courses.length} of {pagination?.total || courses.length} courses
          </p>
        </div>

        {/* Course Cards - Grid View Only */}
        {courses.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const hasDiscount = course.discountedPrice !== undefined && 
                                  course.discountedPrice !== null && 
                                  course.discountedPrice < (course.price || 0);
              
              const finalPrice: number = hasDiscount 
                ? course.discountedPrice as number 
                : course.price || 0;
              
              const discountPercentage = hasDiscount && course.price 
                ? calculateDiscount(course.price, course.discountedPrice as number) 
                : 0;

              // Check if image URL is valid
              const isValidImage = course.bannerImage?.url && 
                (course.bannerImage.url.startsWith('http://') || 
                 course.bannerImage.url.startsWith('https://'));

              return (
                <div
                  key={course._id}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image with 614:306 aspect ratio (landscape) */}
                  <div className="relative w-full overflow-hidden rounded-t-xl bg-[#016ab7]/5" style={{ aspectRatio: '614/306' }}>
                    {isValidImage ? (
                      <Image
                        src={course.bannerImage.url}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={false}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-[#016ab7]/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-[#016ab7]/10 px-3 py-1 text-xs font-medium text-[#016ab7]">
                        {course.category || 'General'}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold leading-tight text-slate-900 group-hover:text-[#016ab7] transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                      {course.shortDescription || 'Learn the fundamentals and advanced concepts of this subject.'}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Self-paced</span>
                      </div>
                    </div>

                    {/* Price and Discount */}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">
                        {formatPrice(finalPrice)}
                      </span>
                      {hasDiscount && course.price && (
                        <>
                          <span className="text-sm text-slate-400 line-through">
                            {formatPrice(course.price)}
                          </span>
                          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                            -{discountPercentage}%
                          </span>
                        </>
                      )}
                      {!hasDiscount && course.price === 0 && (
                        <span className="text-sm font-medium text-[#6cb84d]">Free</span>
                      )}
                    </div>

                    {/* Buy Now Button */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleViewDetails(course)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-[#016ab7] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 hover:scale-[1.02]"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => {
                          console.log(`Buy Now: ${course.title}`);
                        }}
                        className="rounded-lg border-2 border-[#016ab7] bg-transparent px-4 py-2.5 text-sm font-medium text-[#016ab7] transition-all hover:bg-[#016ab7] hover:text-white hover:shadow-lg hover:shadow-[#016ab7]/25"
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
              Please check back later for new courses.
            </p>
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
                        ? "bg-[#016ab7] text-white shadow-sm shadow-[#016ab7]/25"
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
    </section>
  );
}