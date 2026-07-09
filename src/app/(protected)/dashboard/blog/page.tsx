// admin-dashboard\src\app\(pages)\dashboard\blog\page.tsx
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
  User,
  Tag,
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  FileText,
  X
} from 'lucide-react';
import { useBlog } from '../../../../features/blog/hooks/useBlog';

export default function BlogPage() {
  const router = useRouter();
  const { 
    blogs: allBlogs, 
    pagination, 
    isLoading, 
    error, 
    useGetBlogs,
    deleteBlog, 
    updateBlogStatus,
    useGetBlogStats,
    stats 
  } = useBlog();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filteredBlogs, setFilteredBlogs] = useState(allBlogs);

  // Build query params for API (without search - we'll handle search client-side)
  const buildParams = (page: number) => {
    const params: any = {
      page,
      limit: 10,
      sortBy: sortBy as 'createdAt' | 'postingDate' | 'title',
      sortOrder,
    };
    
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    
    return params;
  };

  // Fetch blogs using the hook at the top level
  const { refetch: refetchBlogs, isFetching } = useGetBlogs(buildParams(currentPage));
  
  // Fetch stats using the hook at the top level
  const { refetch: refetchStats } = useGetBlogStats();

  // Refetch when filters change
  useEffect(() => {
    refetchBlogs();
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [currentPage, sortBy, sortOrder, selectedStatus, selectedCategory, refetchBlogs]);

  // Filter blogs client-side based on search query
  useEffect(() => {
    if (!allBlogs || allBlogs.length === 0) {
      setFilteredBlogs([]);
      return;
    }

    let filtered = [...allBlogs];

    // Client-side search filter - case insensitive title match
    if (searchQuery && searchQuery.trim()) {
      const searchLower = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBlogs(filtered);
  }, [allBlogs, searchQuery]);

  // Fetch stats on mount
  useEffect(() => {
    refetchStats();
  }, []);

  // Get unique categories from filtered posts
  const categories = useMemo(() => {
    return ['all', ...new Set(allBlogs.map(post => post.category))];
  }, [allBlogs]);

  const getStatusColor = (status: string) => {
    return status === 'published' 
      ? 'bg-emerald-100 text-emerald-700' 
      : 'bg-amber-100 text-amber-700';
  };

  const getStatusIcon = (status: string) => {
    return status === 'published' 
      ? <CheckCircle className="w-3.5 h-3.5" />
      : <AlertCircle className="w-3.5 h-3.5" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle view blog
  const handleViewBlog = (id: string) => {
    router.push(`/dashboard/blog/${id}`);
  };

  // Handle edit blog
  const handleEditBlog = (id: string) => {
    router.push(`/dashboard/blog/${id}`);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) return;

    try {
      setDeletingId(id);
      await deleteBlog(id);
      refetchBlogs();
      refetchStats();
    } catch (err: any) {
      alert(err.message || 'Failed to delete blog');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, status: 'draft' | 'published') => {
    try {
      await updateBlogStatus({ id, status });
      refetchBlogs();
      refetchStats();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleRefresh = () => {
    refetchBlogs();
    refetchStats();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search input change - updates searchQuery state which triggers client-side filtering
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Reset to first page when searching
    if (value.trim()) {
      setCurrentPage(1);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Apply filter changes immediately (for dropdowns)
  const handleFilterChange = (type: 'status' | 'category', value: string) => {
    if (type === 'status') {
      setSelectedStatus(value);
    } else {
      setSelectedCategory(value);
    }
    setCurrentPage(1);
    // Refetch immediately for filter changes
    setTimeout(() => refetchBlogs(), 0);
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

  // Use filtered blogs for display
  const displayBlogs = searchQuery.trim() ? filteredBlogs : allBlogs;

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
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {showLoading ? 'Loading...' : (
              <>
                {searchQuery.trim() ? (
                  <span>
                    Found <span className="font-medium text-gray-700">{displayBlogs.length}</span> matching posts
                    {` (from ${pagination?.total || 0} total)`}
                  </span>
                ) : (
                  <span>{pagination?.total || 0} blog posts found</span>
                )}
              </>
            )}
            {stats && !showLoading && (
              <span className="ml-4 text-xs">
                <span className="text-emerald-600">{stats.published} published</span>
                {' • '}
                <span className="text-amber-600">{stats.draft} draft</span>
              </span>
            )}
          </p>
        </div>
        <button 
          onClick={() => router.push('/dashboard/blog/add')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25"
        >
          <Plus className="w-4 h-4" />
          New Post
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
              onChange={handleSearchChange}
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
                <button onClick={() => handleFilterChange('status', 'all')}>
                  <X className="w-3 h-3 hover:text-teal-900" />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                Category: {selectedCategory}
                <button onClick={() => handleFilterChange('category', 'all')}>
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
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Sort By</label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                      setTimeout(() => refetchBlogs(), 0);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="postingDate">Posting Date</option>
                    <option value="title">Title</option>
                  </select>
                  <button
                    onClick={() => {
                      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                      setCurrentPage(1);
                      setTimeout(() => refetchBlogs(), 0);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === 'desc' ? '↓' : '↑'}
                  </button>
                </div>
              </div>
              <div className="flex items-end">
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

      {/* Blog Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {showLoading && allBlogs.length === 0 ? (
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
        ) : displayBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No blog posts found</h3>
            <p className="text-gray-500 mt-1">
              {searchQuery.trim() ? (
                `No posts found matching "${searchQuery}"`
              ) : selectedStatus !== 'all' || selectedCategory !== 'all' ? (
                'Try adjusting your filters to find what you\'re looking for'
              ) : (
                'Create your first blog post to get started'
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
                onClick={() => router.push('/dashboard/blog/add')}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Create New Post
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5">
                      <div className="flex items-center gap-1">Post</div>
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden xl:table-cell">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayBlogs.map((post) => {
                    // Check if image URL is valid
                    const imageUrl = post.banner?.url;
                    const hasValidImage = imageUrl && isValidImageUrl(imageUrl);

                    return (
                      <tr key={post._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3.5">
                          <div className="min-w-[200px]">
                            <div className="flex items-center gap-3">
                              {hasValidImage ? (
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                  <img 
                                    src={imageUrl} 
                                    alt={post.title}
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
                                        iconDiv.innerHTML = '<svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>';
                                        parent.appendChild(iconDiv);
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-teal-600" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                                  {post.title}
                                  {searchQuery.trim() && (
                                    <span className="ml-2 text-xs font-normal text-teal-600">
                                      (match)
                                    </span>
                                  )}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {post.keyword?.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="inline-flex items-center gap-0.5 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                      <Tag className="w-2.5 h-2.5" />
                                      {tag}
                                    </span>
                                  ))}
                                  {post.keyword && post.keyword.length > 2 && (
                                    <span className="text-xs text-gray-400">+{post.keyword.length - 2}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className="text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full ${getStatusColor(post.status)}`}>
                              {getStatusIcon(post.status)}
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </span>
                            <button
                              onClick={() => handleStatusUpdate(
                                post._id, 
                                post.status === 'published' ? 'draft' : 'published'
                              )}
                              className="text-xs text-gray-400 hover:text-teal-600 transition-colors"
                            >
                              {post.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden xl:table-cell">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleViewBlog(post._id)}
                              className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                              title="View Blog"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditBlog(post._id)}
                              className="p-1.5 hover:bg-teal-50 rounded-lg transition-colors text-gray-400 hover:text-teal-600"
                              title="Edit Blog"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(post._id)}
                              disabled={deletingId === post._id}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Blog"
                            >
                              {deletingId === post._id ? (
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

            {/* Pagination - Only show if not searching */}
            {!searchQuery.trim() && pagination && pagination.totalPages > 1 && (
              <div className="px-4 py-3.5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-700">{(pagination.page - 1) * pagination.limit + 1}</span> 
                  {' - '}
                  <span className="font-medium text-gray-700">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>
                  {' of '}
                  <span className="font-medium text-gray-700">{pagination.total}</span>
                  {' posts'}
                </p>
                <div className="flex gap-1.5 flex-wrap justify-center">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3.5 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 font-medium"
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {(() => {
                    const totalPages = pagination.totalPages;
                    const currentPageNum = pagination.page;
                    const pageNumbers = [];
                    
                    pageNumbers.push(1);
                    
                    if (currentPageNum > 3) {
                      pageNumbers.push('...');
                    }
                    
                    for (let i = Math.max(2, currentPageNum - 1); i <= Math.min(totalPages - 1, currentPageNum + 1); i++) {
                      if (i === 1 || i === totalPages) continue;
                      pageNumbers.push(i);
                    }
                    
                    if (currentPageNum < totalPages - 2) {
                      pageNumbers.push('...');
                    }
                    
                    if (totalPages > 1) {
                      pageNumbers.push(totalPages);
                    }
                    
                    return pageNumbers.map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-3.5 py-1.5 text-sm text-gray-400">
                            ...
                          </span>
                        );
                      }
                      const pageNum = page as number;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3.5 py-1.5 text-sm rounded-lg transition-colors font-medium ${
                            pagination.page === pageNum
                              ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/25'
                              : 'border border-gray-300 hover:bg-white text-gray-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    });
                  })()}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3.5 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Show count when searching */}
            {searchQuery.trim() && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-700">{displayBlogs.length}</span> matching posts
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}