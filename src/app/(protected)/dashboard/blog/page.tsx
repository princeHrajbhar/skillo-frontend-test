// admin-dashboard\src\app\(pages)\dashboard\blog\page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import { useBlog } from '../../../../features/blog/hooks/useBlog';

export default function BlogPage() {
  const router = useRouter();
  const { 
    blogs, 
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

  // Build query params
  const buildParams = (page: number) => {
    const params: any = {
      page,
      limit: 10,
      sortBy: sortBy as 'createdAt' | 'postingDate' | 'title',
      sortOrder,
    };
    
    if (searchQuery) params.search = searchQuery;
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
    // Mark initial load as complete after first fetch
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [currentPage, sortBy, sortOrder, selectedStatus, selectedCategory, refetchBlogs]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      refetchBlogs();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch stats on mount
  useEffect(() => {
    refetchStats();
  }, []);

  // Get unique categories from posts
  const categories = ['all', ...new Set(blogs.map(post => post.category))];

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

  // Determine if we should show loading state
  const showLoading = isLoading || isFetching || isInitialLoad;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {showLoading ? 'Loading...' : `${pagination?.total || 0} blog posts found`}
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
              placeholder="Search by title, category, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
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
              {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleRefresh}
              className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-500"
            >
              <RefreshCw className={`w-4 h-4 ${showLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

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
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
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
                  onClick={() => {
                    setSelectedStatus('all');
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSortBy('createdAt');
                    setSortOrder('desc');
                    setCurrentPage(1);
                  }}
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
        {showLoading && blogs.length === 0 ? (
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
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No blog posts found</h3>
            <p className="text-gray-500 mt-1">Create your first blog post to get started</p>
            <button
              onClick={() => router.push('/dashboard/blog/add')}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Create New Post
            </button>
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
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">
                      Author
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
                  {blogs.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="min-w-[200px]">
                          <div className="flex items-center gap-3">
                            {post.banner?.url ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                <img 
                                  src={post.banner.url} 
                                  alt={post.title}
                                  className="w-full h-full object-cover"
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
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-teal-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                            {post.postedBy}
                          </span>
                        </div>
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
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
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3.5 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 font-medium"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                    const pageNum = i + 1;
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
                  })}
                  {pagination.totalPages > 5 && (
                    <span className="px-2 py-1.5 text-sm text-gray-400">...</span>
                  )}
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
          </>
        )}
      </div>
    </div>
  );
}