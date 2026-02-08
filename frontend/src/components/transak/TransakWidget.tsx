'use client'

import { X } from 'lucide-react'

interface TransakWidgetProps {
  widgetUrl: string
  onClose: () => void
}

export function TransakWidget({ widgetUrl, onClose }: TransakWidgetProps) {
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
