'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

type TransakWidgetEventPayload = Record<string, unknown>

interface TransakWidgetProps {
  widgetUrl: string
  onClose: () => void
  onSuccess?: () => void
  onWalletRedirection?: (payload: TransakWidgetEventPayload) => void
}

function parseMessageData(data: unknown): unknown {
  if (typeof data !== 'string') return data

  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

function extractTransakEvent(
  data: unknown
): { eventName: string; payload: TransakWidgetEventPayload } | null {
  const parsed = parseMessageData(data)

  if (!parsed || typeof parsed !== 'object') {
    return null
  }

  const message = parsed as Record<string, unknown>
  const directEvent =
    message.eventName ?? message.event_id ?? message.eventId

  if (typeof directEvent === 'string') {
    const payload =
      message.data && typeof message.data === 'object'
        ? (message.data as TransakWidgetEventPayload)
        : message

    if (
      directEvent === 'TRANSAK_WIDGET_EVENT' &&
      payload &&
      typeof payload === 'object'
    ) {
      const nestedEvent =
        payload.eventName ?? payload.event_id ?? payload.eventId
      if (typeof nestedEvent === 'string') {
        const nestedPayload =
          payload.data && typeof payload.data === 'object'
            ? (payload.data as TransakWidgetEventPayload)
            : payload
        return { eventName: nestedEvent, payload: nestedPayload }
      }
    }

    return { eventName: directEvent, payload }
  }

  return null
}

export function TransakWidget({
  widgetUrl,
  onClose,
  onSuccess,
  onWalletRedirection,
}: TransakWidgetProps) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('transak')) return

      const transakEvent = extractTransakEvent(event.data)
      if (!transakEvent) return

      const { eventName, payload } = transakEvent

      if (eventName === 'WALLET_REDIRECTION') {
        onWalletRedirection?.(payload)
        return
      }

      if (
        eventName === 'TRANSAK_ORDER_SUCCESSFUL' ||
        eventName === 'ORDER_COMPLETED'
      ) {
        onSuccess?.()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSuccess, onWalletRedirection])

  if (!widgetUrl) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        {/* Transak Iframe */}
        <iframe
          src={widgetUrl}
          className="w-full h-full border-0"
          allow="camera; microphone; payment"
        />
      </div>
    </div>
  )
}
