export default function IndustryPartners() {
  const partners = [

    {
      name: "Google",
      logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    },
        {
      name: "IBM",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-KFa0Xg2y04Ib0ow_6Qp3nBaGXjFu_nxkgg&s",
    },
    {
      name: "AWS",
      logo: "https://miro.medium.com/v2/resize:fit:1400/1*neG4D9C8UcJvNn6bverfIA.png",
    },
    {
      name: "HCL",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1280px-Microsoft_logo_%282012%29.svg.png",
    },
  ];

  return (
    <section className="border-t border-gray-100 bg-white py-8">
      <div className="container mx-auto px-6">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
          Courses Powered & Certified By Industry Leaders
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 lg:justify-between">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-1 min-w-[140px] items-center justify-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-14 w-auto object-contain grayscale opacity-80 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}