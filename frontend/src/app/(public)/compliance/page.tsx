import Link from 'next/link'
import { FileText, CheckCircle, Scale, Globe } from 'lucide-react'

export default function CompliancePage() {
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

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="container-custom text-center">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Regulatory Compliance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Velo is fully licensed and regulated. We comply with all applicable laws and regulations to protect you and your money.
          </p>
        </div>
      </section>

      {/* Licensing */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Licenses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <Globe className="text-primary-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Money Transmitter License</h3>
              <p className="text-gray-600">
                Licensed as a money transmitter in all 50 US states and regulated by state banking departments.
              </p>
            </div>
            <div className="card">
              <FileText className="text-primary-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">FCA Authorized</h3>
              <p className="text-gray-600">
                Authorized by the UK Financial Conduct Authority (FCA) to provide payment services.
              </p>
            </div>
            <div className="card">
              <CheckCircle className="text-primary-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">EU Passporting Rights</h3>
              <p className="text-gray-600">
                Licensed to operate across the European Economic Area under EU payment regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AML/KYC */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Anti-Money Laundering (AML) & Know Your Customer (KYC)</h2>
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Identity Verification</h3>
                <p className="text-gray-600">
                  We verify the identity of all users to prevent fraud and comply with regulations. This includes verifying your government-issued ID and address.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Transaction Monitoring</h3>
                <p className="text-gray-600">
                  All transactions are monitored for suspicious activity. We maintain robust systems to detect and prevent money laundering and terrorist financing.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Suspicious Activity Reporting</h3>
                <p className="text-gray-600">
                  We are required to report suspicious activity to relevant authorities, including FinCEN in the United States and the National Crime Agency in the UK.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Record Keeping</h3>
                <p className="text-gray-600">
                  We maintain detailed records of all transactions and customer information for the periods required by law.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Data Protection Compliance</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-3">GDPR Compliance</h3>
              <p className="text-gray-600 mb-4">
                We comply with the EU General Data Protection Regulation (GDPR), giving you control over your personal data.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  Right to access your data
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  Right to data portability
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  Right to be forgotten
                </li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-3">CCPA Compliance</h3>
              <p className="text-gray-600 mb-4">
                We comply with the California Consumer Privacy Act (CCPA) for California residents.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  Right to know what data we collect
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  Right to delete your data
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  Right to opt-out of data sales
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Questions About Compliance?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our compliance team is here to help answer any questions you may have.
          </p>
          <a href="mailto:[email protected]" className="btn-primary inline-block">
            Contact Compliance Team
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container-custom text-center">
          <p>© 2026 Velo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}