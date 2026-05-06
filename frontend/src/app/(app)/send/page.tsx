'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { CURRENCIES } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import { ArrowLeft, Mail, Send } from 'lucide-react'

export default function SendPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [receiverEmail, setReceiverEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const numericAmount = Number(amount)
  const isReady = receiverEmail.includes('@') && Number.isFinite(numericAmount) && numericAmount > 0
  const selectedCurrency = useMemo(
    () => CURRENCIES.find((item) => item.code === currency),
    [currency]
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.transfer({
        amount: numericAmount,
        currency,
        receiverEmail,
      })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
      >
        <ArrowLeft size={18} />
        Back to dashboard
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="surface p-6 sm:p-8">
          <div className="mb-8 flex items-start gap-4">
            <div className="icon-tile text-blue-600">
              <Send size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">Send money</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Move funds instantly to another Velo user by email.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Recipient email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={receiverEmail}
                  onChange={(event) => setReceiverEmail(event.target.value)}
                  className="input-field pl-12"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="input-field"
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.flag} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    {selectedCurrency?.symbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="input-field pl-14 text-lg font-semibold"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isReady}
                className="btn-primary flex-1"
              >
                <Send size={18} />
                {loading ? 'Sending...' : 'Send now'}
              </button>
            </div>
          </form>
        </section>

        <aside className="surface h-fit p-5">
          <p className="text-sm font-semibold text-slate-500">Transfer summary</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {formatCurrency(Number.isFinite(numericAmount) ? numericAmount : 0, currency)}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Recipient must already have a Velo account. Funds settle immediately
            after balance validation.
          </p>
        </aside>
      </div>
    </div>
  )
}
