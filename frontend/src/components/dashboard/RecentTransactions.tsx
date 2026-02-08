import { ArrowUpRight, ArrowDownLeft, Send } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Transaction } from '@/types'

interface RecentTransactionsProps {
  transactions: Transaction[]
  onViewAll: () => void
}

export function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-600 mb-4">No transactions yet</p>
          <button onClick={onViewAll} className="btn-primary">
            Send Your First Payment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <button
          onClick={onViewAll}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                tx.type === 'ONRAMP' ? 'bg-green-100' :
                tx.type === 'OFFRAMP' ? 'bg-red-100' :
                'bg-blue-100'
              }`}>
                {tx.type === 'ONRAMP' ? (
                  <ArrowDownLeft className="text-green-600" size={20} />
                ) : (
                  <ArrowUpRight className={
                    tx.type === 'OFFRAMP' ? 'text-red-600' : 'text-blue-600'
                  } size={20} />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {tx.type === 'ONRAMP' ? 'Money Added' :
                   tx.type === 'OFFRAMP' ? 'Withdrawal' :
                   `To ${tx.receiverUser?.name || 'Unknown'}`}
                </p>
                <p className="text-sm text-gray-600">{formatDate(tx.createdAt)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${
                tx.type === 'ONRAMP' ? 'text-green-600' : 'text-gray-900'
              }`}>
                {tx.type === 'ONRAMP' ? '+' : '-'}
                {formatCurrency(Number(tx.amount), tx.currency)}
              </p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}