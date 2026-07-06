import Image from "next/image";
import { PlayCircle, Zap, Shield, CheckCircle, Bookmark, Share2 } from "lucide-react";

interface CourseCardProps {
  course: any;
  handleEnrollClick: () => void;
  setIsVideoModalOpen: (value: boolean) => void;
  setSelectedVideo: (value: string) => void;
  isBookmarked: boolean;
  setIsBookmarked: (value: boolean) => void;
  handleShare: () => void;
  showShareTooltip: boolean;
}

export default function CourseCard({
  course,
  handleEnrollClick,
  setIsVideoModalOpen,
  setSelectedVideo,
  isBookmarked,
  setIsBookmarked,
  handleShare,
  showShareTooltip
}: CourseCardProps) {
  return (
    <div className="sticky top-24 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <button 
            onClick={() => {
              setSelectedVideo("preview");
              setIsVideoModalOpen(true);
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <PlayCircle className="h-8 w-8 text-blue-600" />
            </div>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl font-bold text-slate-900">{course.price}</span>
              <span className="text-lg text-slate-400 line-through">{course.oldPrice}</span>
              <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-semibold">
                {Math.round((1 - parseFloat(course.price.replace('$', '')) / 
                  parseFloat(course.oldPrice.replace('$', ''))) * 100)}% OFF
              </span>
            </div>
            
            <button 
              onClick={handleEnrollClick}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all transform hover:scale-105 hover:shadow-lg relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #016AB7 0%, #0190E0 100%)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Enroll Now
                <Zap className="h-4 w-4 group-hover:animate-pulse" />
              </span>
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" /> 30-Day Money-Back Guarantee
            </p>
          </div>

          <div className="border-t pt-5">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              This course includes:
            </h4>
            <ul className="space-y-2.5 text-sm">
              {course.includes.slice(0, 5).map((item: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isBookmarked 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save for Later'}
            </button>
            <div className="relative">
              <button 
                onClick={handleShare}
                className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-200"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              {showShareTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
                  Link copied!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}