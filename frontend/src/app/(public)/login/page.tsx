'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
          callback: handleCredentialResponse
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { 
            theme: 'outline', 
            size: 'large',
            width: 400,
            text: 'continue_with',
            shape: 'rectangular'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-primary-600">
            Velo
          </Link>
          <p className="text-gray-600 mt-2">Fast, secure money transfers worldwide</p>
        </div>

        {/* Login Card */}
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome back</h1>
          <p className="text-gray-600 mb-8 text-center">
            Sign in to continue to your account
          </p>

          <div id="google-signin-button" className="flex justify-center mb-6"></div>

          {loading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-sm text-gray-600 mt-2">Signing in...</p>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-8">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-primary-600 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}