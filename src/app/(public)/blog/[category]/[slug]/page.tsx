'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useBlog } from '@/features/blog/hooks/useBlog';
import { useCourse } from '@/features/course/hooks/useCourse';
import {
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  TagIcon,
  ClockIcon,
  AcademicCapIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string || '';

  const { useGetBlogBySlug, useGetBlogs } = useBlog();
  const { useGetCourses } = useCourse();
  const { data, isLoading, error } = useGetBlogBySlug(slug);
  const blog = data?.data;

  // Fetch related blogs
  const { data: relatedBlogsData } = useGetBlogs({
    category: blog?.category,
    status: 'published',
    limit: 10,
  });

  // Fetch suggested courses
  const { data: coursesData } = useGetCourses({
    status: 'active',
    limit: 10,
  });

  const relatedBlogs = relatedBlogsData?.data?.filter(
    (b) => b._id !== blog?._id
  ) || [];

  const suggestedCourses = coursesData?.data?.slice(0, 5) || [];

  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [processedContent, setProcessedContent] = useState<string>('');

  // Refs for sticky behavior
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightSidebarRef = useRef<HTMLDivElement>(null);
  const leftContainerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);
  const [isLeftSticky, setIsLeftSticky] = useState(false);
  const [isRightSticky, setIsRightSticky] = useState(false);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(0);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Process content to add IDs to headings for TOC
  useEffect(() => {
    if (blog?.content) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = blog.content;
      
      const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const extractedHeadings: { id: string; text: string; level: number }[] = [];
      
      headingElements.forEach((el) => {
        const text = el.textContent?.trim() || '';
        if (text) {
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
          
          el.id = id;
          
          extractedHeadings.push({
            id,
            text,
            level: parseInt(el.tagName.charAt(1)),
          });
        }
      });
      
      setProcessedContent(tempDiv.innerHTML);
      setHeadings(extractedHeadings);
    }
  }, [blog?.content]);

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('.blog-content h1[id], .blog-content h2[id], .blog-content h3[id]');
      let currentId = '';
      
      headingElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          currentId = el.id;
        }
      });
      
      if (currentId) {
        setActiveHeading(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate sidebar dimensions
  useEffect(() => {
    if (leftSidebarRef.current) {
      setLeftSidebarWidth(leftSidebarRef.current.offsetWidth);
    }
    if (rightSidebarRef.current) {
      setRightSidebarWidth(rightSidebarRef.current.offsetWidth);
    }
  }, [headings, relatedBlogs, suggestedCourses]);

  // Handle sticky behavior for sidebars - Stable version
  const handleSticky = useCallback(() => {
    const navbarHeight = 85;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Only apply sticky on desktop
    if (isMobile) {
      setIsLeftSticky(false);
      setIsRightSticky(false);
      return;
    }

    // Left sidebar sticky - stable calculation
    if (leftContainerRef.current && leftSidebarRef.current) {
      const containerRect = leftContainerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top + scrollY;
      const sidebarHeight = leftSidebarRef.current.offsetHeight;
      const containerHeight = containerRect.height;

      const scrollPosition = scrollY + navbarHeight;
      const shouldStick = 
        scrollPosition > containerTop && 
        scrollPosition < containerTop + containerHeight - sidebarHeight &&
        containerHeight > sidebarHeight + 100;

      setIsLeftSticky(shouldStick);
    }

    // Right sidebar sticky - stable calculation
    if (rightContainerRef.current && rightSidebarRef.current) {
      const containerRect = rightContainerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top + scrollY;
      const sidebarHeight = rightSidebarRef.current.offsetHeight;
      const containerHeight = containerRect.height;

      const scrollPosition = scrollY + navbarHeight;
      const shouldStick = 
        scrollPosition > containerTop && 
        scrollPosition < containerTop + containerHeight - sidebarHeight &&
        containerHeight > sidebarHeight + 100;

      setIsRightSticky(shouldStick);
    }
  }, [isMobile]);

  // Add scroll listener with cleanup
  useEffect(() => {
    handleSticky();

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleSticky();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', handleSticky, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', handleSticky);
    };
  }, [handleSticky, headings, relatedBlogs, suggestedCourses, isMobile]);

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveHeading(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Article not found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-[#016ab7] text-white rounded-lg hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 transition-all"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Sanitize the processed content
  const sanitizedContent = DOMPurify.sanitize(processedContent || blog.content || '', {
    ADD_TAGS: ['style'],
    ADD_ATTR: ['id', 'style', 'class', 'target', 'rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full">
      {/* Banner Image - Responsive */}
      <div className="w-full h-[180px] sm:h-[250px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px] overflow-hidden bg-gray-100">
        {blog.banner?.url ? (
          <img
            src={blog.banner.url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#016ab7]">
            <BookOpenIcon className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-white/50" />
          </div>
        )}
      </div>

      {/* Content Section - Responsive */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 md:py-8">
        <div className="w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb - Responsive */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 overflow-x-auto pb-2">
            <Link href="/" className="hover:text-[#016ab7] transition-colors whitespace-nowrap">
              Home
            </Link>
            <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />
            <Link href="/blog" className="hover:text-[#016ab7] transition-colors whitespace-nowrap">
              Blog
            </Link>
            {blog.category && (
              <>
                <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />
                <Link 
                  href={`/blog/${blog.category.toLowerCase()}`}
                  className="hover:text-[#016ab7] transition-colors whitespace-nowrap"
                >
                  {blog.category}
                </Link>
              </>
            )}
            <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />
            <span className="text-gray-700 truncate max-w-[100px] sm:max-w-[200px] md:max-w-[300px]">{blog.title}</span>
          </div>

          {/* Main Grid Layout - Responsive with stable sidebars */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 xl:gap-8 relative">
            {/* Left Sidebar - Table of Contents - BUG-024 FIXED: Static, concise */}
            <div className="lg:col-span-3 xl:col-span-2 order-2 lg:order-1" ref={leftContainerRef}>
              {headings.length > 0 && (
                <div 
                  ref={leftSidebarRef}
                  className={`${isLeftSticky ? 'lg:fixed lg:top-[85px]' : ''}`}
                  style={{
                    width: isLeftSticky ? `${leftSidebarWidth}px` : 'auto',
                    maxWidth: isLeftSticky ? '280px' : '100%',
                    transition: 'none',
                  }}
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 xl:p-5 max-h-[70vh] overflow-y-auto">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 sm:mb-3 sticky top-0 bg-white z-10 py-1">
                      Table of Contents
                    </h3>
                    <nav className="space-y-0.5">
                      {headings
                        .filter(h => h.level === 2 || h.level === 3)
                        .slice(0, 10)
                        .map((heading, index) => {
                          const isActive = activeHeading === heading.id;
                          const paddingLeft = heading.level === 2 ? 'pl-0' : 'pl-4';
                          const fontSize = heading.level === 2 ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs';
                          const fontWeight = heading.level === 2 ? 'font-medium' : 'font-normal';
                          
                          return (
                            <button
                              key={index}
                              onClick={() => scrollToHeading(heading.id)}
                              className={`block w-full text-left px-2 py-1.5 rounded transition-all ${paddingLeft} ${fontSize} ${fontWeight} ${
                                isActive
                                  ? 'bg-[#016ab7]/10 text-[#016ab7] border-l-2 border-[#016ab7]'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#016ab7]'
                              }`}
                            >
                              <span className="line-clamp-2">{heading.text}</span>
                            </button>
                          );
                        })}
                      {headings.filter(h => h.level === 2 || h.level === 3).length > 10 && (
                        <p className="text-[10px] text-gray-400 text-center pt-1">+{headings.filter(h => h.level === 2 || h.level === 3).length - 10} more</p>
                      )}
                    </nav>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content - BUG-026 FIXED: Improved design quality */}
            <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2">
              <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-5 md:p-6 xl:p-8">
                  {/* Header - Responsive */}
                  <header className="mb-6 sm:mb-8 xl:mb-10">
                    <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                      {blog.category && (
                        <Link
                          href={`/blog/${blog.category.toLowerCase()}`}
                          className="inline-block bg-[#016ab7]/10 text-[#016ab7] text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1 rounded-full hover:bg-[#016ab7]/20 transition-colors"
                        >
                          {blog.category}
                        </Link>
                      )}
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                      {blog.title}
                    </h1>

                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-5 leading-relaxed">
                      {blog.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        {blog.postingDate
                          ? format(new Date(blog.postingDate), 'MMMM d, yyyy')
                          : format(new Date(blog.createdAt), 'MMMM d, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        {blog.postedBy || 'Admin'}
                      </span>
                      {blog.keyword && blog.keyword.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <TagIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {blog.keyword.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-600 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                  </header>

                  {/* Dynamic HTML Content - BUG-026 FIXED: Improved styling */}
                  <div 
                    className="blog-content prose prose-sm sm:prose-base lg:prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                  />
                </div>
              </article>

              {/* Back to Blog - Responsive */}
              <div className="mt-4 sm:mt-6 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center text-[#016ab7] hover:text-[#6cb84d] font-medium transition-colors text-sm sm:text-base"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1.5 sm:mr-2" />
                  Back to All Articles
                </Link>
              </div>
            </div>

            {/* Right Sidebar - BUG-023 FIXED: Static, concise, no sliding */}
            <div className="lg:col-span-3 xl:col-span-3 order-3" ref={rightContainerRef}>
              <div 
                ref={rightSidebarRef}
                className={`${isRightSticky ? 'lg:fixed lg:top-[85px]' : ''}`}
                style={{
                  width: isRightSticky ? `${rightSidebarWidth}px` : 'auto',
                  maxWidth: isRightSticky ? '380px' : '100%',
                  transition: 'none',
                }}
              >
                <div className="space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto pr-1">
                  {/* Suggested Blogs - BUG-023 FIXED: Static, no sliding, concise */}
                  {relatedBlogs.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3 sticky top-0 bg-white z-10 py-1">
                        <BookOpenIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#016ab7]" />
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          You Might Also Like
                        </h3>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {relatedBlogs.slice(0, 3).map((relatedBlog) => (
                          <Link
                            key={relatedBlog._id}
                            href={`/blog/${relatedBlog.category?.toLowerCase() || 'uncategorized'}/${relatedBlog.slug}`}
                            className="block group"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors -mx-1.5 sm:-mx-2">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                {relatedBlog.banner?.url ? (
                                  <img
                                    src={relatedBlog.banner.url}
                                    alt={relatedBlog.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-[#016ab7]/20">
                                    <BookOpenIcon className="h-6 w-6 sm:h-7 sm:w-7 text-[#016ab7]" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs sm:text-sm text-gray-700 group-hover:text-[#016ab7] transition-colors line-clamp-2 font-medium">
                                  {relatedBlog.title}
                                </h4>
                                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                                  <span className="text-[10px] sm:text-xs text-gray-400 flex items-center">
                                    <CalendarIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" />
                                    {relatedBlog.postingDate
                                      ? format(new Date(relatedBlog.postingDate), 'MMM d, yyyy')
                                      : format(new Date(relatedBlog.createdAt), 'MMM d, yyyy')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      {relatedBlogs.length > 3 && (
                        <Link
                          href={`/blog/${blog.category?.toLowerCase()}`}
                          className="block text-center text-xs sm:text-sm text-[#016ab7] hover:text-[#6cb84d] font-medium mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100"
                        >
                          View all related articles →
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Suggested Courses - Images and Price Removed */}
                  {suggestedCourses.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 sm:mb-3 sticky top-0 bg-white z-10 py-1">
                        Recommended Courses
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {suggestedCourses.slice(0, 3).map((suggestedCourse) => (
                          <Link
                            key={suggestedCourse._id}
                            href={`/course/${suggestedCourse.slug}`}
                            className="block group"
                          >
                            <div className="p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors -mx-1.5 sm:-mx-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#016ab7] transition-colors line-clamp-1">
                                  {suggestedCourse.title}
                                </h4>
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">{suggestedCourse.category}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/course"
                        className="mt-2 sm:mt-3 w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-[#016ab7]/10 hover:bg-[#016ab7]/20 text-[#016ab7] rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                      >
                        View All Courses
                        <ChevronRightIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles - Responsive */}
      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          scroll-margin-top: 80px;
        }
        
        .blog-content {
          all: revert;
        }
        
        .blog-content * {
          all: revert;
        }
        
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          scroll-margin-top: 80px !important;
        }
        
        .blog-content h1 {
          font-size: 1.8em !important;
          font-weight: 700 !important;
          margin-top: 1.5em !important;
          margin-bottom: 0.75em !important;
          line-height: 1.3 !important;
        }
        
        .blog-content h2 {
          font-size: 1.4em !important;
          font-weight: 700 !important;
          margin-top: 1.5em !important;
          margin-bottom: 0.75em !important;
          color: #016ab7 !important;
          line-height: 1.3 !important;
        }
        
        .blog-content h3 {
          font-size: 1.2em !important;
          font-weight: 600 !important;
          margin-top: 1.2em !important;
          margin-bottom: 0.5em !important;
          line-height: 1.4 !important;
        }
        
        .blog-content p {
          margin-bottom: 1.2em !important;
          line-height: 1.8 !important;
          color: #374151 !important;
          font-size: 0.95em !important;
        }
        
        .blog-content ul,
        .blog-content ol {
          margin: 0.75em 0 1.2em 0 !important;
          padding-left: 1.5em !important;
        }
        
        .blog-content li {
          margin-bottom: 0.35em !important;
          line-height: 1.7 !important;
        }
        
        .blog-content a {
          color: #016ab7 !important;
          text-decoration: underline !important;
        }
        
        .blog-content a:hover {
          color: #6cb84d !important;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #016ab7 !important;
          padding-left: 1.2em !important;
          margin: 1.2em 0 !important;
          font-style: italic !important;
          color: #4b5563 !important;
        }
        
        .blog-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          margin: 1.5em 0 !important;
        }
        
        .blog-content hr {
          margin: 2em 0 !important;
          border: 0 !important;
          border-top: 1px solid #e5e7eb !important;
        }

        /* Scrollable sidebars */
        .max-h-\\[70vh\\] {
          max-height: 70vh;
        }
        
        .max-h-\\[70vh\\]::-webkit-scrollbar {
          width: 4px;
        }
        
        .max-h-\\[70vh\\]::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .max-h-\\[70vh\\]::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .max-h-\\[70vh\\]::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Responsive adjustments for small screens */
        @media (max-width: 640px) {
          .blog-content h1 {
            font-size: 1.5em !important;
          }
          .blog-content h2 {
            font-size: 1.2em !important;
          }
          .blog-content h3 {
            font-size: 1.1em !important;
          }
          .blog-content p {
            font-size: 0.9em !important;
          }
        }

        /* Fix for sticky sidebars on mobile */
        @media (max-width: 1023px) {
          .lg\\:fixed {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;