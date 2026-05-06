'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

type TransakWidgetEventPayload = Record<string, unknown>

interface TransakWidgetProps {
  widgetUrl: string
  onClose: () => void
  onSuccess?: (payload: TransakWidgetEventPayload) => void
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

      if (
        eventName === 'WALLET_REDIRECTION' ||
        eventName === 'TRANSAK_WALLET_REDIRECTION'
      ) {
        onWalletRedirection?.(payload)
        return
      }

      if (
        eventName === 'TRANSAK_ORDER_SUCCESSFUL' ||
        eventName === 'ORDER_COMPLETED'
      ) {
        onSuccess?.(payload)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSuccess, onWalletRedirection])

  if (!widgetUrl) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative h-[88vh] w-full max-w-4xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          aria-label="Close Transak widget"
        >
          <X size={20} />
        </button>

        <iframe
          src={widgetUrl}
          title="Transak payment widget"
          className="h-full w-full border-0"
          allow="camera; microphone; payment"
        />
      </div>
    </div>
  )
}
