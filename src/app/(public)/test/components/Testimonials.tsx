'use client';

import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Software Engineer',
      company: 'Google',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      text: 'This course completely transformed my career. I went from knowing nothing about AI to building production-ready applications in just 6 weeks! The hands-on projects and expert mentorship made all the difference.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Product Manager',
      company: 'Microsoft',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      text: 'The hands-on approach and expert mentorship made all the difference. I now lead AI initiatives at my company and have successfully implemented multiple AI solutions.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Amit Kumar',
      role: 'Freelancer',
      company: 'AI Consultant',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      text: 'Best investment in my career. The projects are challenging but rewarding, and the community support is amazing. I have already landed 3 AI projects as a freelancer!',
      rating: 5,
    },
    {
      id: 4,
      name: 'Neha Singh',
      role: 'Data Scientist',
      company: 'Amazon',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      text: 'The curriculum is well-structured and up-to-date with industry trends. The mentors are incredibly supportive and always available to help. Highly recommended!',
      rating: 5,
    },
    {
      id: 5,
      name: 'Vikram Mehta',
      role: 'Tech Lead',
      company: 'Infosys',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      text: 'This program gave me the confidence to lead AI projects at my organization. The real-world projects and portfolio building were game-changers for my career.',
      rating: 5,
    },
    {
      id: 6,
      name: 'Anjali Desai',
      role: 'AI Engineer',
      company: 'Startup Founder',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      text: 'From zero to hero in AI! The progressive learning approach made complex concepts easy to understand. I am now building my own AI startup.',
      rating: 5,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-emerald-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            <FaQuoteLeft className="w-3 h-3" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join 15,000+ successful students who have transformed their careers with our program
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-emerald-600">15k+</p>
            <p className="text-sm text-gray-500">Students Enrolled</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-emerald-600">4.9</p>
            <p className="text-sm text-gray-500">Average Rating</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-emerald-600">98%</p>
            <p className="text-sm text-gray-500">Completion Rate</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-emerald-600">85%</p>
            <p className="text-sm text-gray-500">Got Promotion/Job</p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-emerald-200 group"
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                ))}
              </div>
              
              {/* Quote Icon */}
              <FaQuoteLeft className="text-emerald-200 w-8 h-8 mb-4 group-hover:text-emerald-300 transition-colors" />
              
              {/* Testimonial Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              
              {/* User Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-xs text-emerald-600 font-semibold">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonials Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Watch Student Success Stories</h3>
          <p className="text-gray-600 mb-6">Hear directly from our students about their journey</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="w-full h-32 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-emerald-600 border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
              <p className="font-semibold text-gray-800">Rahul's Success Story</p>
              <p className="text-sm text-gray-500">From Beginner to AI Engineer</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="w-full h-32 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-emerald-600 border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
              <p className="font-semibold text-gray-800">Priya's Journey</p>
              <p className="text-sm text-gray-500">From Product Manager to AI Lead</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="w-full h-32 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-emerald-600 border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
              <p className="font-semibold text-gray-800">Amit's Transformation</p>
              <p className="text-sm text-gray-500">Freelancer to AI Consultant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;