import React from "react";

const PrivacyPolicyContent: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-none">
        <p className="mb-8 text-gray-700">
          At Skillo, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website, mobile app, and services.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#016AB7]">
            1. Information We Collect
          </h2>
          <p className="mb-4 text-gray-700">
            When you use our platform, we may collect the following types of information:
          </p>
          <p className="mb-2 text-gray-700"><strong>Personal Information:</strong> Name, email address, phone number, age, and account details when you register.</p>
          <p className="mb-2 text-gray-700"><strong>Payment Information:</strong> Billing details when you purchase courses (processed securely via third-party payment gateways).</p>
          <p className="mb-2 text-gray-700"><strong>Usage Data:</strong> Information about how you use our website/app, including pages visited, time spent, and activities.</p>
          <p className="mb-2 text-gray-700"><strong>Device Information:</strong> IP address, browser type, device details, and cookies for security and analytics.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#016AB7]">
            2. How We Use Your Information
          </h2>
          <p className="mb-4 text-gray-700">We use the information collected to:</p>
          <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
            <li>Provide access to courses, classes, and resources.</li>
            <li>Personalize your learning experience.</li>
            <li>Process payments and send invoices/receipts.</li>
            <li>Communicate updates, reminders, and offers.</li>
            <li>Improve our platform, features, and services.</li>
            <li>Ensure security, prevent fraud, and comply with legal requirements.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#016AB7]">
            3. Sharing of Information
          </h2>
          <p className="mb-4 text-gray-700">
            We respect your privacy and do not sell or rent your data. Information may be shared only with:
          </p>
          <p className="mb-2 text-gray-700"><strong>Service Providers:</strong> Payment gateways, hosting providers, and technical support partners.</p>
          <p className="mb-2 text-gray-700"><strong>Legal Authorities:</strong> When required by law or to protect our rights.</p>
          <p className="mb-2 text-gray-700"><strong>Affiliates/Partners:</strong> Only if you opt in for promotional or collaborative content.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#016AB7]">
            4. Cookies &amp; Tracking
          </h2>
          <p className="mb-4 text-gray-700">Our platform uses cookies and similar technologies to:</p>
          <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
            <li>Keep you logged in.</li>
            <li>Save preferences.</li>
            <li>Analyze site traffic and usage for better performance.</li>
          </ul>
          <p className="text-gray-700">You can manage or disable cookies in your browser settings.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#016AB7]">
            5. Data Security
          </h2>
          <p className="mb-2 text-gray-700">
            We use industry-standard security measures to protect your personal information. While we strive for complete security, no system is 100% secure.
          </p>
          <p className="text-gray-700">We recommend safeguarding your login credentials.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#016AB7]">
            6. Children&apos;s Privacy
          </h2>
          <p className="text-gray-700">
            Our platform is designed for students, but if you are under 18 years, you must use the platform under the guidance of a parent or guardian.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#016AB7]">
            7. Your Rights
          </h2>
          <p className="mb-4 text-gray-700">You have the right to:</p>
          <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
            <li>Access and update your personal data.</li>
            <li>Request deletion of your account and data.</li>
            <li>Opt out of promotional emails and messages.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#016AB7]">
            8. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy occasionally. Updates will be posted on this page with a revised &quot;Last Updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#016AB7]">
            9. Contact Us
          </h2>
          <p className="mb-4 text-gray-700">
            For any questions or concerns regarding this Privacy Policy, please contact us:
          </p>
          <p className="mb-2 text-[#016AB7]">
            <strong className="text-[#016AB7]">Corporate Office:</strong>{" "}
            C-56 A/12, II Floor Technopolis IT Hub, Opposite Stellar IT Park,
            C Block, Phase 2, Industrial Area, Sector 62, Noida, Uttar Pradesh 201309
          </p>
          <p className="mb-2 text-[#016AB7]">
            <strong className="text-[#016AB7]">Call:</strong> +91 99108 99060
          </p>
          <p className="mb-2 text-[#016AB7]">
            <strong className="text-[#016AB7]">Email:</strong> support@skillo.live
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
