import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

const INFO_ITEMS = [
  {
    icon: Mail,
    title: "Email Us",
    lines: ["hello@shikshanation.com"],
    href: "mailto:hello@shikshanation.com",
    linkText: "Send an email",
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["Mon – Sat · 10 AM to 7 PM"],
    href: "tel:+919821115117",
    linkText: "+91 98211 15117",
  },
  {
    icon: MapPin,
    title: "Visit Our Office",
    lines: [
      "10th Floor, Tower C,",
      "Bhutani Cyber Park, Sec 62,",
      "Noida, Uttar Pradesh 201309",
    ],
    href: "https://maps.app.goo.gl/ycmu1L45xBobaJXE8",
    linkText: "View on Google Maps →",
  },
  {
    icon: Clock,
    title: "Business Hours",
    lines: [
      "Monday – Saturday",
      "10:00 AM – 07:00 PM IST",
      "Sunday: Closed",
    ],
    href: null,
    linkText: null,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    lines: ["Quick replies on WhatsApp"],
    href: "https://wa.me/919821115117",
    linkText: "Chat on WhatsApp →",
  },
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Contact Information</h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Reach us through any channel below — we typically respond within a few hours.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {INFO_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-md transition-shadow duration-200"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#07163b" }}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* Text */}
              <div>
                <p className="text-sm font-bold text-slate-800 mb-0.5">{item.title}</p>
                {item.lines.map((line, i) => (
                  <p key={i} className="text-xs text-slate-500 leading-relaxed">{line}</p>
                ))}
                {item.href && item.linkText && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#016AB7] hover:underline mt-1 inline-block"
                  >
                    {item.linkText}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
