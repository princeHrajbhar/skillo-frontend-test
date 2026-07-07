"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaDiscord,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  Company: [
    { name: "About Us", href: "/about-us" },
    { name: "Blog", href: "/blog" },
    { name: "Media", href: "/media" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contact-us" },
  ],
  "Top Categories": [
    { name: "Achievo", href: "/achievo" },
    { name: "Skillo", href: "/" },
  ],
  "Useful Links": [
    { name: "FAQs", href: "/faqs" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-conditions" },
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

const appLinks = [
  { icon: FaGooglePlay, label: "Get it on Google Play", href: "#" },
  { icon: FaApple, label: "Download on the App Store", href: "#" },
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
    <footer className="bg-[#f8fafc] border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Logo */}
        <div className="mb-8">
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
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                <span className="font-bold text-slate-800">Helpline:</span>
                <br />
                <a
                  href="tel:+919910899060"
                  className="hover:underline hover:text-[#016ab7]"
                >
                  +91 99108 99060
                </a>
              </p>
              <p>
                <span className="font-bold text-slate-800">Support:</span>
                <br />
                <a
                  href="mailto:support@shikshanation.com"
                  className="hover:underline hover:text-[#016ab7]"
                >
                  support@shikshanation.com
                </a>
              </p>
              <p>
                <span className="font-bold text-slate-800">Headquarters:</span>
                <br />
                C-56 A/12, II Floor Technopolis IT Hub,
                <br />
                Opposite Stellar IT Park, C Block, Phase 2,
                <br />
                Industrial Area, Sector 62, Noida,
                <br />
                Uttar Pradesh 201309
              </p>
            </div>
          </div>

          {/* Dynamic Link Groups */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="col-span-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-slate-600 hover:text-[#016ab7] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Download Apps Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Download App
            </h4>
            <div className="space-y-2">
              {appLinks.map((app, index) => {
                const Icon = app.icon;
                return (
                  <a
                    key={index}
                    href={app.href}
                    className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-lg hover:border-[#016ab7] hover:shadow-md transition-all text-sm text-slate-700 hover:text-[#016ab7]"
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{app.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Social Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-sm">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} Skillo. All rights reserved.
          </p>
          {/* Social Profiles */}
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
                  className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-[#016ab7] hover:text-[#016ab7] hover:bg-[#016ab7]/10"
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