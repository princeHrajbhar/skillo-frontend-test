// src/app/(public)/course/[category_slug]/[course_slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
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

  const { data: courseData, isLoading, error } = useGetCourseBySlug(courseSlug);
  const course = courseData?.data;

  useEffect(() => {
    if (error) console.error('Error loading course:', error);
  }, [error]);

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-start mx-auto" />
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h3>
          <p className="text-gray-600 mb-4">
            The course you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/course"
            className="inline-flex items-center gap-2 px-6 py-2 bg-brand-gradient text-white rounded-lg hover:opacity-95 transition-colors"
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

  // Reusable header block (rendered above the grid on mobile, in the left column on desktop)
  const HeaderBlock = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full bg-brand-start capitalize">
          {course.category}
        </span>
        {course.subCategory && (
          <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full bg-brand-end">
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
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-brand-start" />
          <span>{duration}</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-brand-start" />
          <span className="capitalize">{course.status || 'Active'}</span>
        </div>
      </div>
    </div>
  );

  // Reusable enroll / pricing card
  const EnrollCard = (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-5 w-full max-w-[380px]">
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
          <span className="mb-1 rounded-full bg-brand-end/10 px-2 py-0.5 text-xs font-semibold text-brand-end">
            {Math.round(((course.price - course.discountedPrice) / course.price) * 100)}% off
          </span>
        )}
      </div>

      <button className="btn-brand w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
        <Play className="w-4 h-4 fill-white" />
        Enroll Now
      </button>

      <div className="mt-4 space-y-2.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-end shrink-0" />
          <span>30-Day Money-Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <InfinityIcon className="w-4 h-4 text-brand-end shrink-0" />
          <span>Lifetime Access on Any Device</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-end shrink-0" />
          <span>Certificate of Completion</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <Link
          href={`/course/${categorySlug}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-start transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {course.category}
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          {/* Main content - Left side */}
          <div className="lg:w-[65%] space-y-10 min-w-0">
            {HeaderBlock}

            {/* What you'll learn */}
            {whatYouWillLearn.length > 0 && (
              <section className="space-y-5">
                <div className="border-l-4 border-brand-start pl-4">
                  <h2 className="text-2xl font-bold text-gray-900">What You Will Learn</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {whatYouWillLearn.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-end shrink-0 mt-0.5" />
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curriculum */}
            {curriculum.length > 0 && (
              <section className="space-y-5">
                <div className="border-l-4 border-brand-start pl-4">
                  <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                </div>
                <div className="space-y-3">
                  {curriculum.map((section: { title?: string; lessons?: { title?: string; duration?: string }[] }, sectionIndex: number) => (
                    <div key={sectionIndex} className="border border-gray-200 rounded-xl overflow-hidden">
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
                                <Video className="w-4 h-4 text-brand-start shrink-0" />
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

            {/* Description / CMS content */}
            {(course.cms || course.shortDescription) && (
              <section className="space-y-5">
                <div className="border-l-4 border-brand-start pl-4">
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
              <section className="space-y-5">
                <div className="border-l-4 border-brand-start pl-4">
                  <h2 className="text-2xl font-bold text-gray-900">Prerequisites</h2>
                </div>
                <ul className="space-y-2">
                  {prerequisites.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-start rounded-full mt-2 shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <section className="space-y-5">
                <div className="border-l-4 border-brand-start pl-4">
                  <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3">
                  {faqs.map((faq: { question: string; answer: string }, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
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
          </div>

          {/* Right Sidebar - Fixed position like navbar */}
          <div className="hidden lg:block lg:w-[35%]">
            {/* Fixed position container */}
            <div className="fixed top-[85px] right-auto" style={{ width: 'calc(35% - 48px)', maxWidth: '420px' }}>
              {EnrollCard}
            </div>
            {/* Invisible spacer to maintain layout */}
            <div className="invisible">{EnrollCard}</div>
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
        <button className="btn-brand px-6 py-2.5 rounded-lg font-semibold">Enroll Now</button>
      </div>
    </main>
  );
}