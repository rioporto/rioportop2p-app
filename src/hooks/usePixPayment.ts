'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'

interface PixPayment {
  id: string
  qrCode?: string
  qrCodeText: string
  amount: number
  expiresAt: string
  status?: string
}

interface UsePixPaymentOptions {
  transactionId: string
  amount: number
  customerName: string
  customerDocument: string
  onPaymentConfirmed?: () => void
}

export function usePixPayment({
  transactionId,
  amount,
  customerName,
  customerDocument,
  onPaymentConfirmed
}: UsePixPaymentOptions) {
  const [payment, setPayment] = useState<PixPayment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create PIX payment
  const createPayment = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/pix/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          amount,
          description: `Pagamento P2P - Transação ${transactionId.slice(0, 8)}`,
          customerName,
          customerDocument
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create PIX payment')
      }

      const data = await response.json()
      setPayment(data.payment)

      // Start polling for status
      startPolling(data.payment.id)
    } catch (err) {
      logger.error('Error creating PIX payment:', err)
      setError('Erro ao criar pagamento PIX')
    } finally {
      setLoading(false)
    }
  }

  // Poll for payment status
  const startPolling = (paymentId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/pix/status/${paymentId}`)
        const data = await response.json()

        if (data.payment.status === 'completed') {
          clearInterval(interval)
          onPaymentConfirmed?.()
        } else if (data.payment.status === 'cancelled' || data.payment.status === 'failed') {
          clearInterval(interval)
          setError('Pagamento cancelado ou falhou')
        }

        setPayment(prev => prev ? { ...prev, status: data.payment.status } : null)
      } catch (err) {
        logger.error('Error polling PIX status:', err)
      }
    }, 5000) // Poll every 5 seconds

    // Clear interval on unmount
    return () => clearInterval(interval)
  }

  useEffect(() => {
    createPayment()
  }, []) // Only run once on mount

  return {
    payment,
    loading,
    error,
    retry: createPayment
  }
}