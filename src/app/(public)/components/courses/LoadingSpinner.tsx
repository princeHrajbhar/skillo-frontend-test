import { BookOpen } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-blue-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">Loading course details...</p>
      </div>
    </div>
  );
}