'use client'

import { useState, useEffect } from 'react'
import { CURRENCIES } from '@/lib/constants'

export function useCurrency() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  useEffect(() => {
    // Load from localStorage or user preferences
    const saved = localStorage.getItem('preferredCurrency')
    if (saved && CURRENCIES.find(c => c.code === saved)) {
      setSelectedCurrency(saved)
    }
  }, [])

  const changeCurrency = (currency: string) => {
    if (CURRENCIES.find(c => c.code === currency)) {
      setSelectedCurrency(currency)
      localStorage.setItem('preferredCurrency', currency)
    }
  }

  const getCurrencyInfo = (code?: string) => {
    return CURRENCIES.find(c => c.code === (code || selectedCurrency))
  }

  const formatAmount = (amount: number, currency?: string) => {
    const info = getCurrencyInfo(currency)
    return `${info?.symbol || ''}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`
  }

  return {
    selectedCurrency,
    changeCurrency,
    getCurrencyInfo,
    formatAmount,
    currencies: CURRENCIES
  }
}