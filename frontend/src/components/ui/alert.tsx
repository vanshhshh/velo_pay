import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  title?: string
  icon?: ReactNode
}

export function Alert({ 
  className, 
  variant = 'default', 
  title, 
  icon,
  children,
  ...props 
}: AlertProps) {
  const variants = {
    default: {
      container: 'bg-gray-50 border-gray-200 text-gray-900',
      icon: <Info className="text-gray-600" size={20} />,
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-900',
      icon: <CheckCircle className="text-green-600" size={20} />,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      icon: <AlertCircle className="text-yellow-600" size={20} />,
    },
    danger: {
      container: 'bg-red-50 border-red-200 text-red-900',
      icon: <XCircle className="text-red-600" size={20} />,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="text-blue-600" size={20} />,
    },
  }

  const config = variants[variant]

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        config.container,
        className
      )}
      {...props}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {icon || config.icon}
        </div>
        <div className="flex-1">
          {title && (
            <h5 className="font-semibold mb-1">{title}</h5>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}