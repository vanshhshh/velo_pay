import { Select } from '@/components/ui/select'
import { CURRENCIES } from '@/lib/constants'

interface CurrencySelectorProps {
  value: string
  onChange: (currency: string) => void
  label?: string
}

export function CurrencySelector({ value, onChange, label }: CurrencySelectorProps) {
  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {CURRENCIES.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.flag} {currency.name} ({currency.symbol})
        </option>
      ))}
    </Select>
  )
}