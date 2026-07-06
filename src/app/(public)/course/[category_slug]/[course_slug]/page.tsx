// src/app/(public)/course/[category_slug]/[course_slug]/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCourse } from '@/features/course/hooks/useCourse';
import ContentPreview from '@/components/editor/ContentPreview';
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  StarHalf,
  Play,
  CheckCircle,
  Video,
  ChevronDown,
  Loader2,
  ShieldCheck,
  Infinity as InfinityIcon,
  Award,
  AlertCircle,
  ShoppingCart,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

// Format a price in the course's currency (defaults to INR).
const formatPrice = (amount: number, currency = 'INR') => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const { useGetCourseBySlug } = useCourse();
  const categorySlug = params?.category_slug as string;
  const courseSlug = params?.course_slug as string;

  const [expandedCurriculum, setExpandedCurriculum] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  
  // Refs for sticky sidebar
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  const { data: courseData, isLoading, error } = useGetCourseBySlug(courseSlug);
  const course = courseData?.data;

  useEffect(() => {
    if (error) console.error('Error loading course:', error);
  }, [error]);

  // Calculate sidebar height
  useEffect(() => {
    if (sidebarRef.current) {
      setSidebarHeight(sidebarRef.current.offsetHeight);
    }
  }, [course]);

  // Handle sticky sidebar with footer detection
  const handleScroll = useCallback(() => {
    if (!sidebarRef.current || !sidebarContainerRef.current) return;

    const navbarHeight = 85;
    const sidebar = sidebarRef.current;
    const container = sidebarContainerRef.current;
    const footer = document.querySelector('footer');
    
    const containerRect = container.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();
    const sidebarHeight = sidebar.offsetHeight;
    
    // Get footer position
    let footerTop = Infinity;
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      footerTop = footerRect.top;
    }

    // Calculate where sidebar should stop (before footer)
    const scrollY = window.scrollY;
    
    // Container top position
    const containerTop = containerRect.top + scrollY;
    const containerBottom = containerTop + containerRect.height;
    
    // Calculate scroll position
    const scrollPosition = scrollY + navbarHeight;
    
    // Check if sidebar should be sticky
    const shouldStick = 
      scrollPosition > containerTop && 
      scrollPosition < containerBottom - sidebarHeight &&
      containerRect.height > sidebarHeight + 100;

    // Check if sidebar would overlap footer
    const sidebarBottom = scrollY + navbarHeight + sidebarHeight;
    const footerPosition = footerTop + scrollY;
    
    // If sidebar would go past footer, stop it
    if (sidebarBottom > footerPosition - 20) {
      sidebar.style.position = 'absolute';
      sidebar.style.top = (containerRect.height - sidebarHeight) + 'px';
      sidebar.style.bottom = 'auto';
      return;
    }

    if (shouldStick) {
      sidebar.style.position = 'fixed';
      sidebar.style.top = navbarHeight + 'px';
      sidebar.style.bottom = 'auto';
      sidebar.style.left = sidebarRect.left + 'px';
      sidebar.style.width = sidebarRect.width + 'px';
    } else {
      sidebar.style.position = 'relative';
      sidebar.style.top = '0';
      sidebar.style.left = 'auto';
      sidebar.style.width = '100%';
    }
  }, []);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const handleEnrollNow = () => {
    setIsEnrolling(true);
    setTimeout(() => {
      setIsEnrolling(false);
      setEnrollSuccess(true);
      setTimeout(() => setEnrollSuccess(false), 3000);
      console.log('Enrolled in course:', courseSlug);
    }, 1500);
  };

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#016ab7] mx-auto" />
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h3>
          <p className="text-gray-600 mb-4">
            The course you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/course"
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#016ab7] text-white rounded-lg hover:bg-[#015a9e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const whatYouWillLearn = course.whatYouWillLearn || [];
  const prerequisites = course.prerequisites || [];
  const curriculum = course.curriculum || [];
  const faqs = course.faqs || [];
  const duration = course.duration || 'Self-paced';
  const hasDiscount = course.discountedPrice && course.discountedPrice < course.price;
  const finalPrice = hasDiscount ? course.discountedPrice : course.price;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#016ab7] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/course" className="hover:text-[#016ab7] transition-colors">
            Courses
          </Link>
          <span>/</span>
          <Link 
            href={`/course/${categorySlug}`} 
            className="hover:text-[#016ab7] transition-colors capitalize"
          >
            {course.category}
          </Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[200px]">{course.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          {/* Main content - Left side */}
          <div className="lg:w-[65%] space-y-10 min-w-0">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full bg-[#016ab7] capitalize">
                  {course.category}
                </span>
                {course.subCategory && (
                  <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full bg-[#6cb84d]">
                    {course.subCategory}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {course.title}
              </h1>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {course.shortDescription}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">{renderStars(4.5)}</div>
                  <span className="font-semibold text-gray-900">4.5</span>
                  <span className="text-gray-400">(1,234 reviews)</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#016ab7]" />
                  <span>{duration}</span>
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            {whatYouWillLearn.length > 0 && (
              <section className="space-y-5 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">What You Will Learn</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {whatYouWillLearn.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#6cb84d] shrink-0 mt-0.5" />
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curriculum */}
            {curriculum.length > 0 && (
              <section className="space-y-5 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                </div>
                <div className="space-y-3">
                  {curriculum.map((section: { title?: string; lessons?: { title?: string; duration?: string }[] }, sectionIndex: number) => (
                    <div key={sectionIndex} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#016ab7]/30 transition-colors">
                      <button
                        onClick={() =>
                          setExpandedCurriculum(expandedCurriculum === sectionIndex ? null : sectionIndex)
                        }
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{section.title}</span>
                          <span className="text-xs text-gray-500">
                            ({section.lessons?.length || 0} lessons)
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedCurriculum === sectionIndex ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedCurriculum === sectionIndex && (
                        <div className="divide-y divide-gray-100">
                          {section.lessons?.map((lesson, lessonIndex: number) => (
                            <div
                              key={lessonIndex}
                              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Video className="w-4 h-4 text-[#016ab7] shrink-0" />
                                <span className="text-sm text-gray-700">{lesson.title}</span>
                              </div>
                              <span className="text-xs text-gray-500">{lesson.duration || '5 min'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            {(course.cms || course.shortDescription) && (
              <section className="space-y-5 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">About This Course</h2>
                </div>
                {course.cms ? (
                  <ContentPreview html={course.cms} />
                ) : (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {course.shortDescription}
                  </p>
                )}
              </section>
            )}

            {/* Prerequisites */}
            {prerequisites.length > 0 && (
              <section className="space-y-5 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Prerequisites</h2>
                </div>
                <ul className="space-y-2">
                  {prerequisites.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#016ab7] rounded-full mt-2 shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <section className="space-y-5 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3">
                  {faqs.map((faq: { question: string; answer: string }, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#016ab7]/30 transition-colors">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                            openFaq === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openFaq === index && (
                        <div className="border-t border-gray-100 p-4 text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom spacer for sidebar */}
            <div className="h-8"></div>
          </div>

          {/* Right Sidebar - Fixed position with footer detection */}
          <div className="hidden lg:block lg:w-[35%]" ref={sidebarContainerRef}>
            <div 
              ref={sidebarRef}
              className="relative"
              style={{ 
                width: '100%',
                maxWidth: '420px',
              }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-5">
                <div className="relative mb-5 w-full aspect-video overflow-hidden rounded-xl bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      course.bannerImage?.url ||
                      'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800'
                    }
                    alt={course.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(finalPrice, course.currency)}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-gray-400 line-through mb-1">
                      {formatPrice(course.price, course.currency)}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="mb-1 rounded-full bg-[#6cb84d]/10 px-2 py-0.5 text-xs font-semibold text-[#6cb84d]">
                      {Math.round(((course.price - course.discountedPrice) / course.price) * 100)}% off
                    </span>
                  )}
                </div>

                <button
                  onClick={handleEnrollNow}
                  disabled={isEnrolling}
                  className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white hover:shadow-lg hover:shadow-[#016ab7]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : enrollSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Enrolled!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Enroll Now
                    </>
                  )}
                </button>

                {enrollSuccess && (
                  <div className="mt-2 text-center text-sm text-[#6cb84d] font-medium">
                    Successfully enrolled in the course!
                  </div>
                )}

                <div className="mt-4 space-y-2.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#6cb84d] shrink-0" />
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <InfinityIcon className="w-4 h-4 text-[#6cb84d] shrink-0" />
                    <span>Lifetime Access on Any Device</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#6cb84d] shrink-0" />
                    <span>Certificate of Completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky enroll bar */}
        <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-gray-900">
              {formatPrice(finalPrice, course.currency)}
            </p>
            {hasDiscount && (
              <p className="text-xs text-gray-500 line-through">
                {formatPrice(course.price, course.currency)}
              </p>
            )}
          </div>
          <button
            onClick={handleEnrollNow}
            disabled={isEnrolling}
            className="px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEnrolling ? 'Enrolling...' : enrollSuccess ? 'Enrolled ✓' : 'Enroll Now'}
          </button>
        </div>

        {/* Footer spacer */}
        <div className="h-20 md:h-24"></div>
      </div>
    </main>
  );
}