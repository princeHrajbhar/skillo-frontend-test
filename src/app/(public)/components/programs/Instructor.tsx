export default function Instructor() {
  const instructor = {
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    title: "Senior React Developer & Tech Lead",
    bio: "Sarah has over 8 years of experience building scalable React applications for Fortune 500 companies. She's passionate about teaching and has helped thousands of developers level up their skills. As a Google Developer Expert and frequent conference speaker, she brings real-world insights to every lesson.",
    experience: "8+ years",
    students: 5000,
    courses: 12,
    rating: 4.9,
  };

  return (
    <div className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ borderColor: '#6CB84D', color: '#6CB84D' }}>
            Meet Your Instructor
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Meet Your Instructor
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900">{instructor.name}</h3>
              <p className="mb-4 text-blue-600">{instructor.title}</p>
              <p className="mb-4 text-gray-600">{instructor.bio}</p>
              <div className="flex justify-center gap-6 md:justify-start">
                <div>
                  <div className="font-semibold text-gray-900">{instructor.experience}</div>
                  <div className="text-sm text-gray-500">Experience</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{instructor.students.toLocaleString()}+</div>
                  <div className="text-sm text-gray-500">Students</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{instructor.courses}</div>
                  <div className="text-sm text-gray-500">Courses</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{instructor.rating}</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}