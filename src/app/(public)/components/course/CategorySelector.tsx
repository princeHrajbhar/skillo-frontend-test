import Link from 'next/link';
import { 
  ArrowRight, 
  BookOpen, 
  ChevronRight, 
  Cpu, 
  ShieldCheck, 
  Megaphone, 
  Database, 
  Cloud, 
  Code2 
} from 'lucide-react';

const categories = [
  { id: 'artificial-intelligence', name: 'Artificial Intelligence', icon: Cpu, description: 'Generative AI, Machine Learning, Computer Vision, NLP and more', courseCount: 6 },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: ShieldCheck, description: 'Network Security, Ethical Hacking, Cryptography, Security Analysis', courseCount: 8 },
  { id: 'digital-marketing', name: 'Digital Marketing', icon: Megaphone, description: 'SEO, Social Media, Content Marketing, Analytics, Email Marketing', courseCount: 10 },
  { id: 'data-science', name: 'Data Science', icon: Database, description: 'Statistics, Data Visualization, Big Data, Analytics, Python', courseCount: 7 },
  { id: 'cloud-computing', name: 'Cloud Computing', icon: Cloud, description: 'AWS, Azure, GCP, Cloud Architecture, DevOps, Kubernetes', courseCount: 9 },
  { id: 'web-development', name: 'Web Development', icon: Code2, description: 'Next.js, React, TypeScript, Tailwind, Full Stack Development', courseCount: 15 }
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Explore Our <span className="text-blue-600">Courses</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose a path below to start your professional learning journey with industry-standard curriculum.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={`/courses/${category.id}`}
                className="group relative bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon Container - Using Blue/Green Palette */}
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <BookOpen className="w-4 h-4" />
                    {category.courseCount} Courses
                  </span>
                  <div className="p-1 rounded-full bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}