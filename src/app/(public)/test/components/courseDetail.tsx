'use client';

import React, { useEffect, useState } from 'react';
import { 
  FaRocket, 
  FaGraduationCap, 
  FaClock, 
  FaUsers, 
  FaChalkboardTeacher,
  FaBriefcase,
  FaHandsHelping,
  FaCertificate,
  FaCheckCircle,
  FaArrowRight,
  FaChartLine,
  FaLaptopCode,
  FaUserGraduate,
  FaInfinity,
  FaBullseye
} from 'react-icons/fa';
import { MdVerified, MdShare, MdEmojiEvents } from 'react-icons/md';

export default function CombinedPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);
    targetDate.setHours(0, 0, 0, 0);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    'AI Foundations & Core Tools',
    'Building Voice Agents & MCPs',
    'Workflow Automation & Creative AI',
    'AI Agents & Multi-Agent Systems',
    'AI Applications & AI Clones',
    'Enterprise Integration & Final Projects',
  ];

  const modules = [
    {
      id: 1,
      level: 'Foundation Level',
      title: 'AI Foundations & Core Tools',
      duration: '1 Week',
      description: 'Master the fundamentals of artificial intelligence and essential tools',
    },
    {
      id: 2,
      level: 'Intermediate Level',
      title: 'Building Voice Agents & MCPs',
      duration: '1 Week',
      description: 'Create voice-enabled applications and multi-modal communication systems',
    },
    {
      id: 3,
      level: 'Intermediate Level',
      title: 'Workflow Automation & Creative AI',
      duration: '1 Week',
      description: 'Automate tasks and leverage AI for creative content generation',
    },
    {
      id: 4,
      level: 'Advanced Level',
      title: 'AI Agents & Multi-Agent Systems',
      duration: '1.5 Weeks',
      description: 'Build autonomous agents and collaborative multi-agent systems',
    },
    {
      id: 5,
      level: 'Advanced Level',
      title: 'AI Applications & AI Clones',
      duration: '1 Week',
      description: 'Develop AI-powered applications and create digital twins',
    },
    {
      id: 6,
      level: 'Specialist Level',
      title: 'Enterprise Integration & Final Projects',
      duration: '0.5 Weeks',
      description: 'Scale AI solutions for enterprise and complete capstone project',
    },
  ];

  const benefits = [
    {
      icon: <FaBullseye className="text-4xl text-emerald-500" />,
      title: 'Career-Focused Curriculum',
      description: 'Learn exactly what employers are looking for in AI specialists',
    },
    {
      icon: <FaChalkboardTeacher className="text-4xl text-emerald-500" />,
      title: 'Expert Mentorship',
      description: 'Get guidance from industry experts with real-world experience',
    },
    {
      icon: <FaBriefcase className="text-4xl text-emerald-500" />,
      title: 'Job-Ready Skills',
      description: 'Build a portfolio of 6 real-world projects to showcase',
    },
    {
      icon: <FaHandsHelping className="text-4xl text-emerald-500" />,
      title: 'Community Support',
      description: 'Join a network of AI learners and professionals',
    },
    {
      icon: <FaCertificate className="text-4xl text-emerald-500" />,
      title: 'Verified Certificate',
      description: 'Earn a recognized certificate to boost your resume',
    },
    {
      icon: <FaInfinity className="text-4xl text-emerald-500" />,
      title: 'Lifetime Access',
      description: 'Get lifetime access to all course materials and updates',
    },
  ];

  const outcomes = [
    'Build production-ready AI applications from scratch',
    'Create voice-enabled assistants and chatbots',
    'Automate complex workflows using AI',
    'Design and deploy multi-agent systems',
    'Develop AI clones and digital twins',
    'Integrate AI solutions into enterprise environments',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-100/30 to-transparent z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 rounded-full shadow-md">
                <span className="text-white text-sm font-semibold">🚀 Limited Time Offer</span>
              </div>

              {/* Heading */}
              <div className="space-y-3">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                    AI Generalist
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    to Specialist
                  </span>
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                  Turn your AI curiosity into real skills. Progress through 6 levels of hands-on learning—AI tools, automation, and app building—with expert mentors guiding your journey.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-gray-800">6 Weeks</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-gray-800">15k+</p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-gray-800">4.7</p>
                  <p className="text-xs text-gray-500">Rating ⭐</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-gray-800">✓</p>
                  <p className="text-xs text-gray-500">Certificate</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></span>
                  What You Get:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button className="group bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:gap-3">
                <span>Start Learning Now</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Right Column - Product Card */}
            <div className="relative">
              {/* Floating decoration */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-emerald-200 rounded-full blur-2xl opacity-50 z-0"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-200 rounded-full blur-2xl opacity-50 z-0"></div>
              
              {/* Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
                {/* Card Header with Image */}
                <div className="relative h-56 bg-gradient-to-r from-emerald-600 to-cyan-600">
                  <img 
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop" 
                    alt="AI Course"
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                      🔥 Limited Time
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 text-center shadow-md">
                    <p className="text-xs text-gray-500">Ends in</p>
                    <p className="text-sm font-mono font-bold text-gray-800">
                      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                    </p>
                  </div>
                  
                  {/* Card Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl">AI Mastery Program</h3>
                    <p className="text-white/80 text-sm">Complete Learning Path</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Pricing */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline justify-center gap-3 mb-2">
                      <span className="text-2xl text-gray-400 line-through">₹49,999</span>
                      <span className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                        ₹24,999
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>One-time payment • Lifetime access</span>
                    </div>
                  </div>

                  {/* Plan Benefits */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Why choose this plan?
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Lifetime access to all 6 levels
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Expert mentor guidance
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Hands-on projects & real-world applications
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Community access & networking
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Certificate of completion
                      </li>
                    </ul>
                  </div>

                  {/* Enroll Button */}
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Enroll Now - Save 50%
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>

                  {/* Guarantee */}
                  <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <span>🔒</span> 7-day money-back guarantee • No hidden fees
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Detail Section */}
      <div className="bg-gray-50">
        {/* Program Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                <FaRocket className="w-4 h-4" />
                <span>6-Week Journey</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Complete AI Mastery Program
              </h1>
              <p className="text-lg text-gray-600">
                From fundamentals to enterprise integration — become a job-ready AI specialist through 
                6 progressive levels of hands-on learning, expert mentorship, and real-world projects.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold">6</p>
                <p className="text-sm opacity-90">Comprehensive Levels</p>
              </div>
              <div>
                <p className="text-3xl font-bold">30+</p>
                <p className="text-sm opacity-90">Hours of Content</p>
              </div>
              <div>
                <p className="text-3xl font-bold">6</p>
                <p className="text-sm opacity-90">Real-World Projects</p>
              </div>
              <div>
                <p className="text-3xl font-bold">15k+</p>
                <p className="text-sm opacity-90">Active Students</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Vertical Scroll */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          
          {/* About This Program Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Program</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                The <span className="font-semibold text-emerald-600">AI Generalist to Specialist</span> program is a comprehensive 
                6-week journey designed to transform you from an AI enthusiast into a job-ready AI professional. 
                Whether you're a beginner or have some experience, this program meets you where you are and 
                takes you to where you want to be.
              </p>
              <p>
                Unlike traditional courses that only teach theory, our program is <span className="font-semibold">100% hands-on</span>. 
                You'll build real AI applications, voice agents, automation workflows, multi-agent systems, 
                and even your own AI clone. Each level is carefully crafted to build upon the previous one, 
                ensuring a solid foundation before moving to advanced topics.
              </p>
              <p>
                With <span className="font-semibold">expert mentors</span> guiding you every step of the way and a 
                <span className="font-semibold"> supportive community</span> of learners, you'll never feel stuck or alone. 
                By the end of this program, you'll have a portfolio of 6 impressive projects and the confidence 
                to tackle any AI challenge.
              </p>
            </div>
          </section>

          {/* Who Is This For Section */}
          <section className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Who Is This Program For?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <FaUserGraduate className="text-3xl text-emerald-600 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Beginners</h3>
                <p className="text-gray-600 text-sm">No prior AI experience needed. We start from the very basics.</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <FaLaptopCode className="text-3xl text-emerald-600 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Developers</h3>
                <p className="text-gray-600 text-sm">Programmers looking to add AI skills to their toolkit.</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <FaChartLine className="text-3xl text-emerald-600 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Career Changers</h3>
                <p className="text-gray-600 text-sm">Professionals transitioning into AI and ML roles.</p>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Program Benefits</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Learning Outcomes Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What You'll Achieve</h2>
            <p className="text-gray-600 mb-6">By the end of this program, you will be able to:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <FaCheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">{outcome}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Complete Curriculum Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Curriculum</h2>
            <p className="text-gray-600 mb-6">6 progressive levels with 30+ hours of hands-on content</p>
            
            <div className="space-y-4">
              {modules.map((module) => (
                <div 
                  key={module.id} 
                  className="group flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer hover:border-emerald-200"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform duration-300">
                    {module.id}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">{module.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        <FaClock className="w-3 h-3" />
                        <span>{module.duration}</span>
                      </div>
                      <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        {module.level}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{module.description}</p>
                  </div>
                  
                  <div className="flex-shrink-0 text-emerald-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all duration-300">
                    <FaArrowRight className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certification Section */}
          <section className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
            <FaCertificate className="text-5xl mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-2">Earn a Verified Certificate</h2>
            <p className="opacity-90 mb-4 max-w-2xl mx-auto">
              Showcase your achievement on LinkedIn and your resume. Get a shareable link and verified credential.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <MdVerified className="w-4 h-4" />
                <span>Industry Recognized</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <MdShare className="w-4 h-4" />
                <span>Shareable Link</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <MdEmojiEvents className="w-4 h-4" />
                <span>Verified Achievement</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}