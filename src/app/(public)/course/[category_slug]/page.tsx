'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  BookOpen,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Grid,
  AlertCircle,
  X,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useCourse } from '@/features/course/hooks/useCourse';

export default function CategoryCoursesPage() {
  const router = useRouter();
  const params = useParams();
  const categorySlug = params.category_slug as string;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const { useGetCourses } = useCourse();
  const { data, isLoading, error, refetch } = useGetCourses({
    page: 1,
    limit: 100, // Get all courses for client-side filtering
    category: categorySlug,
    status: 'active',
  });

  const allCourses = data?.data || [];
  const pagination = data?.pagination;

  // Client-side search filtering
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) {
      return allCourses;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    return allCourses.filter((course) => {
      const titleMatch = course.title?.toLowerCase().includes(searchLower);
      const descriptionMatch = course.shortDescription?.toLowerCase().includes(searchLower);
      const categoryMatch = course.category?.toLowerCase().includes(searchLower);
      const subCategoryMatch = course.subCategory?.toLowerCase().includes(searchLower);
      
      return titleMatch || descriptionMatch || categoryMatch || subCategoryMatch;
    });
  }, [allCourses, searchTerm]);

  // Pagination for filtered results
  const totalFiltered = filteredCourses.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const formatPrice = (price: number) => {
    return `₹${new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#016ab7] mx-auto" />
          <p className="mt-4 text-gray-600">Loading {categoryName} courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Courses</h2>
          <p className="text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'Failed to load courses'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#016ab7] text-white rounded-lg hover:bg-[#0158a0] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Banner */}
        <div className="relative bg-[#016ab7] rounded-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium mb-4">
                <Tag className="h-4 w-4" />
                {categoryName}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Master {categoryName}
              </h1>
              <p className="text-white/90 text-sm sm:text-base">
                Explore our comprehensive collection of {categoryName} courses designed to help you excel
              </p>
            </div>
          </div>
        </div>

        {/* Back Button & Header */}
        <div className="mb-8">
          <Link
            href="/course"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all courses
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
              <p className="text-gray-500 mt-1">
                {totalFiltered} course{totalFiltered !== 1 ? 's' : ''} available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/course"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#016ab7] text-white font-semibold rounded-lg hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 hover:scale-[1.02] transition-all duration-300 text-sm"
              >
                Browse All Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Search - Client-side search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${categoryName} courses...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-[#016ab7] transition-all"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Active search filter display */}
        {searchTerm && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Search results for:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#016ab7]/10 text-[#016ab7] text-sm rounded-full">
              "{searchTerm}"
              <button
                onClick={clearSearch}
                className="hover:text-[#0158a0] transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
            <span className="text-sm text-gray-400">
              ({totalFiltered} result{totalFiltered !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        {/* Course Display - Grid View Only */}
        {paginatedCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No courses match your search' : `No courses found in ${categoryName}`}
            </p>
            {searchTerm ? (
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search terms
              </p>
            ) : (
              <p className="text-sm text-gray-400 mt-1">
                No courses available in this category yet
              </p>
            )}
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-[#016ab7] text-white rounded-lg hover:bg-[#0158a0] transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCourses.map((course) => {
              // Safe check for valid image URL
              const imageUrl = course.bannerImage?.url;
              const isValidImage = imageUrl && 
                typeof imageUrl === 'string' &&
                (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

              return (
                <div 
                  key={course._id} 
                  className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative flex flex-col h-full"
                >
                  <Link
                    href={`/course/${course.category}/${course.slug}`}
                    className="block flex flex-col h-full"
                  >
                    {/* Image Container - 614x306 dimensions (landscape) */}
                    <div className="relative w-full overflow-hidden rounded-t-2xl bg-[#016ab7]/5 flex-shrink-0" style={{ aspectRatio: '614/306' }}>
                      {isValidImage ? (
                        <Image
                          src={imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          priority={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-[#016ab7]/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#016ab7] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                        {course.shortDescription}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex items-center gap-2">
                          {course.discountedPrice < course.price ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-lg font-bold text-[#016ab7]">
                                {formatPrice(course.discountedPrice)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(course.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(course.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {formatDate(course.createdAt)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200 flex-wrap gap-4">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to{' '}
              {Math.min(endIndex, totalFiltered)} of{' '}
              {totalFiltered} courses
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}