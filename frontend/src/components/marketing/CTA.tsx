import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
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
  )
}