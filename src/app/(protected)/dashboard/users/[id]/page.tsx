// admin-dashboard/src/app/(pages)/dashboard/users/edit/[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  X,
  User,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  Key,
  Trash2,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import { useUser } from '@/features/user/hooks/useUser';
import { UpdateUserRequest } from '@/features/user/api/userApi';

type UserRole = 'user' | 'admin' | 'superadmin';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { updateUser, deleteUser, toggleVerification, useGetUserById } = useUser();
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    email: '',
    role: 'user',
    isVerified: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch user using the hook at the top level
  const { data: userData, isLoading, refetch } = useGetUserById(id);

  // Populate form data when user data is loaded
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setFormData({
        email: user.email,
        role: user.role as UserRole,
        isVerified: user.isVerified,
      });
    }
  }, [userData]);

  // Refetch if ID changes
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const user = userData?.data;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === 'role') {
      setFormData(prev => ({
        ...prev,
        [name]: value as UserRole,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUser({ id, body: formData });
      setSuccess(true);
      setIsEditing(false);
      refetch();
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyToggle = async () => {
    try {
      await toggleVerification(id);
      refetch();
      alert('User verification status toggled successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    }
  };

  // Check lock status using the hook
  const { useCheckLockStatus } = useUser();
  const [checkingLock, setCheckingLock] = useState(false);
  
  const handleCheckLockStatus = async () => {
    if (!user) return;
    try {
      setCheckingLock(true);
      // Use the query hook to fetch lock status
      const result = useCheckLockStatus(user.email);
      const data = result.data;
      
      if (data?.data) {
        alert(`User ${user.email} is ${data.data.isLocked ? '🔒 Locked' : '🔓 Unlocked'}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to check lock status');
    } finally {
      setCheckingLock(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteUser(id);
      alert('User deleted successfully!');
      router.push('/dashboard/users');
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

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
        return <Shield className="w-5 h-5" />;
      case 'admin':
        return <Shield className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-gray-600">User not found</p>
        <Link
          href="/dashboard/users"
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/users"
            className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-teal-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Edit className="w-6 h-6 text-teal-600" />
              Edit User
            </h1>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                Cancel Edit
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit User
              </>
            )}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-700">Success</p>
            <p className="text-sm text-emerald-600">User updated successfully!</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* User Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
            <User className="w-10 h-10 text-teal-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.email}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full ${getRoleColor(user.role)}`}>
                {getRoleIcon(user.role)}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              {user.isVerified ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full">
                  <AlertCircle className="w-4 h-4" />
                  Unverified
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleVerifyToggle}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                user.isVerified
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
            >
              {user.isVerified ? 'Unverify' : 'Verify'}
            </button>
            <button
              onClick={handleCheckLockStatus}
              disabled={checkingLock}
              className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {checkingLock ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Key className="w-4 h-4" />
              )}
              Check Lock Status
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Created At</p>
              <p className="text-sm font-medium text-gray-700">{formatDate(user.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Updated At</p>
              <p className="text-sm font-medium text-gray-700">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">User ID</p>
              <p className="text-sm font-mono text-gray-700">{user._id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-medium text-gray-700 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="role"
                    value={formData.role || 'user'}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm bg-white appearance-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified || false}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Verified</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Delete User</h2>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the user <span className="font-semibold text-gray-900">"{user.email}"</span>?
              This will permanently remove the user from the system.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}