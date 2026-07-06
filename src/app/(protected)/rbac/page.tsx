'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { Shield, Users, UserCheck, UserX, Plus } from 'lucide-react';

export default function RBACPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  const roles = [
    { name: 'Admin', users: 3, permissions: ['All Access', 'User Management', 'Settings'], color: 'bg-red-500' },
    { name: 'Instructor', users: 12, permissions: ['Course Creation', 'Content Management'], color: 'bg-blue-500' },
    { name: 'Student', users: 1245, permissions: ['Course Access', 'Progress Tracking'], color: 'bg-green-500' },
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Instructor', status: 'Active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Student', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role-Based Access Control</h1>
          <p className="text-gray-500 mt-1">Manage roles and permissions</p>
        </div>
        {user?.role === 'admin' && (
          <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors">
            <Plus size={18} /> Add Role
          </button>
        )}
      </div>

      {/* Roles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center`}>
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-500">{role.users} users</p>
              </div>
            </div>
            <div className="space-y-2">
              {role.permissions.map((perm) => (
                <div key={perm} className="flex items-center gap-2 text-sm text-gray-600">
                  <UserCheck size={14} className="text-green-500" />
                  {perm}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.role === 'Admin' ? 'bg-red-50 text-red-700' :
                      u.role === 'Instructor' ? 'bg-blue-50 text-blue-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-sm ${
                      u.status === 'Active' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {u.status === 'Active' ? <UserCheck size={16} /> : <UserX size={16} />}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
