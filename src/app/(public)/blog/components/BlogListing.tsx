'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBlog } from '@/features/blog/hooks/useBlog';
import {
  CalendarIcon,
  UserIcon,
  TagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  BookOpenIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const BlogListingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const limit = 9;

  const { useGetBlogs } = useBlog();
  // Get all blogs for client-side filtering
  const { data, isLoading, error, refetch } = useGetBlogs({
    page: 1,
    limit: 100, // Get all blogs for client-side filtering
    status: 'published',
  });

  const allBlogs = data?.data || [];
  const pagination = data?.pagination;

  // Client-side search and category filtering
  const filteredBlogs = useMemo(() => {
    let result = [...allBlogs];

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter((blog) => {
        const titleMatch = blog.title?.toLowerCase().includes(searchLower);
        const descriptionMatch = blog.description?.toLowerCase().includes(searchLower);
        const categoryMatch = blog.category?.toLowerCase().includes(searchLower);
        const contentMatch = blog.content?.toLowerCase().includes(searchLower);
        
        return titleMatch || descriptionMatch || categoryMatch || contentMatch;
      });
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((blog) => blog.category === selectedCategory);
    }

    return result;
  }, [allBlogs, searchTerm, selectedCategory]);

  // Extract unique categories from filtered blogs
  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(allBlogs.map((blog) => blog.category).filter(Boolean)));
    return cats.length > 0 ? cats : ['Technology', 'Education', 'Science', 'Mathematics', 'Language', 'Arts'];
  }, [allBlogs]);

  // Pagination for filtered results
  const totalFiltered = filteredBlogs.length;
  const totalPages = Math.ceil(totalFiltered / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Search Bar Skeleton */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="h-14 bg-white rounded-xl shadow-sm animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Failed to load blog posts. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#016ab7] text-white rounded-lg hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simplified Search Section - Client-side filtering */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by title, description, or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-12 pr-4 py-3.5 bg-white text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#016ab7] transition-all shadow-sm border border-gray-200 text-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter - Pill buttons */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => {
                setSelectedCategory('');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                selectedCategory === ''
                  ? 'bg-[#016ab7] text-white shadow-sm shadow-[#016ab7]/25'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(selectedCategory === category ? '' : category);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-[#016ab7] text-white shadow-sm shadow-[#016ab7]/25'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing {totalFiltered > 0 ? startIndex + 1 : 0} to{' '}
            {Math.min(endIndex, totalFiltered)} of {totalFiltered} articles
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory && ` in "${selectedCategory}"`}
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Active filters display */}
        {(searchTerm || selectedCategory) && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="text-xs text-gray-500">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Search: "{searchTerm}"
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="hover:text-blue-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Category: {selectedCategory}
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setCurrentPage(1);
                  }}
                  className="hover:text-green-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Blog Grid */}
        {paginatedBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No articles found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory 
                ? `No results found${searchTerm ? ` for "${searchTerm}"` : ''}${selectedCategory ? ` in "${selectedCategory}"` : ''}`
                : 'No articles available at the moment'}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-[#016ab7] text-white rounded-lg hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.category?.toLowerCase() || 'uncategorized'}/${blog.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-[#016ab7]/30"
              >
                {/* Image with fixed aspect ratio like course cards */}
                <div className="relative w-full pt-[56.25%] bg-gray-100 overflow-hidden">
                  {blog.banner?.url ? (
                    <Image
                      src={blog.banner.url}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={false}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#016ab7] flex items-center justify-center">
                      <BookOpenIcon className="h-12 w-12 text-white/50" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#016ab7] transition-colors mb-2 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {blog.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                        {formatDate(blog.postingDate || blog.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <UserIcon className="h-3.5 w-3.5 mr-1" />
                        {blog.postedBy || 'Admin'}
                      </span>
                    </div>
                  </div>

                  {blog.keyword && blog.keyword.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {blog.keyword.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {blog.keyword.length > 3 && (
                        <span className="text-gray-400 text-[10px]">+{blog.keyword.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200 flex-wrap gap-4">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, totalFiltered)} of {totalFiltered} articles
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-[#016ab7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-[#016ab7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListingPage;