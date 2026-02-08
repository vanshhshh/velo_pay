# VELO CRYPTO-INVISIBLE FINTECH PLATFORM - COMPLETE CODE

## All files ready for copy-paste deployment

---

### frontend/src/app/layout.tsx

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Velo - Send Money Instantly',
  description: 'Fast, secure international money transfers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

---

### frontend/src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
```

---

### frontend/src/app/page.tsx

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Velo</h1>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
```

---

### frontend/src/app/login/page.tsx

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

declare global {
  interface Window {
    google: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large', width: 300 }
        )
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleCredentialResponse = async (response: any) => {
    setLoading(true)
    try {
      const result = await apiClient.googleAuth(response.credential)
      localStorage.setItem('token', result.data.token)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">Welcome to Velo</h1>
        <p className="mb-8 text-center text-gray-600">
          Sign in to send money instantly
        </p>
        <div id="google-signin-button" className="flex justify-center"></div>
        {loading && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Signing in...
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### frontend/src/app/dashboard/page.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { User, Transaction } from '@/types'
import { ArrowUpRight, ArrowDownLeft, Plus, Send } from 'lucide-react'

export default function Dashboard Page() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, transactionsRes] = await Promise.all([
        apiClient.getCurrentUser(),
        apiClient.getTransactions(1, 10)
      ])
      setUser(userRes.data)
      setTransactions(transactionsRes.data.data)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Velo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="mt-2 text-4xl font-bold">
            {formatCurrency(user?.balance || 0)}
          </p>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => router.push('/add-money')}
              className="flex items-center space-x-2 rounded-md bg-primary-600 px-6 py-3 text-white hover:bg-primary-700"
            >
              <Plus size={20} />
              <span>Add Money</span>
            </button>
            <button
              onClick={() => router.push('/send')}
              className="flex items-center space-x-2 rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
              <Send size={20} />
              <span>Send Money</span>
            </button>
            <button
              onClick={() => router.push('/withdraw')}
              className="flex items-center space-x-2 rounded-md border border-gray-300 px-6 py-3 hover:bg-gray-50"
            >
              <ArrowUpRight size={20} />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`rounded-full p-2 ${
                        tx.type === 'ONRAMP'
                          ? 'bg-green-100'
                          : tx.type === 'OFFRAMP'
                          ? 'bg-red-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      {tx.type === 'ONRAMP' ? (
                        <ArrowDownLeft className="text-green-600" size={20} />
                      ) : (
                        <ArrowUpRight
                          className={
                            tx.type === 'OFFRAMP'
                              ? 'text-red-600'
                              : 'text-blue-600'
                          }
                          size={20}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {tx.type === 'ONRAMP'
                          ? 'Money Added'
                          : tx.type === 'OFFRAMP'
                          ? 'Withdrawal'
                          : `To ${tx.receiverUser?.name || 'Unknown'}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        tx.type === 'ONRAMP'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'ONRAMP' ? '+' : '-'}
                      {formatCurrency(Number(tx.amount))}
                    </p>
                    <p
                      className={`text-sm ${
                        tx.status === 'COMPLETED'
                          ? 'text-green-600'
                          : tx.status === 'PENDING'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
```

---

### frontend/src/app/send/page.tsx

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { formatCurrency } from '@/lib/utils'

export default function SendPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [receiverEmail, setReceiverEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiClient.transfer({
        amount: parseFloat(amount),
        receiverEmail
      })
      alert('Money sent successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="mb-6 text-2xl font-bold">Send Money</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recipient Email
              </label>
              <input
                type="email"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary-600 py-3 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Money'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full rounded-md border border-gray-300 py-3 hover:bg-gray-50"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

---

### frontend/src/app/add-money/page.tsx

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

export default function AddMoneyPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [widgetUrl, setWidgetUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiClient.addMoney(parseFloat(amount))
      setWidgetUrl(response.data.widgetUrl)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to initiate add money')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (widgetUrl) {
      window.open(widgetUrl, '_blank')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }, [widgetUrl, router])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="mb-6 text-2xl font-bold">Add Money</h1>
          {!widgetUrl ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Minimum: $10
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary-600 py-3 text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full rounded-md border border-gray-300 py-3 hover:bg-gray-50"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="mb-4">Opening payment window...</p>
              <p className="text-sm text-gray-600">
                You'll be redirected to your dashboard shortly
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

### frontend/src/app/withdraw/page.tsx

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

export default function WithdrawPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountHolderName, setAccountHolderName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiClient.withdraw({
        amount: parseFloat(amount),
        bankDetails: {
          accountNumber,
          routingNumber,
          bankName,
          accountHolderName,
          country: 'US',
          currency: 'USD'
        }
      })
      alert('Withdrawal initiated successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Withdrawal failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="mb-6 text-2xl font-bold">Withdraw to Bank</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Holder Name
              </label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Routing Number
              </label>
              <input
                type="text"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary-600 py-3 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Withdraw'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full rounded-md border border-gray-300 py-3 hover:bg-gray-50"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

---

## DEPLOYMENT INSTRUCTIONS

1. **Backend Setup:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

2. **Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

3. **Environment Variables:**
- Backend: Copy `.env.example` to `.env` and fill in values
- Frontend: Copy `.env.local.example` to `.env.local`

4. **Database:** Already configured to use Supabase PostgreSQL

5. **Google OAuth:** Already configured with provided Client ID

6. **Transak:** Add your Transak API keys to backend `.env`

The platform is now complete with crypto-invisible architecture!
