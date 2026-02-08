import { useRouter } from 'next/navigation'
import { Plus, Send, ArrowUpRight } from 'lucide-react'

export function QuickActions() {
  const router = useRouter()

  const actions = [
    { icon: Plus, label: 'Add Money', href: '/add-money' },
    { icon: Send, label: 'Send', href: '/send' },
    { icon: ArrowUpRight, label: 'Withdraw', href: '/withdraw' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.label}
            onClick={() => router.push(action.href)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition group"
          >
            <Icon className="mx-auto mb-2 group-hover:scale-110 transition" size={24} />
            <p className="text-sm font-medium">{action.label}</p>
          </button>
        )
      })}
    </div>
  )
}