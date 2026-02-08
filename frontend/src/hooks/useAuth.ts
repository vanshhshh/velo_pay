'use client'

import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

export function useAuth() {
  const router = useRouter()

  const login = async (googleToken: string) => {
    try {
      const response = await apiClient.googleAuth(googleToken)
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('token')
  }

  return {
    login,
    logout,
    isAuthenticated
  }
}