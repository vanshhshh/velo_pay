'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { TransakWidget } from '@/components/transak/TransakWidget'
import { ArrowLeft, ArrowUpRight, Loader2 } from 'lucide-react'

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
    if (typeof value === 'string' && value.trim().length > 0) return value
    if (typeof value === 'number') return value.toString()
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
  const launchedRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const [settling, setSettling] = useState(false)
  const [widgetUrl, setWidgetUrl] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [error, setError] = useState('')
  const [walletRedirectionInfo, setWalletRedirectionInfo] =
    useState<WalletRedirectionInfo | null>(null)

  const openWidget = useCallback(async () => {
    setLoading(true)
    setError('')
    setWalletRedirectionInfo(null)

    try {
      const response = await apiClient.createOffRampWidget({
        amount: 10,
        currency: 'INR',
        bankDetails: {
          accountHolderName: 'Transak User',
          bankName: 'Handled by Transak',
          accountNumber: '0000000000',
          routingNumber: '000000000',
          country: 'IN',
          currency: 'INR',
        },
      })

      setWidgetUrl(response.data.widgetUrl)
      setSessionId(response.data.sessionId)
    } catch (error: any) {
      setError(error.response?.data?.error || 'Withdrawal failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (launchedRef.current) return
    launchedRef.current = true
    openWidget()
  }, [openWidget])

  const completeWithdrawal = async (orderId?: string) => {
    if (!sessionId) {
      setWidgetUrl('')
      router.push('/dashboard')
      return
    }

    setSettling(true)
    setError('')

    try {
      await apiClient.completeOffRampWidget({ sessionId, orderId })
      setWidgetUrl('')
      router.push('/dashboard')
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
          'Withdrawal finished, but the balance could not be updated yet.'
      )
      setWidgetUrl('')
    } finally {
      setSettling(false)
    }
  }

  const handleSuccess = async (payload: Record<string, unknown>) => {
    const data =
      payload.data && typeof payload.data === 'object'
        ? (payload.data as Record<string, unknown>)
        : payload
    await completeWithdrawal(readField(data, ['id', 'orderId', 'order_id']))
  }

  const handleWalletRedirection = async (payload: Record<string, unknown>) => {
    const info = extractWalletRedirectionInfo(payload)
    setWalletRedirectionInfo(info)
    await completeWithdrawal(info.orderId)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
      >
        <ArrowLeft size={18} />
        Back to dashboard
      </button>

      <section className="surface p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="icon-tile text-rose-600">
            <ArrowUpRight size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">
              Opening withdrawal
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Transak will collect the withdrawal amount, crypto transfer, and
              payout details in its secure widget.
            </p>
          </div>
        </div>

        {(loading || settling) && (
          <div className="mt-8 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
            <Loader2 size={18} className="animate-spin text-teal-600" />
            {loading ? 'Opening Transak widget...' : 'Finalizing withdrawal...'}
          </div>
        )}

        {walletRedirectionInfo && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            Transak returned withdrawal transfer details. Finalizing the Velo
            transaction now.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">{error}</p>
            <button
              type="button"
              onClick={openWidget}
              className="btn-primary mt-4"
            >
              Try again
            </button>
          </div>
        )}
      </section>

      {widgetUrl && (
        <TransakWidget
          widgetUrl={widgetUrl}
          onClose={() => {
            setWidgetUrl('')
            router.push('/dashboard')
          }}
          onSuccess={handleSuccess}
          onWalletRedirection={handleWalletRedirection}
        />
      )}
    </div>
  )
}
