"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  FaBars, FaTimes, FaChevronDown, FaArrowRight, FaGraduationCap, 
  FaNewspaper, FaInfoCircle, FaSignInAlt
} from "react-icons/fa";

// ============================================
// HARDCODED DATA
// ============================================

const categoriesData = [
  {
    name: 'Design',
    slug: 'Design',
    courses: [
      { name: 'UI/UX Design', slug: 'ui-ux-design' },
      { name: 'Graphic Design', slug: 'graphic-design' },
      { name: 'Product Design', slug: 'product-design' },
      { name: 'Figma Mastery', slug: 'figma-mastery' },
    ]
  },
  {
    name: 'Data Analytics',
    slug: 'Data-Analytics',
    courses: [
      { name: 'Data Analysis with Python', slug: 'data-analysis-python' },
      { name: 'SQL for Data Analysis', slug: 'sql-data-analysis' },
      { name: 'Power BI Masterclass', slug: 'power-bi-masterclass' },
      { name: 'Excel for Analytics', slug: 'excel-analytics' },
    ]
  },
  {
    name: 'Digital Marketing',
    slug: 'Digital-Marketing',
    courses: [
      { name: 'SEO Mastery', slug: 'seo-mastery' },
      { name: 'Social Media Marketing', slug: 'social-media-marketing' },
      { name: 'Content Marketing', slug: 'content-marketing' },
      { name: 'Email Marketing', slug: 'email-marketing' },
    ]
  },
  {
    name: 'Product Management',
    slug: 'Product-Management',
    courses: [
      { name: 'Product Strategy', slug: 'product-strategy' },
      { name: 'Agile Product Management', slug: 'agile-product-management' },
      { name: 'Product Analytics', slug: 'product-analytics' },
      { name: 'UX for Product Managers', slug: 'ux-product-managers' },
    ]
  },
  {
    name: 'AI+ML Automation Mastery',
    slug: 'AI%2BML-Automation-Mastery',
    courses: [
      { name: 'Machine Learning Basics', slug: 'machine-learning-basics' },
      { name: 'Deep Learning', slug: 'deep-learning' },
      { name: 'AI Automation', slug: 'ai-automation' },
      { name: 'Neural Networks', slug: 'neural-networks' },
    ]
  },
  {
    name: 'AI Generalist to Specialist',
    slug: 'Artificial-Intelligence',
    courses: [
      { name: 'AI Generalist to Specialist', slug: 'ai-generalist-to-specialist' },
      { name: 'AI Fundamentals', slug: 'ai-fundamentals' },
      { name: 'Advanced AI', slug: 'advanced-ai' },
      { name: 'AI in Practice', slug: 'ai-in-practice' },
    ]
  }
];

// ============================================
// NAV LINKS
// ============================================

const navLinks = [
  { name: "Blog", href: "/blog" },
  { name: "About Us", href: "/about-us" }
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setActiveDropdown(null);
    setHoveredCategory(null);
    setExpandedCategory(null);
  }, [pathname]);

  // Handle course click - navigates to /course/[category-slug]/[course-slug]
  const handleCourseClick = (categorySlug: string, courseSlug: string) => {
    setActiveDropdown(null);
    setHoveredCategory(null);
    setMobileMenu(false);
    router.push(`/course/${categorySlug}/${courseSlug}`);
  };

  // Handle category click - navigates to /course/[category-slug]
  const handleCategoryClick = (categorySlug: string) => {
    setActiveDropdown(null);
    setHoveredCategory(null);
    setMobileMenu(false);
    router.push(`/course/${categorySlug}`);
  };

  const handleExploreClick = () => {
    setActiveDropdown(null);
    setMobileMenu(false);
    router.push('/course');
  };

  const handleDropdownEnter = () => { 
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); 
    setActiveDropdown("categories"); 
  };
  
  const handleDropdownLeave = () => { 
    hoverTimeoutRef.current = setTimeout(() => { 
      setActiveDropdown(null); 
      setHoveredCategory(null); 
    }, 200); 
  };
  
  const handleRightColumnEnter = () => { 
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); 
  };

  // Get courses for hovered category
  const getHoveredCategoryCourses = (categoryName: string) => {
    const category = categoriesData.find(c => c.name === categoryName);
    return category?.courses || [];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[80px] md:h-[85px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image 
                src="/skillo.png" 
                alt="Skillo Logo" 
                width={160} 
                height={56} 
                className="h-12 md:h-14 w-auto object-contain" 
                priority 
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              {/* Explore Courses Dropdown */}
              <div className="relative" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
                <button 
                  onClick={() => {
                    if (activeDropdown === "categories") {
                      handleExploreClick();
                    } else {
                      setActiveDropdown("categories");
                    }
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                    activeDropdown === "categories" 
                      ? "bg-gradient-to-r from-[#016ab7]/10 to-[#6cb84d]/10 text-[#016ab7]" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#016ab7]"
                  }`}
                >
                  Explore Courses <FaChevronDown className={`text-[10px] transition-transform duration-200 ${activeDropdown === "categories" ? "rotate-180" : ""}`} />
                </button>
                {activeDropdown === "categories" && (
                  <div className="absolute left-0 top-full mt-2 w-[580px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="flex">
                      <div className="w-[280px] p-4 bg-white">
                        <div className="text-xs font-semibold text-[#016ab7] uppercase tracking-wider mb-2 px-2">Categories</div>
                        <div className="space-y-0.5">
                          {categoriesData.map((category) => (
                            <button 
                              key={category.name} 
                              onClick={() => handleCategoryClick(category.slug)} 
                              onMouseEnter={() => setHoveredCategory(category.name)} 
                              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                                hoveredCategory === category.name ? "bg-gradient-to-r from-[#016ab7]/10 to-[#6cb84d]/10 text-[#016ab7]" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <span className="text-sm font-medium flex-1 text-left">{category.name}</span>
                              {hoveredCategory === category.name && <FaArrowRight className="w-3 h-3 text-[#6cb84d]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="w-[280px] bg-gradient-to-br from-slate-50 to-white border-l border-slate-100 p-4" onMouseEnter={handleRightColumnEnter}>
                        {hoveredCategory ? (
                          <div>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                              <div className="text-xs font-semibold text-[#016ab7] uppercase tracking-wider">Available Courses</div>
                            </div>
                            <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
                              {getHoveredCategoryCourses(hoveredCategory).map((course) => {
                                const category = categoriesData.find(c => c.name === hoveredCategory);
                                return (
                                  <button 
                                    key={course.name} 
                                    onClick={() => handleCourseClick(category?.slug || '', course.slug)} 
                                    className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-600 hover:text-[#016ab7] hover:bg-white rounded-lg transition-colors group"
                                  >
                                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-[#016ab7] to-[#6cb84d] rounded-full group-hover:scale-125 transition-transform"></span>
                                    {course.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <FaGraduationCap className="w-8 h-8 mb-4" />
                            <p className="text-sm font-medium">Hover over any category</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Blog Link */}
              <Link href="/blog" className="flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#016ab7] transition-all">
                Blog
              </Link>

              {/* About Us Link */}
              <Link href="/about-us" className="flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#016ab7] transition-all">
                About Us
              </Link>
            </nav>

            {/* Login Button */}
            <Link href="/login" className="hidden lg:flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#016ab7] to-[#6cb84d] px-6 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#016ab7]/25 transition-all">
              <FaSignInAlt className="w-4 h-4" />
              Login
            </Link>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              {mobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
        mobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"
      }`} onClick={() => setMobileMenu(false)} />

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-[101] transform transition-transform duration-300 lg:hidden ${
        mobileMenu ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <Image src="/skillo.png" alt="Skillo Logo" width={100} height={32} className="h-8 w-auto" />
          <button onClick={() => setMobileMenu(false)} className="p-2 text-slate-500"><FaTimes size={20} /></button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-70px)] bg-white p-4 space-y-4">
          <div>
            <button 
              onClick={() => {
                if (activeDropdown === "mobile-categories") {
                  handleExploreClick();
                } else {
                  setActiveDropdown("mobile-categories");
                }
              }} 
              className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-800"
            >
              Explore Courses
              <FaChevronDown className={`text-slate-400 transition-transform ${
                activeDropdown === "mobile-categories" ? "rotate-180" : ""
              }`} />
            </button>
            {activeDropdown === "mobile-categories" && (
              <div className="mt-2 space-y-2">
                {categoriesData.map((category) => (
                  <div key={category.name} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => {
                        if (expandedCategory === category.name) {
                          handleCategoryClick(category.slug);
                        } else {
                          setExpandedCategory(category.name);
                        }
                      }} 
                      className="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-semibold transition"
                    >
                      <span>{category.name}</span>
                      <FaChevronDown className={`transition-transform ${
                        expandedCategory === category.name ? "rotate-180" : ""
                      }`} />
                    </button>
                    {expandedCategory === category.name && (
                      <div className="p-2 space-y-1 bg-white">
                        {category.courses.map((course) => (
                          <button 
                            key={course.name} 
                            onClick={() => { handleCourseClick(category.slug, course.slug); }} 
                            className="block w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-[#016ab7] hover:bg-gradient-to-r hover:from-[#016ab7]/5 hover:to-[#6cb84d]/5 rounded-lg transition"
                          >
                            {course.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Links */}
          <div className="space-y-2">
            <Link href="/blog" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-800 font-medium">
              Blog
            </Link>
            <Link href="/about-us" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-800 font-medium">
              About Us
            </Link>
          </div>

          {/* Login Button */}
          <Link href="/login" onClick={() => setMobileMenu(false)} className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#016ab7] to-[#6cb84d] py-3 text-sm font-semibold text-white mt-4 hover:shadow-lg hover:shadow-[#016ab7]/25 transition-all">
            <FaSignInAlt className="w-4 h-4" />
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}