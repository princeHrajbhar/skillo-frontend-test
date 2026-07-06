"use client";

export default function USP() {
  const features = [
    {
      id: 1,
      title: "Comprehensive Curriculum",
      description: "60+ hours of in-depth content covering React from basics to advanced patterns",
      icon: "📚",
      color: "blue",
    },
    {
      id: 2,
      title: "Hands-on Projects",
      description: "Build 10 real-world projects including e-commerce, dashboard, and social media apps",
      icon: "💻",
      color: "green",
    },
    {
      id: 3,
      title: "TypeScript Mastery",
      description: "Learn TypeScript alongside React to write type-safe, maintainable code",
      icon: "🔷",
      color: "blue",
    },
    {
      id: 4,
      title: "Industry Best Practices",
      description: "Learn modern patterns, hooks, context API, and performance optimization techniques",
      icon: "🏆",
      color: "green",
    },
    {
      id: 5,
      title: "Career Support",
      description: "Resume review, interview preparation, and job placement assistance",
      icon: "🚀",
      color: "purple",
    },
    {
      id: 6,
      title: "Community Access",
      description: "Join our exclusive Discord community with 5000+ active developers",
      icon: "👥",
      color: "orange",
    },
  ];

  const stats = [
    { value: "60+", label: "Video Lectures" },
    { value: "25+", label: "Hours of Content" },
    { value: "10", label: "Real Projects" },
    { value: "5000+", label: "Students" },
  ];

  const whatsIncluded = [
    "📹 60+ HD video lectures",
    "📝 25+ downloadable resources",
    "✅ 10 complete projects",
    "🎯 50+ quizzes & assignments",
    "📱 Mobile & TV access",
    "🎓 Certificate of completion",
    "💬 Direct instructor messaging",
    "🔄 Lifetime updates",
    "👥 Private Discord community",
    "📄 Resume review service",
  ];

  const getIconBgColor = (color: string) => {
    switch(color) {
      case "blue": return "bg-blue-100 text-blue-600";
      case "green": return "bg-green-100 text-green-600";
      case "purple": return "bg-purple-100 text-purple-600";
      case "orange": return "bg-orange-100 text-orange-600";
      default: return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ borderColor: '#6CB84D', color: '#6CB84D' }}>
            Why This Course
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Why Master React & TypeScript With Us?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Join 5000+ students who have transformed their careers with our comprehensive course
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.id} className="group rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-200">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg text-2xl transition-transform duration-300 group-hover:scale-110 ${getIconBgColor(feature.color)}`}>
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* What's Included */}
        <div className="mt-16 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">What's Included in This Course</h3>
              <p className="mt-3 text-gray-600">Get everything you need to master React & TypeScript</p>
              <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md">
                Enroll Now →
              </button>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {whatsIncluded.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <svg className="h-5 w-5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}