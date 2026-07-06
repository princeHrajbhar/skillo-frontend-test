import { forwardRef } from "react";
import Image from "next/image";
import { User, Award, Star, Users } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface InstructorSectionProps {
  course: any;
}

const InstructorSection = forwardRef<HTMLDivElement, InstructorSectionProps>(({ course }, ref) => {
  return (
    <div ref={ref} id="instructor" className="scroll-mt-20 mb-16">
      <SectionHeader 
        title="Instructor" 
        icon={User} 
        iconBgColor="bg-purple-100" 
        iconColor="text-purple-600"
        gradientColor="from-purple-600 to-purple-400"
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="relative inline-block">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    width={140}
                    height={140}
                    className="rounded-full border-4 border-purple-100"
                  />
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-2">{course.instructor.name}</h3>
                <p className="text-purple-600 mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  {course.instructor.title}
                </p>
                
                <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{course.instructor.rating}</span>
                    <span className="text-gray-500">Instructor Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold">{course.instructor.students.toLocaleString()}</span>
                    <span className="text-gray-500">Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold">{course.instructor.experience}</span>
                    <span className="text-gray-500">Experience</span>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                
                <button className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Follow Instructor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InstructorSection.displayName = "InstructorSection";
export default InstructorSection;