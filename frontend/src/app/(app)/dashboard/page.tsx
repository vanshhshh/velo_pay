'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { formatCurrency, formatDate, transactionSign, transactionTitle } from '@/lib/format'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock3,
  Plus,
  Send,
  TrendingUp,
  Wallet,
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  balance: number
  currency: string
}

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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, transactionsRes] = await Promise.all([
          apiClient.getCurrentUser(),
          apiClient.getTransactions(1, 10),
        ])
        setUser(userRes.data)
        setTransactions(transactionsRes.data.data)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.status !== 'COMPLETED') return acc
        if (tx.type === 'ONRAMP') acc.added += Number(tx.amount)
        if (tx.type === 'INTERNAL') acc.sent += Number(tx.amount)
        if (tx.type === 'OFFRAMP') acc.withdrawn += Number(tx.amount)
        return acc
      },
      { added: 0, sent: 0, withdrawn: 0 }
    )
  }, [transactions])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" />
      </div>
    )
  }

  const firstName = user?.name?.split(' ')[0] || 'there'
  const currency = user?.currency || 'USD'

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Your balance, recent movement, and next actions are all in one place."
        actions={
          <>
            <button onClick={() => router.push('/send')} className="btn-secondary">
              <Send size={18} />
              Send
            </button>
            <button onClick={() => router.push('/add-money')} className="btn-primary">
              <Plus size={18} />
              Add money
            </button>
          </>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-slate-400">Available balance</p>
                <p className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
                  {formatCurrency(user?.balance || 0, currency)}
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  Default currency: {currency}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10">
                <Wallet size={26} />
              </div>
            </div>
          </div>
          <div className="grid border-t border-white/10 sm:grid-cols-3">
            {[
              { label: 'Add money', icon: Plus, href: '/add-money' },
              { label: 'Send', icon: Send, href: '/send' },
              { label: 'Withdraw', icon: ArrowUpRight, href: '/withdraw' },
            ].map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  onClick={() => router.push(action.href)}
                  className="flex items-center justify-center gap-2 border-white/10 px-5 py-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10 sm:border-r"
                >
                  <Icon size={18} />
                  {action.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { label: 'Completed add-ins', value: totals.added, icon: TrendingUp, tone: 'text-emerald-600' },
            { label: 'Sent recently', value: totals.sent, icon: Send, tone: 'text-blue-600' },
            { label: 'Withdrawn', value: totals.withdrawn, icon: ArrowUpRight, tone: 'text-rose-600' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="surface p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <Icon size={18} className={stat.tone} />
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {formatCurrency(stat.value, currency)}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-8 surface">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Recent activity</h2>
            <p className="text-sm text-slate-500">Latest payments and settlement states.</p>
          </div>
          <button
            onClick={() => router.push('/transactions')}
            className="text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            View all
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="icon-tile mb-4">
              <Clock3 size={20} />
            </div>
            <p className="font-semibold text-slate-950">No transactions yet</p>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Add money first, then send or withdraw funds from your Velo balance.
            </p>
            <button onClick={() => router.push('/add-money')} className="btn-primary mt-5">
              <Plus size={18} />
              Add money
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const isOnRamp = tx.type === 'ONRAMP'
              const Icon = isOnRamp ? ArrowDownLeft : ArrowUpRight

              return (
                <button
                  key={tx.id}
                  onClick={() => router.push(`/transactions/${tx.id}`)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50"
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
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`font-semibold ${isOnRamp ? 'text-emerald-600' : 'text-slate-950'}`}>
                      {transactionSign(tx.type)}
                      {formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
