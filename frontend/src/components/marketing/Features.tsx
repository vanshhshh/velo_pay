import { Zap, TrendingDown, Shield, Globe, Clock, Users } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Transfers complete in seconds, not days. Your money arrives when you need it.',
  },
  {
    icon: TrendingDown,
    title: 'Lowest Fees',
    description: 'Up to 8x cheaper than traditional banks. No hidden costs or surprise charges.',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your money is protected with enterprise-grade encryption and security protocols.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Send to 60+ countries with support for 20+ currencies. True global coverage.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our team is always ready to help. Get assistance whenever you need it.',
  },
  {
    icon: Users,
    title: 'Trusted by Millions',
    description: 'Join millions of users who trust Velo for their international transfers.',
  },
]

export function Features() {
  return (
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
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="card hover:shadow-lg transition group">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition">
                  <Icon className="text-primary-600 group-hover:text-white transition" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}