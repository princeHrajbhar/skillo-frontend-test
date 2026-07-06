import { forwardRef, useState } from "react";
import Image from "next/image";
import { Star, ThumbsUp } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface ReviewsSectionProps {
  course: any;
}

const ReviewsSection = forwardRef<HTMLDivElement, ReviewsSectionProps>(({ course }, ref) => {
  const [hoveredReview, setHoveredReview] = useState<number | null>(null);

  return (
    <div ref={ref} id="reviews" className="scroll-mt-20 mb-16">
      <SectionHeader 
        title="Reviews" 
        icon={Star} 
        iconBgColor="bg-yellow-100" 
        iconColor="text-yellow-600"
        gradientColor="from-yellow-600 to-yellow-400"
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-slate-900">{course.rating}</div>
                <div className="flex gap-1 mt-3 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-2">Course Rating</div>
              </div>
              <div className="flex-1">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {course.reviews.length} Reviews
                </div>
                <p className="text-gray-600">What students are saying about this course</p>
              </div>
            </div>
          </div>

          <div className="divide-y">
            {course.reviews.map((review: any, idx: number) => (
              <div 
                key={review.id} 
                className={`p-6 transition-all duration-300 ${hoveredReview === idx ? 'bg-yellow-50/30' : ''}`}
                onMouseEnter={() => setHoveredReview(idx)}
                onMouseLeave={() => setHoveredReview(null)}
              >
                <div className="flex gap-4">
                  <Image
                    src={review.avatar}
                    alt={review.user}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{review.user}</h4>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="text-sm text-gray-500 hover:text-yellow-600 transition-colors flex items-center gap-1 group">
                        <ThumbsUp className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" /> 
                        Helpful
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ReviewsSection.displayName = "ReviewsSection";
export default ReviewsSection;