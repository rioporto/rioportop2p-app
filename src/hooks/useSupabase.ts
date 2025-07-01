import { useState, useCallback } from 'react'

interface UseSupabaseOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useSupabase<T = any>(
  queryFn: () => Promise<T>,
  options?: UseSupabaseOptions
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await queryFn()
      setData(result)
      options?.onSuccess?.(result)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [queryFn, options])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    error,
    loading,
    execute,
    reset,
  }
}