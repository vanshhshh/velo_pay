import { DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface BalanceCardProps {
  balance: number
  currency: string
}

export function BalanceCard({ balance, currency }: BalanceCardProps) {
  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-primary-100 text-sm mb-2">Available Balance</p>
          <div className="flex items-baseline">
            <p className="text-5xl font-bold">
              {formatCurrency(balance, currency)}
            </p>
            <span className="ml-3 text-primary-200 text-xl">{currency}</span>
          </div>
        </div>
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
          <DollarSign size={32} />
        </div>
      </div>
    </div>
  )
}