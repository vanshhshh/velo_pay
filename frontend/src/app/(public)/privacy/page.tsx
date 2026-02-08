import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Velo
            </Link>
            <Link href="/login" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="container-custom max-w-4xl py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-12">
          Last updated: January 30, 2026
        </p>

        <div className="prose prose-lg max-w-none">
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600">
              Velo ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our money transfer service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Personal Information
            </h3>

            <p className="text-gray-600 mb-4">
              We collect the following personal information:
            </p>

            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Name and contact information</li>
              <li>Government-issued identification</li>
              <li>Date of birth</li>
              <li>Bank account details</li>
              <li>Transaction history</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">
              Automatically Collected Information
            </h3>

            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type</li>
              <li>Usage analytics</li>
              <li>Cookies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Process transactions</li>
              <li>KYC & compliance</li>
              <li>Fraud prevention</li>
              <li>Legal compliance</li>
              <li>Service improvements</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              4. Information Sharing
            </h2>
            <p className="text-gray-600">
              We never sell your personal information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-600">
              We use encryption, MFA, audits, and secure infrastructure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-600">
              You may access, correct, or delete your data.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              7. Data Retention
            </h2>
            <p className="text-gray-600">
              Transaction data is retained for regulatory compliance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              8. Cookies
            </h2>
            <p className="text-gray-600">
              Cookies help improve performance and security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              9. International Transfers
            </h2>
            <p className="text-gray-600">
              We use appropriate safeguards for cross-border data transfers.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              10. Children's Privacy
            </h2>
            <p className="text-gray-600">
              Our service is not intended for users under 18.
            </p>
          </section>

          {/* ✅ THIS SECTION WAS BROKEN BEFORE */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-gray-600">
              We may update this policy periodically. Continued use of Velo
              constitutes acceptance of the updated policy.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
