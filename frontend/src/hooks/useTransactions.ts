'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Transaction } from '@/types'

export function useTransactions(page: number = 1, limit: number = 20) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getTransactions(page, limit)
      setTransactions(response.data.data)
      setPagination(response.data.pagination)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load transactions')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchTransactions()
  }

  useEffect(() => {
    fetchTransactions()
  }, [page, limit])

  return { transactions, loading, error, pagination, refetch }
}