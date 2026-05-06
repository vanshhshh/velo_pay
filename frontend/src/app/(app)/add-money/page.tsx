'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { CURRENCIES } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import { TransakWidget } from '@/components/transak/TransakWidget'
import { ArrowLeft, BadgeCheck, CreditCard, LockKeyhole, Plus } from 'lucide-react'

type TransakPayload = Record<string, unknown>

function readString(source: TransakPayload, keys: string[]) {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim()) return value
    if (typeof value === 'number') return value.toString()
  }
  return undefined
}

export default function AddMoneyPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('100')
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)
  const [settling, setSettling] = useState(false)
  const [widgetUrl, setWidgetUrl] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [error, setError] = useState('')

  const numericAmount = Number(amount)
  const selectedCurrency = useMemo(
    () => CURRENCIES.find((item) => item.code === currency),
    [currency]
  )
  const isValidAmount = Number.isFinite(numericAmount) && numericAmount >= 10

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.createOnRampWidget({
        amount: numericAmount,
        currency,
      })
      setWidgetUrl(response.data.widgetUrl)
      setSessionId(response.data.sessionId)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setWidgetUrl('')
  }

  const handleSuccess = async (payload: TransakPayload) => {
    const data =
      payload.data && typeof payload.data === 'object'
        ? (payload.data as TransakPayload)
        : payload
    const orderId = readString(data, ['id', 'orderId', 'order_id'])

    if (!sessionId) {
      setWidgetUrl('')
      router.push('/dashboard')
      return
    }

    setSettling(true)
    setError('')

    try {
      await apiClient.completeOnRampWidget({ sessionId, orderId })
      setWidgetUrl('')
      router.push('/dashboard')
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Payment finished, but the balance could not be updated yet.'
      )
      setWidgetUrl('')
    } finally {
      setSettling(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
      >
        <ArrowLeft size={18} />
        Back to dashboard
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="surface p-6 sm:p-8">
          <div className="mb-8 flex items-start gap-4">
            <div className="icon-tile text-teal-600">
              <Plus size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">
                Add money
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose the amount, complete the Transak checkout, and Velo will
                credit the designated pending on-ramp amount automatically.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                    min="10"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="input-field pl-14 text-lg font-semibold"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-slate-500">Minimum amount is 10.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[50, 100, 250].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value.toString())}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50"
                >
                  {formatCurrency(value, currency)}
                </button>
              ))}
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || settling || !isValidAmount}
              className="btn-primary w-full"
            >
              <CreditCard size={18} />
              {loading ? 'Opening checkout...' : 'Continue to secure checkout'}
            </button>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="surface p-5">
            <p className="text-sm font-semibold text-slate-500">You are adding</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {formatCurrency(isValidAmount ? numericAmount : 0, currency)}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This exact amount is saved as a pending on-ramp before the widget opens.
            </p>
          </div>
          <div className="surface p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
              <LockKeyhole size={18} className="text-teal-600" />
              Settlement flow
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p>1. Create a pending Velo transaction.</p>
              <p>2. Complete the Transak checkout.</p>
              <p>3. Credit the saved pending amount once completion is received.</p>
            </div>
          </div>
          <div className="surface p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <BadgeCheck size={18} />
              Idempotent crediting
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Duplicate completion events keep the balance unchanged after the
              first successful settlement.
            </p>
          </div>
        </aside>
      </div>

      {widgetUrl && (
        <TransakWidget
          widgetUrl={widgetUrl}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
