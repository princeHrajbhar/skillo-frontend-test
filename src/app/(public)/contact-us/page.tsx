"use client";

import { memo, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  MessageCircle,
} from "lucide-react";
import ContactForm from "@/app/(public)/components/footer/contact/ContactForm";

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us your queries anytime",
    link: "mailto:support@shikshanation.com",
    linkText: "support@shikshanation.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon–Sat from 10 AM to 7 PM",
    link: "tel:+919910899060",
    linkText: "+91 99108 99060",
  },
  {
    icon: MapPin,
    title: "Visit Our Office",
    description:
      "II Floor, Technopolis IT Hub, C-56 A/12, opposite Stellar IT Park, C Block, Phase 2, Industrial Area, Sector 62, Noida, Uttar Pradesh 201309",
    link: "https://maps.app.goo.gl/ycmu1L45xBobaJXE8",
    linkText: "View on Map →",
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "We're available during",
    link: "#",
    linkText: "10 AM – 07 PM IST",
  },
] as const;

function ContactUs() {
  return (
    <div className="w-full">
      {/* ══════════════════════════════
          HERO — gradient, no form
      ══════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#016ab7] via-[#0158a0] to-[#013b6b] py-16 md:py-24 px-4">
        {/* blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 -left-4 w-72 h-72 md:w-96 md:h-96 bg-[#016ab7]/20 rounded-full mix-blend-screen blur-3xl animate-blob" />
          <div className="absolute bottom-0 -right-4 w-72 h-72 md:w-96 md:h-96 bg-[#0158a0]/15 rounded-full mix-blend-screen blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* eyebrow pill */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4 text-[#6cb84d]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            <span className="text-sm font-medium text-white">Get In Touch</span>
          </div>

          {/* heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            We&apos;d Love to{" "}
            <span className="bg-gradient-to-r from-[#6cb84d] via-white to-[#6cb84d] text-transparent bg-clip-text">
              Hear From You
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Have a question, feedback, or just want to say hello? Our team is
            ready to help — reach out through any channel and we&apos;ll get
            back to you within 24 hours.
          </p>

         
        </div>
      </section>

      {/* ══════════════════════════════
          CONTACT CARDS
      ══════════════════════════════ */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {CONTACT_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white border border-slate-100 rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: "#07163b" }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold mb-1 text-slate-800">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-xs mb-2 leading-relaxed">
                    {card.description}
                  </p>
                  <a
                    href={card.link}
                    target={card.link.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#016AB7] hover:underline break-all"
                  >
                    {card.linkText}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FORM  +  MAP (side by side)
      ══════════════════════════════ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* LEFT — form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-1 text-slate-800">
                Send us a Message
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Fill in the form and we'll get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>

            {/* RIGHT — map */}
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                  Visit Our Office
                </h2>
                
              </div>

              {/* Map — cropped to show office area */}
              <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29625.919761532507!2d77.33100807910157!3d28.612620200000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5d94db5eeb5%3A0x556e8af08c8b0dc6!2sShiksha%20Nation!5e1!3m2!1sen!2sin!4v1763364181508!5m2!1sen!2sin"
                  width="100%"
                  height="415"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shiksha Nation Office Location"
                />
              </div>

              {/* Directions button */}
              <a
                href="https://maps.app.goo.gl/ycmu1L45xBobaJXE8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: "#016AB7" }}
              >
                <MapPin className="w-4 h-4" />
                Get Directions on Google Maps
              </a>

              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default memo(ContactUs);
