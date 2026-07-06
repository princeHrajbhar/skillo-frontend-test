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
  Heart,
  Filter,
  X,
  Star,
  Users,
  PlayCircle,
  ArrowRight,
  Mail,
  User,
  Phone,
} from 'lucide-react';
import { useCourse } from '@/features/course/hooks/useCourse';

export default function CategoryCoursesPage() {
  const params = useParams();
  const categorySlug = params.category_slug as string;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const toggleWishlist = (courseId: string) => {
    setWishlist(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSeeAll = () => {
    window.location.href = `/course?category=${categorySlug}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call - Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '' });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedLevel('');
    setSelectedPrice('');
    setSelectedRating('');
    setSearchTerm('');
    setCurrentPage(1);
  };

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
            className="px-4 py-2 bg-[#016ab7] text-white rounded-lg hover:bg-[#015a9e] transition-colors"
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
        {/* Hero Banner - Removed buttons, added subscribe CTA */}
        <div className="relative bg-gradient-to-r from-[#016ab7] to-[#6cb84d] rounded-2xl overflow-hidden mb-8">
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
              <p className="text-white/90 text-sm sm:text-base mb-6">
                Explore our comprehensive collection of {categoryName} courses designed to help you excel
              </p>
              {/* Single Subscribe Button - Opens Modal */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#016ab7] font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
              >
                <Mail className="h-5 w-5" />
                Subscribe for Updates
              </button>
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
                {pagination?.total || courses.length} course{courses.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSeeAll}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#016ab7] text-white rounded-lg hover:bg-[#015a9e] transition-colors text-sm font-medium"
              >
                Browse All Courses
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(selectedLevel || selectedPrice || selectedRating) && (
                  <span className="ml-1 w-2 h-2 bg-[#016ab7] rounded-full"></span>
                )}
              </button>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-[#016ab7]' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-[#016ab7]' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${categoryName} courses...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-[#016ab7]"
          />
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filter Courses</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-[#016ab7] hover:text-[#015a9e] transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-[#016ab7]"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-[#016ab7]"
                >
                  <option value="">All Prices</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-[#016ab7]"
                >
                  <option value="">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Course Display */}
        {courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No courses found in {categoryName}</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-[#016ab7] text-white rounded-lg hover:bg-[#015a9e] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(course._id);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors ${
                      wishlist.includes(course._id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  />
                </button>

                <Link
                  href={`/course/${course.category}/${course.slug}`}
                  className="block"
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {course.bannerImage?.url ? (
                      <img
                        src={course.bannerImage.url}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#016ab7]/10 to-[#6cb84d]/10">
                        <BookOpen className="h-12 w-12 text-[#016ab7]/30" />
                      </div>
                    )}
                    {course.discountedPrice < course.price && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        SAVE {Math.round(((course.price - course.discountedPrice) / course.price) * 100)}%
                      </div>
                    )}
                    {/* Level badge removed - property doesn't exist on ICourse */}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#016ab7] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {course.shortDescription}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course._id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(course._id);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors ${
                      wishlist.includes(course._id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  />
                </button>

                <Link
                  href={`/course/${course.category}/${course.slug}`}
                  className="block"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-64 h-48 sm:h-auto relative bg-gray-100 overflow-hidden">
                      {course.bannerImage?.url ? (
                        <img
                          src={course.bannerImage.url}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#016ab7]/10 to-[#6cb84d]/10">
                          <BookOpen className="h-12 w-12 text-[#016ab7]/30" />
                        </div>
                      )}
                      {course.discountedPrice < course.price && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          SAVE {Math.round(((course.price - course.discountedPrice) / course.price) * 100)}%
                        </div>
                      )}
                      {/* Level badge removed - property doesn't exist on ICourse */}
                    </div>
                    <div className="flex-1 p-5">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#016ab7] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{course.shortDescription}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
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
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200 flex-wrap gap-4">
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

      {/* Subscribe Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Subscribe to {categoryName}</h3>
              <p className="text-gray-600 text-sm mt-2">
                Get updates about new courses and exclusive content
              </p>
            </div>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Subscription Successful!</h4>
                <p className="text-gray-600 text-sm mt-2">Thank you for subscribing to {categoryName} updates.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1 234 567 8900"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {submitStatus === 'error' && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                    Something went wrong. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-[#016ab7]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By subscribing, you agree to receive email updates. You can unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

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