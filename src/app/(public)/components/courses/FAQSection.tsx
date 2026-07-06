import { forwardRef, useState } from "react";
import { MessageCircle, ChevronDown } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface FAQSectionProps {
  course: any;
}

const FAQSection = forwardRef<HTMLDivElement, FAQSectionProps>(({ course }, ref) => {
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  return (
    <div ref={ref} id="faqs" className="scroll-mt-20">
      <SectionHeader 
        title="Frequently Asked Questions" 
        icon={MessageCircle} 
        iconBgColor="bg-red-100" 
        iconColor="text-red-600"
        gradientColor="from-red-600 to-red-400"
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b">
            <h3 className="text-2xl font-bold mb-2">FAQs</h3>
            <p className="text-gray-600">Everything you need to know about this course</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {(showAllFaqs ? course.faqs : course.faqs.slice(0, 4)).map((faq: any, idx: number) => (
                <div key={idx} className="group">
                  <div className="p-5 bg-gray-50 rounded-xl hover:bg-red-50/30 transition-all cursor-pointer">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-start gap-2">
                      <span className="text-red-600 font-bold">Q.</span>
                      {faq.question}
                    </h4>
                    <p className="text-gray-600 pl-6 flex items-start gap-2">
                      <span className="text-green-600 font-bold">A.</span>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
              
              {course.faqs.length > 4 && (
                <button
                  onClick={() => setShowAllFaqs(!showAllFaqs)}
                  className="w-full mt-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-all group"
                >
                  {showAllFaqs ? "Show Less FAQs" : `Show All ${course.faqs.length} FAQs`}
                  <ChevronDown className={`h-4 w-4 transition-transform group-hover:scale-110 ${showAllFaqs ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

FAQSection.displayName = "FAQSection";
export default FAQSection;