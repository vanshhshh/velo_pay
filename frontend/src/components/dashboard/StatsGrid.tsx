import { TrendingUp, Send, ArrowDownLeft } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface StatsGridProps {
  currency: string
}

export function StatsGrid({ currency }: StatsGridProps) {
  const stats = [
    {
      icon: TrendingUp,
      label: 'This Month',
      value: formatCurrency(0, currency),
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Send,
      label: 'Total Sent',
      value: formatCurrency(0, currency),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: ArrowDownLeft,
      label: 'Total Received',
      value: formatCurrency(0, currency),
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}