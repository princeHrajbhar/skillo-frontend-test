import { forwardRef, useState } from "react";
import { FileText, ChevronRight, Clock, PlayCircle } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface CurriculumSectionProps {
  course: any;
}

const CurriculumSection = forwardRef<HTMLDivElement, CurriculumSectionProps>(({ course }, ref) => {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([course.curriculum[0]?.week]);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNumber) 
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  return (
    <div ref={ref} id="curriculum" className="scroll-mt-20 mb-16">
      <SectionHeader 
        title="Curriculum" 
        icon={FileText} 
        iconBgColor="bg-green-100" 
        iconColor="text-green-600"
        gradientColor="from-green-600 to-green-400"
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <h3 className="text-2xl font-bold mb-2">Course Curriculum</h3>
            <p className="text-gray-600">{course.lectures} lectures • {course.duration} total length</p>
          </div>
          
          {course.curriculum.map((week: any) => (
            <div key={week.week} className="border-b last:border-0">
              <button
                onClick={() => toggleWeek(week.week)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`transform transition-transform ${expandedWeeks.includes(week.week) ? 'rotate-90' : ''}`}>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-left">Week {week.week}: {week.title}</h4>
                    <p className="text-sm text-gray-500">{week.topics.length} topics</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>2 hours</span>
                </div>
              </button>
              
              {expandedWeeks.includes(week.week) && (
                <div className="px-5 pb-5 animate-slide-down">
                  <ul className="space-y-2">
                    {week.topics.map((topic: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer">
                        <PlayCircle className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
                        <span className="flex-1">{topic}</span>
                        <span className="text-sm text-gray-400">15:24</span>
                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          Preview
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CurriculumSection.displayName = "CurriculumSection";
export default CurriculumSection;