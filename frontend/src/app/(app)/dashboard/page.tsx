'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { CURRENCIES } from '@/lib/constants'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Send, 
  TrendingUp,
  DollarSign
} from 'lucide-react'

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  currency: string;
}

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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, transactionsRes] = await Promise.all([
        apiClient.getCurrentUser(),
        apiClient.getTransactions(1, 10)
      ])
      setUser(userRes.data)
      setTransactions(transactionsRes.data.data)
    } catch (error) {
      console.error('Failed to load data:', error)
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-100 text-sm mb-2">Available Balance</p>
              <div className="flex items-baseline">
                <p className="text-5xl font-bold">
                  {formatCurrency(user?.balance || 0, user?.currency || 'USD')}
                </p>
                <span className="ml-3 text-primary-200 text-xl">{user?.currency}</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <DollarSign size={32} />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <button
              onClick={() => router.push('/add-money')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition group"
            >
              <Plus className="mx-auto mb-2 group-hover:scale-110 transition" size={24} />
              <p className="text-sm font-medium">Add Money</p>
            </button>
            <button
              onClick={() => router.push('/send')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition group"
            >
              <Send className="mx-auto mb-2 group-hover:scale-110 transition" size={24} />
              <p className="text-sm font-medium">Send</p>
            </button>
            <button
              onClick={() => router.push('/withdraw')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition group"
            >
              <ArrowUpRight className="mx-auto mb-2 group-hover:scale-110 transition" size={24} />
              <p className="text-sm font-medium">Withdraw</p>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(0, user?.currency || 'USD')}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(0, user?.currency || 'USD')}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Received</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(0, user?.currency || 'USD')}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ArrowDownLeft className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button
              onClick={() => router.push('/transactions')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View All
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-600 mb-4">No transactions yet</p>
              <button
                onClick={() => router.push('/send')}
                className="btn-primary"
              >
                Send Your First Payment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
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
                        <ArrowDownLeft className={
                          tx.type === 'ONRAMP' ? 'text-green-600' :
                          'text-blue-600'
                        } size={20} />
                      ) : (
                        <ArrowUpRight className={
                          tx.type === 'OFFRAMP' ? 'text-red-600' :
                          'text-blue-600'
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
          )}
        </div>
      </div>
    </div>
  )
}