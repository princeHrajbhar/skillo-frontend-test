'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Real management team data - BUG-017 FIXED
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
    { 
      id: 1, 
      name: 'Saurabh Kumar', 
      role: 'Founder & CEO', 
      bio: 'Gold Medalist in Mechanical Engineering, PhD from Germany, and IIM alumnus with 24+ years of academic leadership. Mentored 1 lakh+ students including IITians, NEET toppers, and board rankers.' 
    },
    { 
      id: 2, 
      name: 'Devendra Gaur', 
      role: 'Chief Strategy Officer (CSO)', 
      bio: 'Seasoned leader with 30+ years in Business strategies for EdTech, coaching, and preschool chains. Expert in public sector engagement and strategic project management.' 
    },
    { 
      id: 3, 
      name: 'Gaurav Mittal', 
      role: 'Chief Technology Officer (CTO)', 
      bio: 'MBA from Symbiosis with backgrounds in IT and Commerce. Led tech at HCL Technologies and EXL. Driving scalable, personalized AI-powered education platform.' 
    },
    { 
      id: 4, 
      name: 'Ameet Vohra', 
      role: 'Chief Sales Officer (CSO)', 
      bio: '23+ years of experience across EdTech, Test Prep, K-12, and Higher Education. Expert in building high-performance sales teams and scaling revenue operations.' 
    },
    { 
      id: 5, 
      name: 'Ashutosh Shukla', 
      role: 'Chief Finance Officer (CFO)', 
      bio: '17+ years in Auditing, Taxation, and Compliance. Expertise in Education, Real Estate, NBFC, and Automobile sectors. Driving financial planning and growth strategy.' 
    },
    { 
      id: 6, 
      name: 'Anurag Mishra', 
      role: 'VP Academics JEE', 
      bio: 'IIT Roorkee alumnus and renowned Physics author with 25+ years mentoring JEE/NEET aspirants. Leading AI-powered strategies for joyful and effective learning.' 
    },
    { 
      id: 7, 
      name: 'Dr. NK Sharma', 
      role: 'VP Academics NEET', 
      bio: 'Medical graduate from LLRM Medical College with 20+ years in NEET coaching. Author of Master Class in Biology and Pearson Guide for AIPMT. Driving student-centric science education.' 
    },
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
  testimonials: [
    { id: 1, name: 'Ananya Singh', role: 'Student', quote: 'This platform transformed my learning experience completely.' },
    { id: 2, name: 'Vikram Mehta', role: 'Parent', quote: 'My daughter\'s confidence and grades improved significantly.' },
    { id: 3, name: 'Dr. Neha Gupta', role: 'School Principal', quote: 'An exceptional resource for modern education.' },
    { id: 4, name: 'Rahul Verma', role: 'Student', quote: 'The interactive content made learning so much more engaging.' },
    { id: 5, name: 'Priya Singh', role: 'Teacher', quote: 'I recommend this platform to all my students for extra practice.' },
    { id: 6, name: 'Amit Kumar', role: 'Parent', quote: 'My child\'s academic performance has improved dramatically.' },
  ],
};

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const testimonialsRef = useRef<HTMLDivElement>(null);
  
  // Form state for BUG-019
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

  // Auto-scroll testimonials
  useEffect(() => {
    const scrollContainer = testimonialsRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    let animationId: number;

    const animate = () => {
      scrollPosition += 0.8;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call - Replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form Data:', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Blue Gradient - No Curve */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#016ab7] via-[#0158a0] to-[#013b6b]">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-[#016ab7]/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-[#0158a0]/15 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#016ab7]/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <SparklesIcon className="h-5 w-5 text-[#6cb84d]" />
                <span className="text-sm font-medium text-white">About Our Platform</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                We're Building the{' '}
                <span className="bg-gradient-to-r from-[#6cb84d] via-white to-[#6cb84d] text-transparent bg-clip-text">
                  Future of Education
                </span>
              </h1>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                A revolutionary platform that combines technology with expert-led learning to make education accessible, engaging, and effective for everyone.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/course"
                  className="px-8 py-3.5 bg-white text-[#016ab7] font-semibold rounded-xl transition-all shadow-lg shadow-black/20 hover:shadow-black/30 hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
                >
                  Get Started
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {aboutData.stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#016ab7] to-[#0158a0] rounded-2xl mx-auto mb-3 shadow-lg shadow-[#016ab7]/20">
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Journey Timeline - BUG-015 FIXED: Horizontal layout */}
      <div className="py-20 bg-gradient-to-b from-white to-[#016ab7]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#016ab7] uppercase tracking-wider">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">From Vision to Reality</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Every milestone brings us closer to our goal of transforming education</p>
          </div>

          <div className="relative overflow-x-auto pb-8">
            <div className="flex gap-8 min-w-max px-4 items-center">
              {aboutData.journey.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="relative flex-shrink-0 w-72">
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:border-l-4 hover:border-[#016ab7]">
                      <div className="text-2xl font-bold text-[#016ab7] mb-2">{item.year}</div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                    </div>
                  </div>
                  {index < aboutData.journey.length - 1 && (
                    <div className="flex-shrink-0 relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#016ab7] to-[#0158a0] rounded-full shadow-lg shadow-[#016ab7]/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="absolute left-1/2 top-1/2 w-8 h-0.5 bg-gradient-to-r from-[#016ab7] to-[#0158a0] transform -translate-y-1/2"></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us - Blue accent */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-[#016ab7] uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Built for the Modern Learner
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">We combine cutting-edge technology with expert knowledge to create an unparalleled learning experience.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutData.features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-4 bg-gray-50 rounded-2xl p-6 hover:shadow-lg hover:bg-gradient-to-br hover:from-[#016ab7]/5 hover:to-[#6cb84d]/5 transition-all border border-gray-100">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#016ab7] to-[#0158a0] rounded-xl flex items-center justify-center shadow-lg shadow-[#016ab7]/20">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section - BUG-017 FIXED: Real management team */}
      <div className="py-20 bg-gradient-to-b from-[#016ab7]/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#016ab7] uppercase tracking-wider">Our Leadership</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Meet Our Management Team</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
              The minds behind Shiksha Nation - leading with vision, passion, and purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.team.map((member) => (
              <div key={member.id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="h-2 bg-gradient-to-r from-[#016ab7] to-[#6cb84d]"></div>
                <div className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#016ab7] to-[#0158a0] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-[#016ab7]/20 group-hover:scale-110 transition-transform">
                    <UserIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-[#016ab7] font-medium">{member.role}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-4">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#016ab7] uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">What Our Community Says</h2>
          </div>
        </div>

        <div
          ref={testimonialsRef}
          className="overflow-x-auto cursor-grab"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-6 w-max px-6">
            {[...aboutData.testimonials, ...aboutData.testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-[320px] flex-shrink-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#016ab7]/30 transition-all"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#016ab7] to-[#0158a0] rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with Form - No Curve */}
      <div className="relative overflow-hidden py-20 bg-gradient-to-br from-[#016ab7] via-[#0158a0] to-[#013b6b]">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-[#016ab7]/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 -right-4 w-96 h-96 bg-[#0158a0]/15 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <RocketLaunchIcon className="h-5 w-5 text-[#6cb84d]" />
                <span className="text-sm font-medium text-white">Get In Touch</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Transform Your{' '}
                <span className="bg-gradient-to-r from-[#6cb84d] via-white to-[#6cb84d] text-transparent bg-clip-text">
                  Learning Journey?
                </span>
              </h2>
              
              <p className="text-lg text-white/90 mb-8">
                Join thousands of students who have already started their path to success. 
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              {/* Key Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/90">
                  <CheckCircleIcon className="h-5 w-5 text-[#6cb84d] flex-shrink-0" />
                  <span>Free consultation with our experts</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <CheckCircleIcon className="h-5 w-5 text-[#6cb84d] flex-shrink-0" />
                  <span>Personalized learning path recommendations</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <CheckCircleIcon className="h-5 w-5 text-[#6cb84d] flex-shrink-0" />
                  <span>Access to exclusive resources and webinars</span>
                </div>
              </div>
            </div>

            {/* Right Content - Contact Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Talk to Us</h3>
              
              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Thank You!</h4>
                  <p className="text-white/80">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSubmitStatus(null)}
                    className="mt-4 text-[#6cb84d] hover:text-[#5da83d] transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#6cb84d] focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#6cb84d] focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#6cb84d] focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#6cb84d] focus:border-transparent transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 text-red-300 text-sm">
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-white text-[#016ab7] font-semibold rounded-lg transition-all shadow-lg shadow-black/20 hover:shadow-black/30 hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#016ab7]/30 border-t-[#016ab7] rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRightIcon className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-white/50 text-center mt-2">
                    We respect your privacy. Your information is safe with us.
                  </p>
                </form>
              )}
            </div>
          </div>
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
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;