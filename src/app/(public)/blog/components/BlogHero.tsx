'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    badge: '📝 Latest Articles',
    title: 'Master the Art of',
    highlight: 'Technical Writing',
    description:
      'Learn how to write clear, engaging, and impactful technical content that resonates with developers.',
  },
  {
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    badge: '📚 Trending Topics',
    title: 'Stay Ahead with',
    highlight: 'Modern Tech Trends',
    description:
      'Discover the latest developments in AI, Web3, cloud computing, and software architecture.',
  },
  {
    image: 'https://images.unsplash.com/photo-1455390582262-044c277dead?w=800',
    badge: '💡 In-Depth Guides',
    title: 'Build Your',
    highlight: 'Developer Knowledge Base',
    description:
      'Access comprehensive tutorials, case studies, and expert insights to level up your skills.',
  },
  {
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
    badge: '🎯 Career Growth',
    title: 'Accelerate Your',
    highlight: 'Developer Career',
    description:
      'Get actionable advice, interview tips, and career strategies from industry professionals.',
  },
];

export default function BlogHeroSection() {
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call - Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '' });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative h-[400px] overflow-hidden bg-white">
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
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-20 flex h-full items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-white">
                <div className="mb-6 inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
                  {slide.badge}
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {slide.title}
                  <span className="block bg-gradient-to-r from-[#016ab7] to-[#6cb84d] bg-clip-text text-transparent">
                    {slide.highlight}
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-lg text-gray-200 sm:text-xl">
                  {slide.description}
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  {/* Subscribe Now Button - Opens Modal */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#016ab7] to-[#6cb84d] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-[#016ab7]/25"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-gradient-to-r hover:from-[#016ab7] hover:to-[#6cb84d] hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-gradient-to-r hover:from-[#016ab7] hover:to-[#6cb84d] hover:text-white"
        >
          <ChevronRight size={20} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                current === index
                  ? 'w-8 bg-gradient-to-r from-[#016ab7] to-[#6cb84d]'
                  : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Subscribe Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#016ab7] to-[#6cb84d] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Subscribe to Our Blog</h3>
              <p className="text-gray-600 text-sm mt-2">
                Get the latest articles and updates delivered to your inbox
              </p>
            </div>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Subscription Successful!</h4>
                <p className="text-gray-600 text-sm mt-2">Thank you for subscribing to our blog.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016ab7] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                    Something went wrong. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#016ab7] to-[#6cb84d] text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-[#016ab7]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By subscribing, you agree to receive email updates. You can unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}