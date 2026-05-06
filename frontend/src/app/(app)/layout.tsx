'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ArrowDownToLine,
  ArrowUpRight,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Add money', href: '/add-money', icon: Plus },
  { name: 'Send', href: '/send', icon: Send },
  { name: 'Withdraw', href: '/withdraw', icon: ArrowUpRight },
  { name: 'Transactions', href: '/transactions', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) router.push('/login')
  }, [router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const pageName = useMemo(() => {
    return (
      navigation.find((item) => pathname === item.href)?.name ??
      pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ') ??
      'Velo'
    )
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <button
        onClick={() => setSidebarOpen((value) => !value)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 shadow-lg lg:hidden"
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-slate-950 text-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400 text-slate-950">
                <ArrowDownToLine size={20} />
              </div>
              <div>
                <p className="text-xl font-semibold">Velo</p>
                <p className="text-xs text-slate-400">Global money movement</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="m-4 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={18} className="text-teal-300" />
              Protected account
            </div>
            <p className="text-xs leading-5 text-slate-400">
              Transfers, on-ramp sessions, and withdrawals are tracked with a
              transaction record before money moves.
            </p>
          </div>

          <div className="border-t border-white/10 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="min-h-screen lg:ml-72">
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">
            <div className="ml-12 lg:ml-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Current view
              </p>
              <p className="text-sm font-semibold capitalize text-slate-950">
                {pageName}
              </p>
            </div>
            <div className="hidden min-w-72 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
              <Search size={16} />
              Search transactions, recipients, or sessions
            </div>
          </div>
        </div>
        <div className="px-5 py-8 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
