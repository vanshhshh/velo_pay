'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { ArrowLeft, Globe2, LockKeyhole, ShieldCheck } from 'lucide-react'

declare global {
  interface Window {
    google: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: 340,
            text: 'continue_with',
            shape: 'rectangular',
          }
        )
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [router])

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

  const handleDevLogin = async () => {
    setLoading(true)
    try {
      const result = await apiClient.devLogin()
      localStorage.setItem('token', result.data.token)
      router.push('/dashboard')
    } catch (error) {
      console.error('Dev login failed:', error)
      alert('Local dev login failed. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl lg:grid-cols-[1fr_28rem]">
        <section className="hidden bg-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
          <Link href="/" className="text-2xl font-semibold">
            Velo
          </Link>
          <div>
            <p className="max-w-xl text-5xl font-semibold leading-tight">
              Move from on-ramp to payout without losing the thread.
            </p>
            <div className="mt-10 grid gap-4">
              {[
                { icon: ShieldCheck, text: 'Session-backed transaction records' },
                { icon: LockKeyhole, text: 'Secure Google sign-in' },
                { icon: Globe2, text: 'Multi-currency account flow' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <Icon size={20} className="text-teal-300" />
                    <span className="text-sm text-slate-200">{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Fast, secure money transfers worldwide.
          </p>
        </section>

        <section className="flex items-center justify-center bg-slate-50 p-6 text-slate-950 sm:p-10">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
            >
              <ArrowLeft size={18} />
              Back to home
            </Link>

            <div className="surface p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-semibold text-teal-700">Velo account</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sign in to manage your balance, payments, withdrawals, and
                  on-ramp sessions.
                </p>
              </div>

              <div id="google-signin-button" className="mb-6 flex justify-center" />

              {process.env.NODE_ENV !== 'production' && (
                <button
                  type="button"
                  onClick={handleDevLogin}
                  disabled={loading}
                  className="btn-secondary w-full justify-center"
                >
                  Continue in local dev
                </button>
              )}

              {loading && (
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" />
                  <p className="mt-2 text-sm text-slate-600">Signing in...</p>
                </div>
              )}

              <p className="mt-8 text-center text-xs leading-5 text-slate-500">
                By signing in, you agree to our{' '}
                <Link
                  href="/terms"
                  className="font-semibold text-slate-900 hover:text-teal-700"
                >
                  Terms
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="font-semibold text-slate-900 hover:text-teal-700"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
