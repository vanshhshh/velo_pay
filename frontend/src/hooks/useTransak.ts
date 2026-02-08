'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'

export function useTransak() {
  const [loading, setLoading] = useState(false)
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createOnRampWidget = async (amount: number, currency: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.createOnRampWidget({ amount, currency })
      setWidgetUrl(response.data.widgetUrl)
      return response.data
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to create payment widget'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const createOffRampWidget = async (amount: number, currency: string, bankDetails: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.createOffRampWidget({ 
        amount, 
        currency, 
        bankDetails 
      })
      setWidgetUrl(response.data.widgetUrl)
      return response.data
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to create withdrawal widget'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const closeWidget = () => {
    setWidgetUrl(null)
    setError(null)
  }

  return {
    loading,
    widgetUrl,
    error,
    createOnRampWidget,
    createOffRampWidget,
    closeWidget
  }
}