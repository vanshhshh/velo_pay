export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: 'US' },
  { code: 'EUR', name: 'Euro', symbol: 'EUR', flag: 'EU' },
  { code: 'GBP', name: 'British Pound', symbol: 'GBP', flag: 'GB' },
  { code: 'INR', name: 'Indian Rupee', symbol: 'INR', flag: 'IN' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: 'CA' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: 'AU' },
  { code: 'JPY', name: 'Japanese Yen', symbol: 'JPY', flag: 'JP' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: 'CH' },
] as const

export const TRANSACTION_STATUS_COLORS = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  FAILED: 'border-rose-200 bg-rose-50 text-rose-700',
} as const
