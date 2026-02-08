import Link from 'next/link'

export default function TermsPage() {
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
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-12">Last updated: January 30, 2026</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using Velo's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
            <p className="text-gray-600 mb-4">To use Velo, you must:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be prohibited from using financial services under applicable laws</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="text-gray-600">
              You must create an account to use our services. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>Provide truthful, accurate, and complete information</li>
              <li>Update your information to keep it current</li>
              <li>Maintain the confidentiality of your password</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Identity Verification</h2>
            <p className="text-gray-600">
              We are required by law to verify your identity. You agree to provide requested documentation including government-issued ID, proof of address, and other information as required for KYC/AML compliance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Services</h2>
            <p className="text-gray-600 mb-4">Velo provides international money transfer services. Our services include:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Sending money to other Velo users</li>
              <li>Transferring money to bank accounts</li>
              <li>Adding money to your Velo account</li>
              <li>Withdrawing money from your Velo account</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Fees</h2>
            <p className="text-gray-600">
              We charge fees for our services as published on our website. Fees are deducted from your account balance at the time of transaction. We reserve the right to change our fees with 30 days' notice.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Transaction Limits</h2>
            <p className="text-gray-600">
              We may impose transaction limits based on your account verification level, transaction history, and regulatory requirements. Limits may be increased upon additional verification.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Prohibited Activities</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Use our services for illegal activities</li>
              <li>Engage in money laundering or terrorist financing</li>
              <li>Provide false or misleading information</li>
              <li>Use our services to purchase illegal goods or services</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to circumvent security measures</li>
              <li>Use automated systems to access our services</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Account Suspension and Termination</h2>
            <p className="text-gray-600">
              We reserve the right to suspend or terminate your account if:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>You violate these Terms of Service</li>
              <li>We suspect fraudulent or illegal activity</li>
              <li>Required by law or regulatory authorities</li>
              <li>You request account closure</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Upon termination, you must withdraw your remaining balance within 30 days.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Liability and Disclaimers</h2>
            <p className="text-gray-600">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, VELO IS NOT LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>Delays or failures in service due to circumstances beyond our control</li>
              <li>Losses resulting from unauthorized account access if you failed to maintain security</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Actions of third-party payment processors or banks</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Our total liability to you shall not exceed the amount of fees you paid to us in the 12 months preceding the claim.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
            <p className="text-gray-600">
              You agree to indemnify and hold harmless Velo from any claims, losses, damages, or expenses arising from your use of our services or violation of these terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">12. Dispute Resolution</h2>
            <p className="text-gray-600">
              Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive your right to participate in class action lawsuits.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-600">
              These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-600">
              We may modify these Terms at any time. We will provide notice of material changes via email or through our platform. Continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-600">
              For questions about these Terms, contact us at:
            </p>
            <ul className="list-none text-gray-600 mt-4">
              <li>Email: <a href="mailto:[email protected]" className="text-primary-600 hover:text-primary-700">[email protected]</a></li>
              <li>Address: 123 Financial District, San Francisco, CA 94105</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container-custom text-center">
          <p>© 2026 Velo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}