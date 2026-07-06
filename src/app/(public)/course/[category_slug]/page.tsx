'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
  List,
  AlertCircle,
} from 'lucide-react';
import { useCourse } from '@/features/course/hooks/useCourse';

export default function CategoryCoursesPage() {
  const params = useParams();
  const categorySlug = params.category_slug as string;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { useGetCourses } = useCourse();
  const { data, isLoading, error, refetch } = useGetCourses({
    page: currentPage,
    limit: itemsPerPage,
    category: categorySlug,
    search: searchTerm || undefined,
    status: 'active',
  });

  const courses = data?.data || [];
  const pagination = data?.pagination;

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

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
            <p className="text-gray-500 mt-1">
              {pagination?.total || courses.length} course{courses.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${categoryName} courses...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Course Display */}
      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No courses found in {categoryName}</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course._id}
              href={`/course/${course.category}/${course.slug}`}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
  {course.bannerImage?.url ? (
    <img
      src={course.bannerImage.url}
      alt={course.title}
      className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-[1.02]"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
                ) : null}
                {!course.bannerImage?.url && (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-50">
                    <BookOpen className="h-12 w-12 text-indigo-300" />
                  </div>
                )}
                {course.discountedPrice < course.price && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    SAVE {Math.round(((course.price - course.discountedPrice) / course.price) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {course.shortDescription}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {course.discountedPrice < course.price ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-bold text-indigo-600">
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
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Link
              key={course._id}
              href={`/course/${course.category}/${course.slug}`}
              className="block bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-64 h-48 sm:h-auto relative bg-gray-100 overflow-hidden">
  {course.bannerImage?.url ? (
    <img
      src={course.bannerImage.url}
      alt={course.title}
      className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-[1.02]"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-50">
                      <BookOpen className="h-12 w-12 text-indigo-300" />
                    </div>
                  )}
                  {course.discountedPrice < course.price && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      SAVE {Math.round(((course.price - course.discountedPrice) / course.price) * 100)}%
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{course.shortDescription}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {course.discountedPrice < course.price ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-bold text-indigo-600">
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
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} courses
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-700 px-3">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={!pagination.hasNextPage}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}