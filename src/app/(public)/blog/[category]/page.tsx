'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBlog } from '@/features/blog/hooks/useBlog';
import {
  CalendarIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  FolderIcon,
  HomeIcon,
  ChevronRightIcon as ChevronRightIconSolid,
  BookOpenIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { format } from 'date-fns';

const CategoryBlogPage = () => {
  const params = useParams();
  const router = useRouter();
  const categoryParam = params?.category as string || '';
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  // Decode and properly format the category
  const decodedCategory = decodeURIComponent(categoryParam);
  
  // We'll fetch all blogs and filter by category on the client side
  // because the API might not handle case-insensitive search
  const { useGetBlogs } = useBlog();
  const { data, isLoading, error } = useGetBlogs({
    page: currentPage,
    limit: 100, // Get more to filter on client side
    status: 'published',
  });

  const allBlogs = data?.data || [];
  const pagination = data?.pagination;

  // Filter blogs by category (case-insensitive)
  const filteredBlogs = allBlogs.filter(blog => 
    blog.category?.toLowerCase() === decodedCategory.toLowerCase()
  );

  // Update pagination info for filtered results
  const totalFiltered = filteredBlogs.length;
  const totalPages = Math.ceil(totalFiltered / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryName = decodedCategory;

  // Debug logging
  useEffect(() => {
    console.log('Category Param:', categoryParam);
    console.log('Decoded Category:', decodedCategory);
    console.log('All Blogs:', allBlogs);
    console.log('Filtered Blogs:', filteredBlogs);
  }, [categoryParam, decodedCategory, allBlogs, filteredBlogs]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="w-full bg-gray-200" style={{ aspectRatio: '614/306' }}></div>
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
          <p className="text-gray-600">Failed to load articles in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* New Hero Section - Modern Minimal */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-x-auto pb-2">
            <Link href="/" className="hover:text-gray-700 transition-colors whitespace-nowrap flex items-center gap-1">
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>
            <ChevronRightIconSolid className="h-4 w-4 flex-shrink-0" />
            <Link href="/blog" className="hover:text-gray-700 transition-colors whitespace-nowrap">
              Blog
            </Link>
            <ChevronRightIconSolid className="h-4 w-4 flex-shrink-0" />
            <span className="text-gray-400 truncate max-w-[150px] sm:max-w-[200px] capitalize">
              {categoryName}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FolderIcon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Category
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 capitalize">
                {categoryName}
              </h1>
              
              <p className="mt-3 text-lg text-gray-600 max-w-2xl">
                Discover insightful articles and stories from the <span className="font-semibold text-gray-900">{categoryName}</span> category
              </p>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <BookOpenIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalFiltered}</div>
                  <div className="text-xs text-gray-500">Articles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Grid */}
        {currentBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No articles found</h3>
            <p className="text-gray-600">There are no articles in this category yet.</p>
            <Link
              href="/blog"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse all articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.map((blog) => {
              // Safe check for valid image URL
              const imageUrl = blog.banner?.url;
              const isValidImage = imageUrl && 
                typeof imageUrl === 'string' &&
                imageUrl.trim() !== '' &&
                (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

              return (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.category?.toLowerCase() || 'uncategorized'}/${blog.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
                >
                  {/* Image Container - 614x306 dimensions (landscape) */}
                  <div className="relative w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: '614/306' }}>
                    {isValidImage ? (
                      <Image
                        src={imageUrl}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={false}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#016ab7]/5">
                        <BookOpenIcon className="h-16 w-16 text-[#016ab7]/30" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {blog.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {blog.postingDate
                            ? format(new Date(blog.postingDate), 'MMM d, yyyy')
                            : format(new Date(blog.createdAt), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {blog.postedBy || 'Admin'}
                        </span>
                      </div>
                    </div>

                    {blog.keyword && blog.keyword.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {blog.keyword.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                        {blog.keyword.length > 3 && (
                          <span className="text-gray-400 text-xs flex items-center">
                            +{blog.keyword.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                const current = currentPage;
                const total = totalPages;

                if (total <= 5) {
                  pageNumber = i + 1;
                } else if (current <= 3) {
                  pageNumber = i + 1;
                } else if (current >= total - 2) {
                  pageNumber = total - 4 + i;
                } else {
                  pageNumber = current - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      pageNumber === currentPage
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-blue-300'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBlogPage;