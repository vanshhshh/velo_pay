'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { CURRENCIES } from '@/lib/constants'
import { TransakWidget } from '@/components/transak/TransakWidget'
import { ArrowLeft } from 'lucide-react'

export default function AddMoneyPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)
  const [widgetUrl, setWidgetUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiClient.createOnRampWidget({
        amount: parseFloat(amount),
        currency
      })
      setWidgetUrl(response.data.widgetUrl)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setWidgetUrl('')
    router.push('/dashboard')
  }

  const handleSuccess = () => {
    setWidgetUrl('')
    router.push('/dashboard')
  }

  return (
    <div className="py-8">
      <div className="container-custom max-w-2xl">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Money</h1>
          <p className="text-gray-600 mb-8">Load your account with funds to start sending</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                  {CURRENCIES.find(c => c.code === currency)?.symbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-10 text-lg"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Minimum: {CURRENCIES.find(c => c.code === currency)?.symbol}10</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Secure Payment:</strong> You'll be redirected to our payment processor to complete your transaction securely.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className="btn-primary w-full text-lg"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>
        </div>

        {widgetUrl && (
          <TransakWidget
            widgetUrl={widgetUrl}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  )
}