"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Institute logos - exactly 4 images
const instituteLogos = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRo28xmQVEUi4zws-PHzsnjOvoyed2cRqS-A&s",
  "https://upload.wikimedia.org/wikipedia/en/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Indian_Institute_of_Technology_Roorkee_Logo.svg/1280px-Indian_Institute_of_Technology_Roorkee_Logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/en/6/69/IIT_Madras_Logo.svg",
];

// Company logos - using your working images
const companyLogos = [
  "https://www.guvi.in/assets/C7IirAO9-cartoon-mango.webp",
  "https://www.guvi.in/assets/daYTQfl9-larsen.webp",
  "https://www.guvi.in/assets/BCqZ5u0O-lenovo.webp",
  "https://www.guvi.in/assets/cZULMhV6-just-dial.webp",
  "https://www.guvi.in/assets/C7gjAANj-thoughtworks.webp",
  "https://www.guvi.in/assets/BeM-RDUa-amazon.webp",
  "https://www.guvi.in/assets/fQGtF5GR-siemens.webp",
  "https://www.guvi.in/assets/Cjsm_-LY-aspire.webp",
  "https://www.guvi.in/assets/BT5qwU2l-ideas.webp",
  "https://www.guvi.in/assets/Df40G6-P-zoho.webp",
  "https://www.guvi.in/assets/D9Q13NB9-virtusa.webp",
  "https://www.guvi.in/assets/FJ_EISf5-infosys.webp",
  "https://www.guvi.in/assets/CtP46enr-tcs.webp",
  "https://www.guvi.in/assets/CB3JFYs_-wipro.webp",
  "https://www.guvi.in/assets/CkpaIRuZ-accenture.webp",
  "https://www.guvi.in/assets/Dr0tIfCe-caratlane.webp",
  "https://www.guvi.in/assets/CTuGUd6k-comcast.webp",
  "https://www.guvi.in/assets/D18imoH7-klenty.webp",
  "https://www.guvi.in/assets/ULW7USSC-tech-mahindra.webp",
  "https://www.guvi.in/assets/ByDjBcTe-grappus.webp",
  "https://www.guvi.in/assets/W20CtA9i-cognizant.webp",
  "https://www.guvi.in/assets/B8GyixhV-paypal.webp",
  "https://www.guvi.in/assets/C4UufyUF-capgemini.webp",
  "https://www.guvi.in/assets/XLoZqhgX-hcl.webp",
  "https://www.guvi.in/assets/cH9Hp9oG-ibm.webp",
  "https://www.guvi.in/assets/E1isD1M--jll.webp",
  "https://www.guvi.in/assets/BDotq-vn-fiserv.webp"
];

// Create circular infinite array (triple the size for smooth seamless loop)
const circularLogos = [...companyLogos, ...companyLogos, ...companyLogos];

export default function TrustedBySection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Trusted by industry experts and{" "}
            <span className="text-brand-gradient">
              students from India's top institutes
            </span>
          </h2>
        </div>

        {/* ========== INSTITUTE SECTION - All 4 inline with no gaps ========== */}
        <div className="mb-8">
          <div className="flex justify-center items-center">
            {instituteLogos.map((logo, index) => (
              <div
                key={index}
                className="relative w-28 h-16 md:w-36 md:h-20 transition-all duration-300 hover:scale-105 mx-2 md:mx-4"
              >
                <Image
                  src={logo}
                  alt={`Institute Logo ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 112px, 144px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ========== COMPANY SECTION - INFINITE CIRCULAR SCROLL ========== */}
        <div>
          <style jsx>{`
            .marquee-container {
              position: relative;
              overflow: hidden;
              width: 100%;
            }
            
            .marquee {
              display: flex;
              animation: scrollLeft 50s linear infinite;
              width: fit-content;
            }
            
            .marquee-reverse {
              display: flex;
              animation: scrollRight 50s linear infinite;
              width: fit-content;
            }
            
            @keyframes scrollLeft {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.33%);
              }
            }
            
            @keyframes scrollRight {
              0% {
                transform: translateX(-33.33%);
              }
              100% {
                transform: translateX(0);
              }
            }
            
            .marquee:hover,
            .marquee-reverse:hover {
              animation-play-state: paused;
            }
            
            /* Hide content until mounted to prevent vertical list */
            .marquee-content {
              visibility: ${isMounted ? 'visible' : 'hidden'};
            }
          `}</style>

          {/* Row 1 - Moves LEFT (Circular infinite) */}
          <div className="marquee-container py-4">
            <div className={`marquee ${!isMounted ? 'marquee-content' : ''}`}>
              {circularLogos.map((logo, idx) => (
                <div
                  key={`r1-${idx}`}
                  className="relative w-32 h-14 md:w-40 md:h-16 flex-shrink-0 mx-3 md:mx-4"
                >
                  <Image
                    src={logo}
                    alt={`Company logo ${idx + 1}`}
                    fill
                    className="object-contain opacity-70 hover:opacity-100"
                    sizes="(max-width: 768px) 128px, 160px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Moves RIGHT (Circular infinite) */}
          <div className="marquee-container py-4">
            <div className={`marquee-reverse ${!isMounted ? 'marquee-content' : ''}`}>
              {circularLogos.map((logo, idx) => (
                <div
                  key={`r2-${idx}`}
                  className="relative w-32 h-14 md:w-40 md:h-16 flex-shrink-0 mx-3 md:mx-4"
                >
                  <Image
                    src={logo}
                    alt={`Company logo ${idx + 1}`}
                    fill
                    className="object-contain opacity-70 hover:opacity-100"
                    sizes="(max-width: 768px) 128px, 160px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}