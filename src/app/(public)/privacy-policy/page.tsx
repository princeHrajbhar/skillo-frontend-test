import PrivacyPolicyContent from "@/app/(public)/components/company/PrivacyPolicyContent";

export const metadata = {
  title: "Privacy Policy | Skillo",
  description: "Read Skillo's Privacy Policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#016ab7] via-[#0158a0] to-[#013b6b] py-14 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-2">
          Legal
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-white/65 max-w-xl mx-auto">
          Last updated: June 2025 &nbsp;·&nbsp; Effective immediately
        </p>
      </section>

      {/* Content */}
      <PrivacyPolicyContent />

    </main>
  );
}
