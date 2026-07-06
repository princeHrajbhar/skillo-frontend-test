"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaDiscord,
} from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  "Upcoming Courses": [
    { name: "UI/UX Design", href: "/course/ui-ux-design" },
    { name: "Digital Marketing", href: "/course/digital-marketing" },
    { name: "Data Analytics", href: "/course/data-analytics" },
    {
      name: "AI Generalist to Specialist",
      href: "/course/ai-generalist-to-specialist",
    },
    {
      name: "AI+ML Automation Mastery",
      href: "/course/ai-ml-automation-mastery",
    },
    { name: "Product Management", href: "/course/product-management" },
  ],
  "Useful Links": [
    { name: "FAQs", href: "/faqs" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-conditions" },
    {
      name: "Cancellation and Refund Policy",
      href: "/cancellation-and-refund-policy",
    },
    { name: "Shipping and Exchange Policy", href: "/shipping-exchange-policy" },
  ],
  Company: [
    { name: "About Us", href: "/about-us" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Media", href: "/media" },
  ],
};

const socialLinks = [
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/skillo.live",
    label: "Facebook",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/skillo_sn/",
    label: "Instagram",
  },
  { icon: FaDiscord, href: "https://discord.com/invite/#", label: "Discord" },
  {
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/company/skillosn",
    label: "LinkedIn",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 1800);
    }
  };

  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Logo at top left inside footer - Fixed height issue */}
        <div className="mb-6">
          <Link href="/" className="inline-block">
            <Image
              src="/skillo.png"
              alt="Skillo Logo"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Corporate Metadata Column */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <p className="text-sm font-medium italic text-slate-800 leading-snug">
                "For Bharat, Of Bharat, By Bharat."
              </p>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                India's Own Learning Revolution.
              </p>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed space-y-1">
              <p>
                <span className="font-bold text-slate-800">
                  Corporate Office:
                </span>
                <br /> 10th floor, Tower C, Bhutani Cyber Park, Sec 62, Noida,
                Uttar Pradesh 201309
              </p>
              <p className="pt-2">
                <span className="font-bold text-slate-800">Call: </span>
                <a
                  href="tel:+919821115117"
                  className="hover:underline hover:text-brand-start"
                >
                  +91 98211 15117
                </a>
              </p>
              <p>
                <span className="font-bold text-slate-800">Email: </span>
                <a
                  href="mailto:hello@skillo.live"
                  className="hover:underline hover:text-brand-start"
                >
                  hello@skillo.live
                </a>
              </p>
            </div>
          </div>

          {/* Extracted Dynamic Link Groups */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-slate-600 hover:text-brand-start transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Stay Updated
            </h4>
            <p className="text-sm text-slate-600 mb-4">
              Weekly AI insights and learning resources delivered straight to
              you.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-start focus:ring-1 focus:ring-brand-start transition"
                required
              />
              <button
                type="submit"
                className="btn-brand flex items-center justify-center rounded-xl px-4"
              >
                {isSubscribed ? (
                  <span className="text-sm font-bold">Done</span>
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Metadata & Social Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-sm">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Skillo. All rights reserved.
          </p>
          {/* Social Profiles Linked Directly to Your Destinations */}
          <div className="flex gap-3">
            {socialLinks.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-brand-start hover:text-brand-start hover:bg-brand-start-soft"
                >
                  <Icon className="text-xs" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}