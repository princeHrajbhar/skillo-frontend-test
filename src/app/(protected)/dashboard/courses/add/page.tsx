// admin-dashboard/src/app/(pages)/dashboard/courses/add/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  BookOpen
} from 'lucide-react';
import { useCourse } from '../../../../../features/course/hooks/useCourse';
import CourseForm from '../../components/course/Form';

export default function AddCoursePage() {
  const router = useRouter();
  const { createCourse } = useCourse();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createCourse(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/courses');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating course:', err);
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/courses"
            className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-teal-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-teal-600" />
              Add New Course
            </h1>
            <p className="text-sm text-gray-500 mt-1">Create a new course</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/courses"
            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-700">Success</p>
            <p className="text-sm text-emerald-600">Course created successfully! Redirecting...</p>
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

      {/* Course Form */}
      <CourseForm
        onSubmit={handleSubmit}
        loading={loading}
        isEdit={false}
      />
    </div>
  );
}