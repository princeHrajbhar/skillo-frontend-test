'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRightIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  SparklesIcon,
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
  LightBulbIcon,
  StarIcon,
  HeartIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon,
  CommandLineIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  Square3Stack3DIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Dummy data
const aboutData = {
  stats: [
    { id: 1, icon: UsersIcon, label: 'Students Impacted', value: '50,000+' },
    { id: 2, icon: AcademicCapIcon, label: 'Expert Educators', value: '200+' },
    { id: 3, icon: BookOpenIcon, label: 'Courses Offered', value: '100+' },
    { id: 4, icon: TrophyIcon, label: 'Success Rate', value: '95%' },
  ],
  journey: [
    { year: '2020', title: 'The Beginning', description: 'Started with a vision to make quality education accessible to all' },
    { year: '2021', title: 'First Milestone', description: 'Reached 10,000 students and launched our first 20 courses' },
    { year: '2022', title: 'Expansion', description: 'Expanded to 50+ courses and introduced personalized learning paths' },
    { year: '2023', title: 'Innovation', description: 'Launched AI-powered learning tools and interactive resources' },
    { year: '2024', title: 'Global Reach', description: 'Reached 50,000+ students across India and beyond' },
  ],
  team: [
    { id: 1, name: 'Dr. Rajesh Kumar', role: 'Founder & CEO', bio: '20+ years in education technology' },
    { id: 2, name: 'Priya Sharma', role: 'Head of Academics', bio: 'Former CBSE board member' },
    { id: 3, name: 'Amit Patel', role: 'Technology Director', bio: 'Building scalable learning platforms' },
    { id: 4, name: 'Dr. Sneha Reddy', role: 'Content Lead', bio: 'PhD in Science Education' },
  ],
  achievements: [
    { id: 1, icon: UserGroupIcon, label: 'Active Users', value: '50,000+' },
    { id: 2, icon: ChartBarIcon, label: 'Course Completion Rate', value: '87%' },
    { id: 3, icon: ClockIcon, label: 'Hours of Content', value: '2,500+' },
    { id: 4, icon: BuildingLibraryIcon, label: 'Partner Institutions', value: '500+' },
  ],
  features: [
    { id: 1, icon: CpuChipIcon, title: 'AI-Powered Learning', description: 'Personalized recommendations and adaptive assessments' },
    { id: 2, icon: Square3Stack3DIcon, title: 'Interactive Content', description: 'Engaging videos, quizzes, and hands-on exercises' },
    { id: 3, icon: CloudArrowUpIcon, title: 'Cloud-Based Platform', description: 'Access your learning from anywhere, anytime' },
    { id: 4, icon: ArrowPathIcon, title: 'Real-Time Progress', description: 'Track your growth with detailed analytics' },
  ],
  teamMembers: [
    { id: 1, name: 'Dr. Rajesh Kumar', role: 'Founder & CEO', image: '/team/1.jpg' },
    { id: 2, name: 'Priya Rajbhar', role: 'Head of Academics', image: '/team/2.jpg' },
    { id: 3, name: 'Amit Patel', role: 'Technology Director', image: '/team/3.jpg' },
    { id: 4, name: 'Dr. Sneha Reddy', role: 'Content Lead', image: '/team/4.jpg' },
  ],
  testimonials: [
    { id: 1, name: 'Ananya Singh', role: 'Student', quote: 'This platform transformed my learning experience completely.' },
    { id: 2, name: 'Vikram Mehta', role: 'Parent', quote: 'My daughter\'s confidence and grades improved significantly.' },
    { id: 3, name: 'Dr. Neha Gupta', role: 'School Principal', quote: 'An exceptional resource for modern education.' },
  ],
};

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Black Background with Misty Blue Gradient */}
      <div className="relative overflow-hidden bg-black">
        {/* Animated Misty Blue Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-[#016ab7]/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-[#016ab7]/15 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#6cb84d]/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#016ab7]/5 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
                <SparklesIcon className="h-5 w-5 text-[#6cb84d]" />
                <span className="text-sm font-medium text-white/80">About Our Platform</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                We're Building the{' '}
                <span className="bg-gradient-to-r from-[#6cb84d] via-[#016ab7] to-white text-transparent bg-clip-text">
                  Future of Education
                </span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                A revolutionary platform that combines technology with expert-led learning to make education accessible, engaging, and effective for everyone.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/course"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#016ab7]/20 hover:shadow-[#016ab7]/40 hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
                >
                  Get Started
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <button className="px-8 py-3.5 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl transition-all hover:bg-white/10 hover:border-white/30 inline-flex items-center gap-2">
                  <PlayIcon className="h-5 w-5" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Content - Feature Cards with Glass Effect */}
            <div className="grid grid-cols-2 gap-4">
              {aboutData.features.map((feature) => (
                <div key={feature.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 group">
                  <feature.icon className="h-8 w-8 text-[#6cb84d] mb-3 group-hover:text-[#016ab7] transition-colors" />
                  <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-white/50 text-xs">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Wave with Gradient */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full h-auto"
            preserveAspectRatio="none"
          >
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 50C1200 50 1320 40 1380 35L1440 30V80H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Stats Bar - Floating */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {aboutData.stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-2xl mx-auto mb-3 shadow-lg shadow-[#016ab7]/20">
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Journey Timeline */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#016ab7] uppercase tracking-wider">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">From Vision to Reality</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Every milestone brings us closer to our goal of transforming education</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#016ab7] to-[#6cb84d] transform -translate-x-1/2"></div>

            <div className="space-y-12">
              {aboutData.journey.map((item, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 md:pr-8 md:text-right">
                    {index % 2 === 0 && (
                      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:border-l-4 hover:border-[#016ab7]">
                        <div className="text-3xl font-bold text-[#016ab7] mb-2">{item.year}</div>
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-full shadow-lg shadow-[#016ab7]/20 z-10 flex-shrink-0 mx-4">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>

                  <div className="flex-1 md:pl-8">
                    {index % 2 !== 0 && (
                      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:border-l-4 hover:border-[#6cb84d]">
                        <div className="text-3xl font-bold text-[#016ab7] mb-2">{item.year}</div>
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us - Unique Design */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-[#016ab7] uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Built for the Modern Learner
              </h2>
              <p className="text-gray-600 mb-8">We combine cutting-edge technology with expert knowledge to create an unparalleled learning experience.</p>
              
              <div className="space-y-4">
                {aboutData.features.map((feature) => (
                  <div key={feature.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-lg flex items-center justify-center shadow-lg shadow-[#016ab7]/20">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-3xl p-1 shadow-2xl shadow-[#016ab7]/20">
                <div className="bg-white rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {aboutData.achievements.map((achievement) => (
                      <div key={achievement.id} className="text-center bg-gray-50 rounded-xl p-4 hover:bg-gradient-to-br hover:from-[#016ab7]/5 hover:to-[#6cb84d]/5 transition-all">
                        <div className="flex justify-center mb-2">
                          <achievement.icon className="h-8 w-8 text-[#016ab7]" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{achievement.value}</div>
                        <div className="text-xs text-gray-500">{achievement.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section - Modern Grid */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#016ab7] uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Meet the Experts</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Passionate professionals dedicated to your success</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.team.map((member) => (
              <div key={member.id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="h-2 bg-gradient-to-r from-[#016ab7] to-[#6cb84d]"></div>
                <div className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-[#016ab7]/20 group-hover:scale-110 transition-transform">
                    <UserIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-[#016ab7] font-medium">{member.role}</p>
                  <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials - Unique Carousel Style */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#016ab7] uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">What Our Community Says</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutData.testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#016ab7]/20 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA - Bold and Different with Black Background */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-[#016ab7]/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 -right-4 w-96 h-96 bg-[#6cb84d]/15 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RocketLaunchIcon className="h-16 w-16 text-[#6cb84d] mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Your <br />
            <span className="bg-gradient-to-r from-[#6cb84d] via-[#016ab7] to-white text-transparent bg-clip-text">Learning Journey?</span>
          </h2>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already started their path to success
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/course"
              className="px-10 py-4 bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#016ab7]/20 hover:shadow-[#016ab7]/40 hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 text-lg"
            >
              Start Learning Free
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl transition-all hover:bg-white/10 hover:border-white/30 text-lg"
            >
              Talk to Us
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 50C1200 50 1320 40 1380 35L1440 30V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;