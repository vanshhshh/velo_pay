'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { CURRENCIES } from '@/lib/constants'
import { PageHeader } from '@/components/shared/PageHeader'
import { Bell, CreditCard, Shield, User } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await apiClient.getCurrentUser()
        setUser(response.data)
        setSelectedCurrency(response.data.currency || 'USD')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" />
      </div>
    )
  }

  const sections = [
    {
      title: 'Security',
      icon: Shield,
      rows: [
        ['Two-factor authentication', 'Add another check before sensitive actions.', 'Enable'],
        ['Account sessions', 'Review active sessions and sign out old devices.', 'Review'],
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      rows: [
        ['Email notifications', 'Receive settlement and transaction updates.', 'On'],
        ['Transaction alerts', 'Notify me for every account movement.', 'On'],
      ],
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Settings"
        description="Manage account identity, currency preferences, and security defaults."
      />

      <div className="grid gap-6">
        <section className="surface p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="icon-tile text-teal-600">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">Profile</h2>
              <p className="text-sm text-slate-500">Identity synced from Google.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <input type="text" value={user?.name || ''} className="input-field" disabled />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" value={user?.email || ''} className="input-field" disabled />
            </div>
          </div>
        </section>

        <section className="surface p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="icon-tile text-blue-600">
              <CreditCard size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">Preferences</h2>
              <p className="text-sm text-slate-500">Used as the default display currency.</p>
            </div>
          </div>
          <select
            value={selectedCurrency}
            onChange={(event) => setSelectedCurrency(event.target.value)}
            className="input-field max-w-md"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.flag} - {curr.name}
              </option>
            ))}
          </select>
        </section>

        {sections.map((section) => {
          const Icon = section.icon
          return (
            <section key={section.title} className="surface p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="icon-tile">
                  <Icon size={20} />
                </div>
                <h2 className="font-semibold text-slate-950">{section.title}</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {section.rows.map(([title, description, action]) => (
                  <div key={title} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-slate-950">{title}</p>
                      <p className="text-sm text-slate-500">{description}</p>
                    </div>
                    <button className="btn-secondary">{action}</button>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
