import Link from 'next/link'
import { Users, Globe, Award, TrendingUp } from 'lucide-react'

export default function AboutPage() {
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
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Velo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to make international money transfers fast, affordable, and accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                Traditional banks charge excessive fees and take days to transfer money internationally. We believe this is fundamentally wrong.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Velo was founded to democratize access to fast, affordable international payments. We leverage cutting-edge technology to provide instant transfers at a fraction of traditional costs.
              </p>
              <p className="text-lg text-gray-600">
                Today, we serve millions of users across 60+ countries, processing billions in transfers annually.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary-600" size={32} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">5M+</div>
                <div className="text-gray-600">Users Worldwide</div>
              </div>
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-primary-600" size={32} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">60+</div>
                <div className="text-gray-600">Countries</div>
              </div>
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-primary-600" size={32} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
                <div className="text-gray-600">User Rating</div>
              </div>
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-primary-600" size={32} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">$10B+</div>
                <div className="text-gray-600">Transferred</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600">
                No hidden fees, no surprises. You always know exactly what you're paying and when your money will arrive.
              </p>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Security</h3>
              <p className="text-gray-600">
                Your money and data are protected with bank-level security. We're fully licensed and regulated.
              </p>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We constantly invest in technology to make transfers faster, cheaper, and more convenient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">Leadership Team</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Our team brings decades of experience from leading fintech and technology companies
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'CEO & Co-Founder', bg: 'bg-blue-100' },
              { name: 'Michael Chen', role: 'CTO & Co-Founder', bg: 'bg-purple-100' },
              { name: 'Emily Rodriguez', role: 'Chief Product Officer', bg: 'bg-green-100' },
              { name: 'David Kim', role: 'Chief Compliance Officer', bg: 'bg-yellow-100' },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className={`w-32 h-32 ${member.bg} rounded-full mx-auto mb-4`}></div>
                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Join Us</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Be part of the financial revolution. Start sending money globally today.
          </p>
          <Link href="/login" className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-lg hover:bg-primary-50 transition">
            Get Started
          </Link>
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