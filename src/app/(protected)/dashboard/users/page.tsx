// admin-dashboard/src/app/(pages)/dashboard/users/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
  Mail,
  Shield,
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Users,
  UserCheck,
  Key,
  Clock
} from 'lucide-react';
import { useUser } from '../../../../features/user/hooks/useUser';

export default function UsersPage() {
  const router = useRouter();
  const { users, isLoading, error, pagination, useGetUsers, deleteUser, toggleVerification } = useUser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Build query params
  const buildParams = () => {
    const params: any = {
      page: currentPage,
      limit: 10,
    };
    
    if (searchQuery) params.search = searchQuery;
    if (selectedRole !== 'all') params.role = selectedRole;
    if (selectedVerification !== 'all') params.isVerified = selectedVerification === 'true';
    
    return params;
  };

  // Fetch users using the hook at the top level
  const { refetch } = useGetUsers(buildParams());

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-700';
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'superadmin':
        return <Shield className="w-3.5 h-3.5" />;
      case 'admin':
        return <UserCheck className="w-3.5 h-3.5" />;
      default:
        return <User className="w-3.5 h-3.5" />;
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

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      setDeletingId(id);
      await deleteUser(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle verify toggle
  const handleVerifyToggle = async (id: string) => {
    try {
      setVerifyingId(id);
      await toggleVerification(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setVerifyingId(null);
    }
  };

  // Check lock status - using the hook
  const { useCheckLockStatus } = useUser();
  const [checkingEmail, setCheckingEmail] = useState<string | null>(null);
  
  const handleCheckLockStatus = async (email: string) => {
    try {
      setCheckingEmail(email);
      // Use the query hook to fetch lock status
      const result = useCheckLockStatus(email);
      const data = result.data;
      
      if (data?.data) {
        alert(`User ${email} is ${data.data.isLocked ? '🔒 Locked' : '🔓 Unlocked'}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to check lock status');
    } finally {
      setCheckingEmail(null);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedVerification('all');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            Users
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLoading ? 'Loading...' : `${pagination?.total || 0} users found`}
          </p>
        </div>
        <button 
          onClick={() => router.push('/dashboard/users/add')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by email..."
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
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Verification</label>
                <select
                  value={selectedVerification}
                  onChange={(e) => setSelectedVerification(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="all">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
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

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
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
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
            <p className="text-gray-500 mt-1">Create your first user to get started</p>
            <button
              onClick={() => router.push('/dashboard/users/add')}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Create New User
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5">
                      #
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5">
                      User
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">
                      Role
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">
                      Status
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
                  {users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-500">
                          {(pagination?.page || 1 - 1) * (pagination?.limit || 10) + index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.email}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {user.isVerified ? (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                  <AlertCircle className="w-3 h-3" />
                                  Unverified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVerifyToggle(user._id)}
                            disabled={verifyingId === user._id}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              user.isVerified
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            }`}
                          >
                            {verifyingId === user._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              user.isVerified ? 'Verified' : 'Verify'
                            )}
                          </button>
                          <button
                            onClick={() => handleCheckLockStatus(user.email)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                            title="Check Lock Status"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden xl:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => router.push(`/dashboard/users/${user._id}`)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                            title="View User"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => router.push(`/dashboard/users/edit/${user._id}`)}
                            className="p-1.5 hover:bg-teal-50 rounded-lg transition-colors text-gray-400 hover:text-teal-600"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id)}
                            disabled={deletingId === user._id}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete User"
                          >
                            {deletingId === user._id ? (
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
            {pagination && pagination.pages > 1 && (
              <div className="px-4 py-3.5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-700">{(pagination.page - 1) * pagination.limit + 1}</span> 
                  {' - '}
                  <span className="font-medium text-gray-700">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>
                  {' of '}
                  <span className="font-medium text-gray-700">{pagination.total}</span>
                  {' users'}
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={pagination.page === 1}
                    className="px-3.5 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 font-medium"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
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
                  {pagination.pages > 5 && (
                    <span className="px-2 py-1.5 text-sm text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={pagination.page === pagination.pages}
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