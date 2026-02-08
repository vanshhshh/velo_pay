'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TransakWidget } from './TransakWidget'
import { apiClient } from '@/lib/api-client'

interface TransakButtonProps {
  type: 'onramp' | 'offramp'
  amount: number
  currency: string
  bankDetails?: any
  onSuccess?: () => void
  children: React.ReactNode
}

export function TransakButton({ 
  type, 
  amount, 
  currency, 
  bankDetails,
  onSuccess,
  children 
}: TransakButtonProps) {
  const [loading, setLoading] = useState(false)
  const [widgetUrl, setWidgetUrl] = useState('')

  const handleClick = async () => {
    setLoading(true)
    try {
      let response
      if (type === 'onramp') {
        response = await apiClient.createOnRampWidget({ amount, currency })
      } else {
        response = await apiClient.createOffRampWidget({ 
          amount, 
          currency, 
          bankDetails 
        })
      }
      setWidgetUrl(response.data.widgetUrl)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to open payment')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setWidgetUrl('')
  }

  const handleWidgetSuccess = () => {
    setWidgetUrl('')
    if (onSuccess) onSuccess()
  }

  return (
    <>
      <Button onClick={handleClick} loading={loading}>
        {children}
      </Button>
      
      {widgetUrl && (
        <TransakWidget
          widgetUrl={widgetUrl}
          onClose={handleClose}
          onSuccess={handleWidgetSuccess}
        />
      )}
    </>
  )
}