'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { User } from '@/types'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getCurrentUser()
      setUser(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchUser()
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return { user, loading, error, refetch }
}