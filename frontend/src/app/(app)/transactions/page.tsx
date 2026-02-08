'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { CURRENCIES } from '@/lib/constants'
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react'

interface Transaction {
  id: string;
  type: 'ONRAMP' | 'OFFRAMP' | 'INTERNAL';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  amount: number;
  currency: string;
  senderUser?: { name: string; email: string };
  receiverUser?: { name: string; email: string };
  createdAt: string;
}

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ALL' | 'ONRAMP' | 'OFFRAMP' | 'INTERNAL'>('ALL')

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const response = await apiClient.getTransactions(1, 100)
      setTransactions(response.data.data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    const currencyInfo = CURRENCIES.find(c => c.code === currency)
    return `${currencyInfo?.symbol || ''}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'ALL' || tx.type === filter
    const matchesSearch = search === '' || 
      tx.receiverUser?.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.receiverUser?.email.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Transaction History</h1>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'ALL'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('ONRAMP')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'ONRAMP'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Added
              </button>
              <button
                onClick={() => setFilter('OFFRAMP')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'OFFRAMP'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Withdrawn
              </button>
              <button
                onClick={() => setFilter('INTERNAL')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'INTERNAL'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sent
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                  onClick={() => router.push(`/transactions/${tx.id}`)}
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
                      <p className="text-xs text-gray-500 mt-1">ID: {tx.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      tx.type === 'ONRAMP' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tx.type === 'ONRAMP' ? '+' : '-'}
                      {formatCurrency(Number(tx.amount), tx.currency)}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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
          )}
        </div>
      </div>
    </div>
  )
}