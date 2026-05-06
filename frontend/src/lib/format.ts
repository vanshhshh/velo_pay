import { CURRENCIES } from './constants'

export function formatCurrency(amount: number | string, currency: string) {
  const numericAmount = Number(amount) || 0
  const currencyInfo = CURRENCIES.find((item) => item.code === currency)
  const formatted = numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  if (!currencyInfo) return `${formatted} ${currency}`
  return currencyInfo.symbol.length <= 2
    ? `${currencyInfo.symbol}${formatted}`
    : `${formatted} ${currencyInfo.symbol}`
}

export function formatDate(value?: string | null) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function transactionTitle(type: string, receiverName?: string) {
  if (type === 'ONRAMP') return 'Money added'
  if (type === 'OFFRAMP') return 'Bank withdrawal'
  return receiverName ? `Sent to ${receiverName}` : 'Velo transfer'
}

export function transactionSign(type: string) {
  return type === 'ONRAMP' ? '+' : '-'
}
