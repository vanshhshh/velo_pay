import Link from 'next/link'
import { Search, MessageCircle, Mail, Phone } from 'lucide-react'

export default function HelpPage() {
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click "Sign Up" and sign in with your Google account. You\'ll need to verify your identity to start sending money.'
        },
        {
          q: 'What documents do I need?',
          a: 'You\'ll need a government-issued ID (passport, driver\'s license) and proof of address (utility bill, bank statement).'
        },
        {
          q: 'How long does verification take?',
          a: 'Most accounts are verified within minutes. In some cases, manual review may take up to 24 hours.'
        }
      ]
    },
    {
      category: 'Sending Money',
      questions: [
        {
          q: 'How fast are transfers?',
          a: 'Transfers to other Velo users are instant. Bank transfers typically arrive within 1-3 business days.'
        },
        {
          q: 'What are the fees?',
          a: 'We charge a small percentage fee per transfer. See our Pricing page for detailed information.'
        },
        {
          q: 'What are the transfer limits?',
          a: 'Limits vary based on your verification level. Verified accounts can send up to $50,000 per transaction.'
        }
      ]
    },
    {
      category: 'Adding Money',
      questions: [
        {
          q: 'How do I add money to my account?',
          a: 'Click "Add Money" in your dashboard. You can add funds using a debit card, credit card, or bank transfer.'
        },
        {
          q: 'What payment methods are accepted?',
          a: 'We accept Visa, Mastercard, American Express, and bank transfers in supported countries.'
        },
        {
          q: 'Is there a minimum deposit?',
          a: 'The minimum deposit is $10 (or equivalent in other currencies).'
        }
      ]
    },
    {
      category: 'Withdrawing Money',
      questions: [
        {
          q: 'How do I withdraw money?',
          a: 'Click "Withdraw" and enter your bank account details. Funds typically arrive in 1-3 business days.'
        },
        {
          q: 'Are there withdrawal fees?',
          a: 'Standard withdrawals have a small fee. See our Pricing page for details.'
        },
        {
          q: 'What currencies can I withdraw?',
          a: 'You can withdraw in your local currency. We support USD, EUR, GBP, INR, and many others.'
        }
      ]
    },
    {
      category: 'Security',
      questions: [
        {
          q: 'Is my money safe?',
          a: 'Yes. We use bank-level security with 256-bit encryption and are fully licensed and regulated.'
        },
        {
          q: 'How do I enable two-factor authentication?',
          a: 'Go to Settings > Security and follow the instructions to set up 2FA.'
        },
        {
          q: 'What if I lose access to my account?',
          a: 'Contact our support team immediately. We\'ll help you verify your identity and regain access.'
        }
      ]
    }
  ]

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
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container-custom max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-12">
            {faqs.map((category) => (
              <div key={category.category}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h3>
                <div className="space-y-4">
                  {category.questions.map((item, index) => (
                    <div key={index} className="card">
                      <h4 className="font-bold text-gray-900 mb-2">{item.q}</h4>
                      <p className="text-gray-600">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Still need help?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Chat with our support team in real-time
              </p>
              <button className="btn-primary w-full">
                Start Chat
              </button>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Send us an email, we'll respond within 24 hours
              </p>
              <a href="mailto:[email protected]" className="btn-secondary w-full block">
                Send Email
              </a>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Phone Support</h3>
              <p className="text-gray-600 mb-4">
                Call us Monday-Friday, 9am-6pm EST
              </p>
              <a href="tel:+1-800-VELO-PAY" className="btn-secondary w-full block">
                Call Now
              </a>
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