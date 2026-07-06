import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, Users, Clock, Video } from "lucide-react";
import CourseCard from "./CourseCard";
import { Course } from "@/app/(public)/types/course";

interface HeroSectionProps {
  course: Course;
  handleEnrollClick: () => void;
  setIsVideoModalOpen: (value: boolean) => void;
  setSelectedVideo: (value: string) => void;
  isBookmarked: boolean;
  setIsBookmarked: (value: boolean) => void;
  handleShare: () => void;
  showShareTooltip: boolean;
}

export default function HeroSection({ 
  course, 
  handleEnrollClick,
  setIsVideoModalOpen,
  setSelectedVideo,
  isBookmarked,
  setIsBookmarked,
  handleShare,
  showShareTooltip
}: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white font-medium truncate">{course.title}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium backdrop-blur-sm">
                ⭐ Bestseller
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium backdrop-blur-sm">
                Updated {course.lastUpdated}
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium backdrop-blur-sm">
                {course.level}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">{course.title}</h1>
            <p className="text-xl text-gray-300 leading-relaxed">{course.subtitle}</p>
            <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <StatCard icon={Star} value={course.rating} label="reviews" color="yellow" />
              <StatCard icon={Users} value={course.studentsEnrolled.toLocaleString()} label="students" color="blue" />
              <StatCard icon={Clock} value={course.duration} label="duration" color="green" />
              <StatCard icon={Video} value={course.lectures} label="lectures" color="purple" />
            </div>
          </div>

          {/* Right Column */}
          <CourseCard 
            course={course}
            handleEnrollClick={handleEnrollClick}
            setIsVideoModalOpen={setIsVideoModalOpen}
            setSelectedVideo={setSelectedVideo}
            isBookmarked={isBookmarked}
            setIsBookmarked={setIsBookmarked}
            handleShare={handleShare}
            showShareTooltip={showShareTooltip}
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: any;
  value: string | number;
  label: string;
  color: string;
}

function StatCard({ icon: Icon, value, label, color }: StatCardProps) {
  const colorClasses = {
    yellow: "text-yellow-400",
    blue: "text-blue-400",
    green: "text-green-400",
    purple: "text-purple-400"
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
      <Icon className={`h-5 w-5 ${colorClasses[color as keyof typeof colorClasses]}`} />
      <div>
        <div className="font-semibold">{value}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
}