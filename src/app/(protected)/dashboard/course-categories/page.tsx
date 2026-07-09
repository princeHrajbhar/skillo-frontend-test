
// app/dashboard/course/categories/page.tsx
'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  Clock,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useCourseCategory } from '../../../../features/courseCategory/hooks/useCourseCategory';

export default function CourseCategoryPage() {
  const { 
    categories, 
    isLoading, 
    error, 
    useGetCourseCategories,
    createCourseCategory,
    updateCourseCategory,
    deleteCourseCategory
  } = useCourseCategory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories using the hook at the top level
  const { refetch } = useGetCourseCategories();

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createCourseCategory(formData);
      setShowCreateModal(false);
      setFormData({ name: '', slug: '', description: '' });
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    try {
      setSubmitting(true);
      await updateCourseCategory({
        id: editingCategory._id,
        body: {
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description || '',
        }
      });
      setShowEditModal(false);
      setEditingCategory(null);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;

    try {
      setDeletingId(id);
      await deleteCourseCategory(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/course"
            className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-teal-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-teal-600" />
              Course Categories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isLoading ? 'Loading...' : `${filteredCategories.length} categories found`}
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', slug: '', description: '' });
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search categories by name, slug, or description..."
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
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="createdAt">Created At</option>
                  <option value="name">Name</option>
                  <option value="updatedAt">Updated At</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Sort Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">Error</p>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading && categories.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No categories found</h3>
            <p className="text-gray-500 mt-1">Create your first course category to get started</p>
            <button
              onClick={() => {
                setFormData({ name: '', slug: '', description: '' });
                setShowCreateModal(true);
              }}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Create New Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5">
                    <div className="flex items-center gap-1">#</div>
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">
                    Slug
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">
                    Description
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden xl:table-cell">
                    Created At
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCategories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-500">{index + 1}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                          <Tag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                            {category.name}
                          </span>
                          {category.description && (
                            <p className="text-xs text-gray-400 truncate max-w-[150px]">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        /{category.slug}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      {category.description ? (
                        <p className="text-sm text-gray-600 truncate max-w-[200px]">
                          {category.description}
                        </p>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No description</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(category.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => {
                            setEditingCategory({
                              ...category,
                              description: category.description || ''
                            });
                            setShowEditModal(true);
                          }}
                          className="p-1.5 hover:bg-teal-50 rounded-lg transition-colors text-gray-400 hover:text-teal-600"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category._id)}
                          disabled={deletingId === category._id}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Category"
                        >
                          {deletingId === category._id ? (
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
        )}
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Course Category</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ name: '', slug: '', description: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: generateSlug(name),
                      });
                    }}
                    placeholder="e.g., Programming, Design, Business"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., programming, design, business"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">URL-friendly: lowercase, numbers, hyphens only</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the course category (optional)"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Max 500 characters. {formData.description.length}/500
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', slug: '', description: '' });
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Create Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Course Category</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCategory(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setEditingCategory({
                        ...editingCategory,
                        name,
                        slug: generateSlug(name),
                      });
                    }}
                    placeholder="e.g., Programming, Design, Business"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    placeholder="e.g., programming, design, business"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">URL-friendly: lowercase, numbers, hyphens only</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ 
                      ...editingCategory, 
                      description: e.target.value 
                    })}
                    placeholder="Brief description of the course category (optional)"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Max 500 characters. {(editingCategory.description || '').length}/500
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    'Update Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}