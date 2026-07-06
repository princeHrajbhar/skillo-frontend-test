"use client";

import { useState } from "react";

export default function Hero() {
  const [isEnrolled, setIsEnrolled] = useState(false);

  const course = {
    id: "react-mastery-2024",
    title: "Master React & TypeScript",
    description: "Build production-ready React applications with TypeScript, Tailwind CSS, and modern best practices.",
    category: "Web Development",
    level: "Intermediate",
    instructor: "Sarah Johnson",
    instructorAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4.8,
    reviews: 1243,
    duration: "12 hours",
    price: 49.99,
    originalPrice: 99.99,
    studentsEnrolled: 5432,
    image: "https://sn.shikshanation.com/cardimages/maths-micro.webp?w=256&q=75",
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    console.log("Enrolling in course:", course.id);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {course.category}
              </span>
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {course.level}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {course.title}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              {course.description}
            </p>

            <div className="flex items-center gap-3">
              <img
                src={course.instructorAvatar}
                alt={course.instructor}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">Instructor</p>
                <p className="font-semibold text-gray-900">{course.instructor}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-700">
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-500"> ({course.reviews.toLocaleString()} reviews)</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">{course.duration}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-gray-700">{course.studentsEnrolled.toLocaleString()} students</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">${course.price}</span>
                <span className="text-lg text-gray-400 line-through">${course.originalPrice}</span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                  Save ${(course.originalPrice - course.price).toFixed(2)}
                </span>
              </div>

              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
                >
                  Enroll Now
                </button>
              ) : (
                <button className="flex cursor-default items-center gap-2 rounded-lg bg-green-600 px-8 py-3 font-semibold text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enrolled
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 text-sm text-gray-500">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>30-day money-back guarantee</span>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:sticky lg:top-8">
            <img
              src={course.image}
              alt={course.title}
              className="w-full rounded-xl border border-gray-200 shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}