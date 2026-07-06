// admin-dashboard\src\app\(publicPages)\page.tsx

import HeroSlider from "@/app/(public)/components/home/HeroSlider";
import Course from "@/app/(public)/components/home/Course";

import Metrics from "@/app/(public)/components/home/Metrics";

import HiringPartnersSection from "@/app/(public)/components/home/CompanyCard";

import Testimonial from "@/app/(public)/components/home/Testimonial";
import FreeResourcesBanner from "@/app/(public)/components/home/CTASection";

import ComparisonSection from "@/app/(public)/components/home/ComparisonSection";
import FAQSection from "@/app/(public)/components/home/FAQItem";

import AccreditationSection from "@/app/(public)/components/home/AccreditationSection";
import MicroCoursesSEOContent from "@/app/(public)/components/home/SEOContent";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSlider />
      <AccreditationSection />
      <Metrics />

      <Course />

      <HiringPartnersSection />

      <FreeResourcesBanner />

      <Testimonial />

      <ComparisonSection />
      <FreeResourcesBanner />

      <FAQSection />
      <MicroCoursesSEOContent />
    </main>
  );
}
