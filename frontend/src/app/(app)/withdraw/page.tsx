'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { CURRENCIES } from '@/lib/constants'
import { TransakWidget } from '@/components/transak/TransakWidget'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

type WalletRedirectionInfo = {
  orderId?: string
  walletAddress?: string
  network?: string
  cryptoCurrency?: string
  cryptoAmount?: string
  fiatCurrency?: string
  fiatAmount?: string
}

function readField(
  source: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value
    }
    if (typeof value === 'number') {
      return value.toString()
    }
  }
  return undefined
}

function extractWalletRedirectionInfo(
  payload: Record<string, unknown>
): WalletRedirectionInfo {
  const data =
    payload.data && typeof payload.data === 'object'
      ? (payload.data as Record<string, unknown>)
      : payload

  return {
    orderId: readField(data, ['id', 'orderId', 'order_id']),
    walletAddress: readField(data, [
      'walletAddress',
      'depositWalletAddress',
      'address',
    ]),
    network: readField(data, ['network', 'networkName']),
    cryptoCurrency: readField(data, [
      'cryptoCurrencyCode',
      'cryptoCurrency',
      'cryptocurrency',
    ]),
    cryptoAmount: readField(data, [
      'cryptoAmount',
      'cryptoAmountDue',
      'requestedCryptoAmount',
    ]),
    fiatCurrency: readField(data, ['fiatCurrency', 'fiatCurrencyCode']),
    fiatAmount: readField(data, ['fiatAmount', 'requestedFiatAmount']),
  }
}

export default function WithdrawPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [accountHolderName, setAccountHolderName] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [widgetUrl, setWidgetUrl] = useState('')
  const [walletRedirectionInfo, setWalletRedirectionInfo] =
    useState<WalletRedirectionInfo | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const queryInfo = extractWalletRedirectionInfo(
      Object.fromEntries(params.entries())
    )

    const hasData = Object.values(queryInfo).some(Boolean)
    if (!hasData) return

    setWalletRedirectionInfo(queryInfo)

    if (!amount && queryInfo.fiatAmount) {
      setAmount(queryInfo.fiatAmount)
    }

    if (
      queryInfo.fiatCurrency &&
      CURRENCIES.some((item) => item.code === queryInfo.fiatCurrency)
    ) {
      setCurrency(queryInfo.fiatCurrency)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiClient.createOffRampWidget({
        amount: parseFloat(amount),
        currency,
        bankDetails: {
          accountHolderName,
          bankName,
          accountNumber,
          routingNumber,
          country: 'US',
          currency
        }
      })
      setWidgetUrl(response.data.widgetUrl)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Withdrawal failed')
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

  const handleWalletRedirection = (payload: Record<string, unknown>) => {
    const info = extractWalletRedirectionInfo(payload)
    setWalletRedirectionInfo(info)

    if (!amount && info.fiatAmount) {
      setAmount(info.fiatAmount)
    }

    if (info.fiatCurrency && CURRENCIES.some((item) => item.code === info.fiatCurrency)) {
      setCurrency(info.fiatCurrency)
    }

    setWidgetUrl('')
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
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <ArrowUpRight className="text-red-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Withdraw to Bank</h1>
              <p className="text-gray-600">Transfer money to your bank account</p>
            </div>
          </div>

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
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-10 text-lg"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Bank Account Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <strong>Processing Time:</strong> Withdrawals typically complete within 1-3 business days
              </p>
            </div>

            {walletRedirectionInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-blue-900">
                  Complete Crypto Transfer
                </p>
                <p className="text-sm text-blue-800">
                  Use your wallet to send the required crypto to continue this withdrawal.
                </p>
                {walletRedirectionInfo.walletAddress && (
                  <p className="text-sm text-blue-900 break-all">
                    <strong>Wallet:</strong> {walletRedirectionInfo.walletAddress}
                  </p>
                )}
                {(walletRedirectionInfo.cryptoAmount || walletRedirectionInfo.cryptoCurrency) && (
                  <p className="text-sm text-blue-900">
                    <strong>Amount:</strong>{' '}
                    {walletRedirectionInfo.cryptoAmount || 'N/A'}{' '}
                    {walletRedirectionInfo.cryptoCurrency || ''}
                  </p>
                )}
                {walletRedirectionInfo.network && (
                  <p className="text-sm text-blue-900">
                    <strong>Network:</strong> {walletRedirectionInfo.network}
                  </p>
                )}
                {walletRedirectionInfo.orderId && (
                  <p className="text-sm text-blue-900 break-all">
                    <strong>Order ID:</strong> {walletRedirectionInfo.orderId}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Processing...' : 'Continue to Withdrawal'}
              </button>
            </div>
          </form>
        </div>

        {widgetUrl && (
          <TransakWidget
            widgetUrl={widgetUrl}
            onClose={handleClose}
            onSuccess={handleSuccess}
            onWalletRedirection={handleWalletRedirection}
          />
        )}
      </div>
    </div>
  )
}
