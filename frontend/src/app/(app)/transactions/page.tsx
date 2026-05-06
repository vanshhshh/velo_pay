'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { formatCurrency, formatDate, transactionSign, transactionTitle } from '@/lib/format'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ArrowDownLeft, ArrowUpRight, Filter, Search } from 'lucide-react'

interface Transaction {
  id: string
  type: 'ONRAMP' | 'OFFRAMP' | 'INTERNAL'
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  amount: number
  currency: string
  senderUser?: { name: string; email: string }
  receiverUser?: { name: string; email: string }
  createdAt: string
}

const filters = [
  { label: 'All', value: 'ALL' },
  { label: 'Added', value: 'ONRAMP' },
  { label: 'Withdrawn', value: 'OFFRAMP' },
  { label: 'Sent', value: 'INTERNAL' },
] as const

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('ALL')

  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await apiClient.getTransactions(1, 100)
        setTransactions(response.data.data)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  const filteredTransactions = useMemo(() => {
    const query = search.toLowerCase()
    return transactions.filter((tx) => {
      const matchesFilter = filter === 'ALL' || tx.type === filter
      const searchable = [
        tx.id,
        tx.type,
        tx.status,
        tx.receiverUser?.name,
        tx.receiverUser?.email,
        tx.senderUser?.name,
        tx.senderUser?.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return matchesFilter && (!query || searchable.includes(query))
    })
  }, [filter, search, transactions])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Transactions"
        description="Search every on-ramp, withdrawal, and internal transfer with settlement status."
      />

      <div className="surface mb-6 p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by recipient, status, type, or transaction ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  filter === item.value
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Filter size={15} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="surface overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-slate-950">No transactions found</p>
            <p className="mt-2 text-sm text-slate-500">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => {
              const isOnRamp = tx.type === 'ONRAMP'
              const Icon = isOnRamp ? ArrowDownLeft : ArrowUpRight

              return (
                <button
                  key={tx.id}
                  onClick={() => router.push(`/transactions/${tx.id}`)}
                  className="grid w-full gap-4 p-5 text-left transition hover:bg-slate-50 md:grid-cols-[1fr_auto_auto]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="icon-tile">
                      <Icon size={18} className={isOnRamp ? 'text-emerald-600' : 'text-slate-700'} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">
                        {transactionTitle(tx.type, tx.receiverUser?.name)}
                      </p>
                      <p className="text-sm text-slate-500">{formatDate(tx.createdAt)}</p>
                      <p className="mt-1 truncate text-xs text-slate-400">ID {tx.id}</p>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p className={`font-semibold ${isOnRamp ? 'text-emerald-600' : 'text-slate-950'}`}>
                      {transactionSign(tx.type)}
                      {formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <p className="text-xs text-slate-500">{tx.currency}</p>
                  </div>
                  <div className="md:text-right">
                    <StatusBadge status={tx.status} />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
