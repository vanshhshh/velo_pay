'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { CURRENCIES, TRANSACTION_STATUS_COLORS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'

type TransactionDetails = {
  id: string
  type: 'ONRAMP' | 'OFFRAMP' | 'INTERNAL'
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  amount: number | string
  currency: string
  senderUserId?: string | null
  receiverUserId?: string | null
  senderWalletId?: string | null
  receiverWalletId?: string | null
  transakOrderId?: string | null
  transakSessionId?: string | null
  failureReason?: string | null
  createdAt: string
  completedAt?: string | null
}

export default function TransactionDetailsPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const txId = Array.isArray(params?.id) ? params.id[0] : params?.id

  useEffect(() => {
    if (!txId) {
      setError('Transaction ID is missing')
      setLoading(false)
      return
    }

    const loadTransaction = async () => {
      try {
        const response = await apiClient.getTransaction(txId)
        setTransaction(response.data)
        setError(null)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load transaction')
      } finally {
        setLoading(false)
      }
    }

    loadTransaction()
  }, [txId])

  const formatCurrency = (amount: number | string, currency: string) => {
    const numericAmount = Number(amount)
    const currencyInfo = CURRENCIES.find((item) => item.code === currency)
    return `${currencyInfo?.symbol || ''}${numericAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const formatDate = (value?: string | null) => {
    if (!value) return 'N/A'
    return new Date(value).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="py-8">
        <div className="container-custom max-w-3xl">
          <button
            onClick={() => router.push('/transactions')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Transactions
          </button>
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaction not found</h1>
            <p className="text-gray-600">{error || 'Unable to load this transaction.'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container-custom max-w-3xl">
        <button
          onClick={() => router.push('/transactions')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Transactions
        </button>

        <div className="card">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
              <p className="text-sm text-gray-600 mt-1 break-all">{transaction.id}</p>
            </div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                TRANSACTION_STATUS_COLORS[transaction.status]
              }`}
            >
              {transaction.status}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Type</p>
              <p className="font-semibold text-gray-900">{transaction.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Amount</p>
              <p className="font-semibold text-gray-900">
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created</p>
              <p className="font-semibold text-gray-900">{formatDate(transaction.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed</p>
              <p className="font-semibold text-gray-900">{formatDate(transaction.completedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Transak Session ID</p>
              <p className="font-semibold text-gray-900 break-all">
                {transaction.transakSessionId || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Transak Order ID</p>
              <p className="font-semibold text-gray-900 break-all">
                {transaction.transakOrderId || 'N/A'}
              </p>
            </div>
          </div>

          {transaction.failureReason && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700 mb-1">Failure Reason</p>
              <p className="text-sm text-red-900">{transaction.failureReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
