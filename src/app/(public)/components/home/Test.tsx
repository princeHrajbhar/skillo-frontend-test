"use client";

type Company = {
  name: string;
  image: string;
};

const row1: Company[] = [
  {
    name: "Cartoon Mango",
    image: "https://www.guvi.in/assets/C7IirAO9-cartoon-mango.webp",
  },
  {
    name: "Larsen & Toubro",
    image: "https://www.guvi.in/assets/daYTQfl9-larsen.webp",
  },
  {
    name: "Lenovo",
    image: "https://www.guvi.in/assets/BCqZ5u0O-lenovo.webp",
  },
  {
    name: "Justdial",
    image: "https://www.guvi.in/assets/cZULMhV6-just-dial.webp",
  },
  {
    name: "Thoughtworks",
    image: "https://www.guvi.in/assets/C7gjAANj-thoughtworks.webp",
  },
  {
    name: "Amazon",
    image: "https://www.guvi.in/assets/BeM-RDUa-amazon.webp",
  },
  {
    name: "Siemens",
    image: "https://www.guvi.in/assets/fQGtF5GR-siemens.webp",
  },
  {
    name: "Aspire",
    image: "https://www.guvi.in/assets/Cjsm_-LY-aspire.webp",
  },
  {
    name: "Ideas2IT",
    image: "https://www.guvi.in/assets/BT5qwU2l-ideas.webp",
  },
];

const row2: Company[] = [
  {
    name: "Zoho",
    image: "https://www.guvi.in/assets/Df40G6-P-zoho.webp",
  },
  {
    name: "Virtusa",
    image: "https://www.guvi.in/assets/D9Q13NB9-virtusa.webp",
  },
  {
    name: "Infosys",
    image: "https://www.guvi.in/assets/FJ_EISf5-infosys.webp",
  },
  {
    name: "TCS",
    image: "https://www.guvi.in/assets/CtP46enr-tcs.webp",
  },
  {
    name: "Wipro",
    image: "https://www.guvi.in/assets/CB3JFYs_-wipro.webp",
  },
  {
    name: "Accenture",
    image: "https://www.guvi.in/assets/CkpaIRuZ-accenture.webp",
  },
  {
    name: "CaratLane",
    image: "https://www.guvi.in/assets/Dr0tIfCe-caratlane.webp",
  },
  {
    name: "Comcast",
    image: "https://www.guvi.in/assets/CTuGUd6k-comcast.webp",
  },
  {
    name: "Klenty",
    image: "https://www.guvi.in/assets/D18imoH7-klenty.webp",
  },
];

const row3: Company[] = [
  {
    name: "Tech Mahindra",
    image: "https://www.guvi.in/assets/ULW7USSC-tech-mahindra.webp",
  },
  {
    name: "Grappus",
    image: "https://www.guvi.in/assets/ByDjBcTe-grappus.webp",
  },
  {
    name: "Cognizant",
    image: "https://www.guvi.in/assets/W20CtA9i-cognizant.webp",
  },
  {
    name: "PayPal",
    image: "https://www.guvi.in/assets/B8GyixhV-paypal.webp",
  },
  {
    name: "Capgemini",
    image: "https://www.guvi.in/assets/C4UufyUF-capgemini.webp",
  },
  {
    name: "HCL",
    image: "https://www.guvi.in/assets/XLoZqhgX-hcl.webp",
  },
  {
    name: "IBM",
    image: "https://www.guvi.in/assets/cH9Hp9oG-ibm.webp",
  },
  {
    name: "JLL",
    image: "https://www.guvi.in/assets/E1isD1M--jll.webp",
  },
  {
    name: "Fiserv",
    image: "https://www.guvi.in/assets/BDotq-vn-fiserv.webp",
  },
];

function LogoCard({ company }: { company: Company }) {
  return (
    <div className="group flex h-[74px] w-[220px] flex-shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-10 w-40">
        <img
          src={company.image}
          alt={company.name}
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}

function MarqueeRow({
  companies,
  reverse = false,
}: {
  companies: Company[];
  reverse?: boolean;
}) {
  const duplicated = [
    ...companies,
    ...companies,
    ...companies,
    ...companies,
  ];

  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-4 ${
          reverse ? "marquee-right" : "marquee-left"
        }`}
      >
        {duplicated.map((company, index) => (
          <LogoCard
            key={`${company.name}-${index}`}
            company={company}
          />
        ))}
      </div>
    </div>
  );
}

export default function StudentsWorkSection() {
  return (
    <section className="w-full overflow-hidden bg-[#f5f5f7] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center md:mb-16">
  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
    Career Outcomes
  </p>

  <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
    Join Great Learning Graduates
    <br />
    At Top-Tier Companies
  </h2>

  <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-600 md:text-lg">
    Our learners secure opportunities at leading global organizations through
    industry-aligned programs, mentorship, real-world projects, and career
    support.
  </p>
</div>

        <div className="space-y-4">
          {/* Top Row → LEFT */}
          <MarqueeRow companies={row1} />

          {/* Middle Row → RIGHT */}
          <MarqueeRow
            companies={row2}
            reverse
          />

          {/* Bottom Row → LEFT */}
          <MarqueeRow companies={row3} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }

          100% {
            transform: translateX(0);
          }
        }

        .marquee-left {
          animation: marquee-left 40s linear infinite;
          will-change: transform;
        }

        .marquee-right {
          animation: marquee-right 40s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}