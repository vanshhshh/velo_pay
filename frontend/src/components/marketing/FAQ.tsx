'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'How fast are transfers?',
    a: 'Transfers to other Velo users are instant. Bank transfers typically arrive within 1-3 business days.'
  },
  {
    q: 'What are the fees?',
    a: 'We charge a small percentage fee per transfer, starting at 0.5% for personal accounts. See our Pricing page for details.'
  },
  {
    q: 'Is my money safe?',
    a: 'Yes. We use bank-level security with 256-bit encryption and are fully licensed and regulated.'
  },
  {
    q: 'What currencies do you support?',
    a: 'We support USD, EUR, GBP, INR, CAD, AUD, JPY, CHF, and many more.'
  },
  {
    q: 'Do I need to verify my identity?',
    a: 'Yes, we are required by law to verify your identity. This typically takes just a few minutes.'
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Velo
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card cursor-pointer" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">{faq.q}</h3>
                <ChevronDown 
                  className={`text-gray-600 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                  size={20} 
                />
              </div>
              {openIndex === index && (
                <p className="text-gray-600 mt-3">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}