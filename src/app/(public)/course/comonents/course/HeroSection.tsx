'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Slide {
  image: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

const slides: Slide[] = [
  {
    image: 'https://img.magnific.com/free-photo/handsome-young-man-shirt-pointing-fingers-left-promo-showing-logo-standing-blue-background_1258-153241.jpg?semt=ais_hybrid&w=740&q=80',
    badge: '🚀 Start Your Journey Today',
    title: 'Master Modern',
    highlight: 'Web Development',
    description:
      'Learn Next.js, TypeScript, and TailwindCSS through project-based courses.',
  },
  {
    image: 'https://img.magnific.com/free-photo/portrait-smiling-korean-woman-pointing-upper-left-corner-showing-discount-sale-banner-standing_1258-149432.jpg?semt=ais_hybrid&w=740&q=80',
    badge: '🔥 Trending Courses',
    title: 'Become an',
    highlight: 'Full Stack Developer',
    description:
      'Build real-world applications using React, Node.js, MongoDB and Next.js.',
  },
  {
    image: 'https://static.vecteezy.com/system/resources/previews/048/912/104/non_2x/portrait-of-enthusiastic-smiling-woman-female-entrepreneur-pointing-fingers-left-and-showing-advertisement-showing-announcement-white-background-photo.jpg',
    badge: '💡 Learn by Building',
    title: 'AI &',
    highlight: 'Modern Technologies',
    description:
      'Explore AI, cloud computing, system design and scalable architectures.',
  },
  {
    image: '/course_page_banner.avif',
    badge: '🎯 Career Focused',
    title: 'Land Your',
    highlight: 'Dream Job',
    description:
      'Interview preparation, resume building and placement assistance included.',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState<number>(0);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = (): void => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (): void => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '' });
      
      setTimeout(() => {
        setIsPopupOpen(false);
        setSubmitStatus('');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative h-[500px] sm:h-[450px] md:h-[400px] overflow-hidden bg-white">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              current === index
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0'
            }`}
          >
            {/* Background */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-20 flex h-full items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-white">
                <div className="mb-4 sm:mb-6 inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium">
                  {slide.badge}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  {slide.title}
                  <span className="block bg-gradient-to-r from-[#016ab7] to-[#6cb84d] bg-clip-text text-transparent">
                    {slide.highlight}
                  </span>
                </h1>

                <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-lg md:text-xl text-gray-200">
                  {slide.description}
                </p>

                <div className="mt-6 sm:mt-10">
                  <button
                    onClick={() => setIsPopupOpen(true)}
                    className="inline-flex items-center justify-center rounded-lg bg-[#016ab7] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:bg-[#0158a0] hover:scale-105 hover:shadow-[#016ab7]/25"
                  >
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-1.5 sm:p-2 text-white backdrop-blur-md transition hover:bg-[#016ab7] hover:text-white"
        >
          <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-1.5 sm:p-2 text-white backdrop-blur-md transition hover:bg-[#016ab7] hover:text-white"
        >
          <ChevronRight size={16} className="sm:w-5 sm:h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 sm:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                current === index
                  ? 'w-4 sm:w-8 bg-[#016ab7]'
                  : 'w-1.5 sm:w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsPopupOpen(false);
                setSubmitStatus('');
                setFormData({ name: '', email: '', phone: '' });
              }}
              className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {/* Form Content */}
            <div className="p-6 sm:p-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Get Started Today!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Fill in your details and we'll get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016ab7] focus:border-transparent outline-none transition text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016ab7] focus:border-transparent outline-none transition text-sm"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016ab7] focus:border-transparent outline-none transition text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    Something went wrong. Please try again.
                  </div>
                )}

                {submitStatus === 'success' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    ✅ Success! We'll be in touch soon.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#016ab7] text-white font-semibold rounded-lg transition-all hover:bg-[#0158a0] hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-gray-500">
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}