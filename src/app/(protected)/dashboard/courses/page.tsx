// admin-dashboard/src/app/(pages)/dashboard/courses/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Clock,
  X,
  DollarSign
} from 'lucide-react';
import { useCourse } from '../../../../features/course/hooks/useCourse';
import Image from 'next/image';

export default function CoursesPage() {
  const router = useRouter();
  const { 
    courses: allCourses, 
    isLoading, 
    error, 
    useGetCourses, 
    deleteCourse 
  } = useCourse();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState(allCourses);

  // Fetch courses using the hook at the top level
  const { refetch, isFetching } = useGetCourses();

  // Filter courses client-side based on search query and filters
  useEffect(() => {
    if (!allCourses || allCourses.length === 0) {
      setFilteredCourses([]);
      return;
    }

    let filtered = [...allCourses];

    // Client-side search filter - case insensitive title match
    if (searchQuery && searchQuery.trim()) {
      const searchLower = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.category.toLowerCase().includes(searchLower) ||
        course.keywords?.some(k => k.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(course => course.status === selectedStatus);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    setFilteredCourses(filtered);
  }, [allCourses, searchQuery, selectedStatus, selectedCategory]);

  // Get unique categories from courses
  const categories = useMemo(() => {
    return ['all', ...new Set(allCourses.map(course => course.category))];
  }, [allCourses]);

  // Set initial load to false after first render
  useEffect(() => {
    if (!isLoading && !isFetching) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isFetching]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'ended': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'ended': return <AlertCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number, currency: string) => {
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£'
    };
    return `${symbols[currency] || currency} ${price?.toFixed(2) || '0.00'}`;
  };

  // Handle view course
  const handleViewCourse = (id: string) => {
    router.push(`/dashboard/courses/${id}`);
  };

  // Handle edit course
  const handleEditCourse = (id: string) => {
    router.push(`/dashboard/courses/${id}`);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

    try {
      setDeletingId(id);
      await deleteCourse(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete course');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearAllFilters = () => {
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  // Determine if we should show loading state
  const showLoading = isLoading || isFetching || isInitialLoad;

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (searchQuery && searchQuery.trim()) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Use filtered courses for display
  const displayCourses = filteredCourses;

  // Helper function to check if image URL is valid
  const isValidImageUrl = (url: string | undefined) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-600" />
            Courses
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {showLoading ? 'Loading...' : (
              <>
                {searchQuery.trim() ? (
                  <span>
                    Found <span className="font-medium text-gray-700">{displayCourses.length}</span> matching courses
                    {` (from ${allCourses.length} total)`}
                  </span>
                ) : (
                  <span>{allCourses.length} courses found</span>
                )}
              </>
            )}
          </p>
        </div>
        <button 
          onClick={() => router.push('/dashboard/courses/add')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25"
        >
          <Plus className="w-4 h-4" />
          New Course
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors text-sm font-medium ${
                showFilters 
                  ? 'bg-teal-50 border-teal-300 text-teal-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-teal-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleRefresh}
              className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-500"
              disabled={showLoading}
            >
              <RefreshCw className={`w-4 h-4 ${showLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-gray-500 font-medium">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                Search: {searchQuery}
                <button onClick={clearSearch}>
                  <X className="w-3 h-3 hover:text-teal-900" />
                </button>
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus('all')}>
                  <X className="w-3 h-3 hover:text-teal-900" />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>
                  <X className="w-3 h-3 hover:text-teal-900" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-red-600 font-medium ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button 
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {showLoading && allCourses.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-gray-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : displayCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No courses found</h3>
            <p className="text-gray-500 mt-1">
              {searchQuery.trim() ? (
                `No courses found matching "${searchQuery}"`
              ) : selectedStatus !== 'all' || selectedCategory !== 'all' ? (
                'Try adjusting your filters to find what you\'re looking for'
              ) : (
                'Create your first course to get started'
              )}
            </p>
            {(searchQuery.trim() || selectedStatus !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Clear all filters
              </button>
            )}
            {!searchQuery && selectedStatus === 'all' && selectedCategory === 'all' && (
              <button
                onClick={() => router.push('/dashboard/courses/add')}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Create New Course
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 min-w-[200px]">
                      Course
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden sm:table-cell min-w-[120px]">
                      Category
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell min-w-[100px]">
                      Price
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell min-w-[100px]">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden xl:table-cell min-w-[120px]">
                      Created
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 min-w-[120px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayCourses.map((course) => {
                    // Check if image URL is valid
                    const imageUrl = course.bannerImage?.url;
                    const hasValidImage = imageUrl && isValidImageUrl(imageUrl);

                    return (
                      <tr key={course._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3 min-w-[180px]">
                            {hasValidImage ? (
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                <img 
                                  src={imageUrl} 
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // If image fails to load, show icon instead
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    // Show the fallback icon
                                    const parent = target.parentElement;
                                    if (parent) {
                                      const iconDiv = document.createElement('div');
                                      iconDiv.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100';
                                      iconDiv.innerHTML = '<svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>';
                                      parent.appendChild(iconDiv);
                                    }
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-teal-600" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                                {course.title}
                                {searchQuery.trim() && (
                                  <span className="ml-2 text-xs font-normal text-teal-600">
                                    (match)
                                  </span>
                                )}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {course.keywords?.slice(0, 2).map((tag, i) => (
                                  <span key={i} className="inline-flex items-center gap-0.5 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                    <Tag className="w-2.5 h-2.5" />
                                    {tag}
                                  </span>
                                ))}
                                {course.keywords && course.keywords.length > 2 && (
                                  <span className="text-xs text-gray-400">+{course.keywords.length - 2}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span className="text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg whitespace-nowrap">
                            {course.category}
                          </span>
                          {course.subCategory && (
                            <span className="text-xs text-gray-400 ml-1 whitespace-nowrap">
                              / {course.subCategory}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                              {formatPrice(course.price, course.currency)}
                            </span>
                            {course.discountedPrice > 0 && course.discountedPrice < course.price && (
                              <span className="text-xs text-emerald-600 whitespace-nowrap">
                                {formatPrice(course.discountedPrice, course.currency)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap ${getStatusColor(course.status)}`}>
                            {getStatusIcon(course.status)}
                            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 hidden xl:table-cell">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 whitespace-nowrap">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            {formatDate(course.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleViewCourse(course._id)}
                              className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                              title="View Course"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditCourse(course._id)}
                              className="p-1.5 hover:bg-teal-50 rounded-lg transition-colors text-gray-400 hover:text-teal-600"
                              title="Edit Course"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(course._id)}
                              disabled={deletingId === course._id}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Course"
                            >
                              {deletingId === course._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                            <button 
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                              title="More Options"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Show count when searching */}
            {searchQuery.trim() && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-700">{displayCourses.length}</span> matching courses
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}