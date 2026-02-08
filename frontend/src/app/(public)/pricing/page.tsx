import Link from 'next/link'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No hidden fees. No surprises. Pay only for what you use.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">0.5%</span>
              <span className="text-gray-600 ml-2">per transfer</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                Transfers up to $10,000
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                24/7 support
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                Instant transfers
              </li>
            </ul>
            <Link href="/login" className="btn-secondary w-full">
              Get Started
            </Link>
          </div>

          <div className="card hover:shadow-xl transition border-2 border-primary-600 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">0.3%</span>
              <span className="text-gray-600 ml-2">per transfer</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                Unlimited transfers
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                Priority support
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                API access
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                Batch payments
              </li>
            </ul>
            <Link href="/login" className="btn-primary w-full">
              Get Started
            </Link>
          </div>

          <div className="card hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">Custom</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                Volume discounts
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                Dedicated account manager
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                Custom integration
              </li>
              <li className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2" size={20} />
                SLA guarantee
              </li>
            </ul>
            <a href="mailto:[email protected]" className="btn-secondary w-full">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}