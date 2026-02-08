import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Transaction } from '@/types'

interface TransactionItemProps {
  transaction: Transaction
  onClick?: () => void
}

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const tx = transaction

  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
      onClick={onClick}
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
  )
}