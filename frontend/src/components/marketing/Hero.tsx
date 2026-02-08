import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function Hero() {
  return (
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
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
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
  )
}