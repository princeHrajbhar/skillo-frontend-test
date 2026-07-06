export default function Curriculum() {
  const modules = [
    { title: "Module 1: React Fundamentals", duration: "8 hours", lessons: 12 },
    { title: "Module 2: Advanced React Patterns", duration: "6 hours", lessons: 10 },
    { title: "Module 3: TypeScript Integration", duration: "5 hours", lessons: 8 },
    { title: "Module 4: State Management", duration: "4 hours", lessons: 6 },
    { title: "Module 5: Real-World Projects", duration: "10 hours", lessons: 15 },
    { title: "Module 6: Testing & Deployment", duration: "6 hours", lessons: 9 },
    { title: "Module 7: Performance Optimization", duration: "4 hours", lessons: 7 },
    { title: "Module 8: Career Preparation", duration: "3 hours", lessons: 5 },
  ];

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ borderColor: '#6CB84D', color: '#6CB84D' }}>
            Course Curriculum
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Course Curriculum
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            A structured learning path from beginner to expert
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {modules.map((module, idx) => (
            <div key={idx} className="rounded-lg bg-gray-50 p-4 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.lessons} lessons</p>
                </div>
                <span className="text-sm font-medium text-blue-600">{module.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}