import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

export default function ErrorMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Course Not Found</h1>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist or has been moved.</p>
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Browse All Courses
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}