import { forwardRef } from "react";
import { 
  BookOpen, Target, Zap, CheckCircle, Video, Download, 
  Award, Headphones, Wifi, Infinity, Settings, BarChart, 
  Globe, Calendar 
} from "lucide-react";
import SectionHeader from "./SectionHeader";

interface OverviewSectionProps {
  course: any;
}

const OverviewSection = forwardRef<HTMLDivElement, OverviewSectionProps>(({ course }, ref) => {
  const features = [
    { icon: Video, title: `${course.lectures}+ Lectures`, desc: "On-demand video content", color: "blue" },
    { icon: Download, title: "Downloadable Resources", desc: `${course.projects} projects & assets`, color: "green" },
    { icon: Award, title: "Certificate", desc: "of completion", color: "purple" },
    { icon: Headphones, title: "Support", desc: "24/7 mentor assistance", color: "orange" },
    { icon: Infinity, title: "Lifetime Access", desc: "Learn at your pace", color: "red" },
    { icon: Wifi, title: "Offline Access", desc: "Watch on the go", color: "teal" }
  ];

  const keyInfo = [
    { label: "Level", value: course.level, icon: BarChart },
    { label: "Language", value: course.language, icon: Globe },
    { label: "Last Updated", value: course.lastUpdated, icon: Calendar },
    { label: "Certificate", value: course.certificate ? "Yes" : "No", icon: Award, highlight: course.certificate }
  ];

  return (
    <div ref={ref} id="overview" className="scroll-mt-20 mb-16">
      <SectionHeader 
        title="Overview" 
        icon={BookOpen} 
        iconBgColor="bg-blue-100" 
        iconColor="text-blue-600"
        gradientColor="from-blue-600 to-blue-400"
      />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-4">Course Description</h3>
            <p className="text-gray-700 leading-relaxed">{course.longDescription}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-5 flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              What You'll Learn
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {course.learningOutcomes.map((outcome: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all group">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 group-hover:text-gray-900">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-5 flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Course Features
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="group p-4 bg-white rounded-xl border hover:shadow-lg transition-all hover:scale-105">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 bg-${feature.color}-100 rounded-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`h-5 w-5 text-${feature.color}-600`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{feature.title}</p>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl border p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Key Information
              </h3>
              <div className="space-y-4">
                {keyInfo.map((info, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div className="flex items-center gap-2 text-gray-600">
                      <info.icon className="h-4 w-4" />
                      <span>{info.label}</span>
                    </div>
                    <span className={`font-semibold ${info.highlight ? 'text-green-600' : 'text-gray-900'}`}>
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

OverviewSection.displayName = "OverviewSection";
export default OverviewSection;