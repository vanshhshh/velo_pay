'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  TrendingDown,
  CheckCircle,
  Star,
  Lock,
  Clock,
  Users
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                Velo
              </Link>
              <nav className="hidden md:flex space-x-6">
                <a href="#features" className="text-gray-700 hover:text-primary-600 transition">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 transition">How it Works</a>
                <a href="#security" className="text-gray-700 hover:text-primary-600 transition">Security</a>
                <Link href="/pricing" className="text-gray-700 hover:text-primary-600 transition">Pricing</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                Sign In
              </Link>
              <Link href="/login" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Send Money Globally in <span className="text-primary-600">Seconds</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transfer money to anyone, anywhere, instantly. No hidden fees, no delays. 
              Experience the future of international money transfers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login" className="btn-primary text-lg px-8 py-4">
                Start Sending Money
                <ArrowRight className="inline ml-2" size={20} />
              </Link>
              <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </a>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                Instant transfers
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                Bank-level security
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Velo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for modern users who demand speed, security, and simplicity
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition">
                <Zap className="text-primary-600 group-hover:text-white transition" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Transfers complete in seconds, not days. Your money arrives when you need it.
              </p>
            </div>
            <div className="card hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition">
                <TrendingDown className="text-primary-600 group-hover:text-white transition" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lowest Fees</h3>
              <p className="text-gray-600">
                Up to 8x cheaper than traditional banks. No hidden costs or surprise charges.
              </p>
            </div>
            <div className="card hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition">
                <Shield className="text-primary-600 group-hover:text-white transition" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bank-Level Security</h3>
              <p className="text-gray-600">
                Your money is protected with enterprise-grade encryption and security protocols.
              </p>
            </div>
            <div className="card hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition">
                <Globe className="text-primary-600 group-hover:text-white transition" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Send to 60+ countries with support for 20+ currencies. True global coverage.
              </p>
            </div>
            <div className="card hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition">
                <Clock className="text-primary-600 group-hover:text-white transition" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our team is always ready to help. Get assistance whenever you need it.
              </p>
            </div>
            <div className="card hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition">
                <Users className="text-primary-600 group-hover:text-white transition" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trusted by Millions</h3>
              <p className="text-gray-600">
                Join millions of users who trust Velo for their international transfers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Send money in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Add Money</h3>
              <p className="text-gray-600">
                Load your account using your debit card, credit card, or bank transfer
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Recipient</h3>
              <p className="text-gray-600">
                Enter recipient's email or bank details. We'll handle the rest automatically
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Money Delivered</h3>
              <p className="text-gray-600">
                Your recipient receives the money instantly. Track it in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Security is Our Priority
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We use the same security measures as the world's largest banks to keep your money safe.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Lock className="text-primary-600 mr-4 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">256-bit Encryption</h3>
                    <p className="text-gray-600">Military-grade encryption protects all your data</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="text-primary-600 mr-4 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Regulatory Compliance</h3>
                    <p className="text-gray-600">Fully licensed and regulated in multiple jurisdictions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-primary-600 mr-4 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">2FA Authentication</h3>
                    <p className="text-gray-600">Two-factor authentication keeps unauthorized users out</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-12 text-white">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Shield size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">$10B+</div>
                    <div className="text-primary-100">Transferred Securely</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">5M+</div>
                    <div className="text-primary-100">Trusted Users</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Star size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">4.9/5</div>
                    <div className="text-primary-100">User Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Sending Money?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join millions of users who trust Velo for fast, secure international transfers
          </p>
          <Link href="/login" className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-lg hover:bg-primary-50 transition text-lg">
            Create Free Account
            <ArrowRight className="inline ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div>
              <div className="text-2xl font-bold text-white mb-4">Velo</div>
              <p className="text-sm text-gray-400">
                Fast, secure international money transfers at the best rates.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How it Works</a></li>
                <li><Link href="/help" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
                <li><Link href="/compliance" className="hover:text-white transition">Compliance</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2026 Velo. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-white transition">Facebook</a>
              <a href="#" className="hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}