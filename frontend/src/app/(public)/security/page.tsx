import Link from 'next/link'
import { Shield, Lock, Eye, FileCheck, Server, AlertTriangle } from 'lucide-react'

export default function SecurityPage() {
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
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container-custom text-center">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Security & Trust
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your security is our top priority. We use enterprise-grade security measures to protect your money and data.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">How We Protect You</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Lock className="text-primary-600" size={32} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">256-Bit Encryption</h3>
                <p className="text-gray-600">
                  All data transmitted through Velo is encrypted using AES-256 encryption, the same standard used by banks and military organizations. Your personal information and transaction data are always protected.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Eye className="text-primary-600" size={32} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Two-Factor Authentication</h3>
                <p className="text-gray-600">
                  Enable 2FA to add an extra layer of security to your account. Even if someone knows your password, they won't be able to access your account without your authentication code.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Server className="text-primary-600" size={32} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Infrastructure</h3>
                <p className="text-gray-600">
                  Our systems are hosted on enterprise-grade infrastructure with 24/7 monitoring, automatic backups, and redundancy. We maintain 99.99% uptime to ensure your transfers go through.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileCheck className="text-primary-600" size={32} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Regular Security Audits</h3>
                <p className="text-gray-600">
                  We conduct regular third-party security audits and penetration testing to identify and fix vulnerabilities before they can be exploited.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-primary-600" size={32} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Fraud Detection</h3>
                <p className="text-gray-600">
                  Our AI-powered fraud detection system monitors all transactions in real-time to identify and prevent suspicious activity before it affects you.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-primary-600" size={32} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Privacy Protection</h3>
                <p className="text-gray-600">
                  We never sell your data to third parties. Your information is used only to provide our services and is protected under strict privacy policies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Certifications & Compliance</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: 'PCI DSS Compliant', desc: 'Payment Card Industry Data Security Standard' },
              { name: 'ISO 27001', desc: 'Information Security Management' },
              { name: 'SOC 2 Type II', desc: 'Security & Availability' },
              { name: 'GDPR Compliant', desc: 'European Data Protection' },
            ].map((cert) => (
              <div key={cert.name} className="card text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Keep Your Account Safe</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-2">Use a strong password</h3>
              <p className="text-gray-600">
                Create a unique password with at least 12 characters, including uppercase, lowercase, numbers, and symbols.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-2">Enable two-factor authentication</h3>
              <p className="text-gray-600">
                Add an extra layer of security to prevent unauthorized access to your account.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-2">Be wary of phishing attempts</h3>
              <p className="text-gray-600">
                We will never ask for your password via email. Always verify the sender before clicking links.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-2">Keep your devices secure</h3>
              <p className="text-gray-600">
                Use up-to-date antivirus software and keep your operating system and apps updated.
              </p>
            </div>
          </div>
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