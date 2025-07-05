'use client'

import { useState, useEffect } from 'react'
import { QrCode, Copy, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface PixQRCodeDisplayProps {
  qrCode?: string
  qrCodeText: string
  pixKey?: string
  pixKeyType?: string
  amount: number
  expiresAt: string
  isManual?: boolean
  onPaymentConfirmed?: () => void
}

export function PixQRCodeDisplay({ 
  qrCode, 
  qrCodeText, 
  pixKey,
  pixKeyType,
  amount, 
  expiresAt,
  isManual = false,
  onPaymentConfirmed 
}: PixQRCodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const expiry = new Date(expiresAt).getTime()
      const difference = expiry - now

      if (difference > 0) {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft('Expirado')
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeText)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pagamento PIX
        </h3>
        <p className="text-3xl font-bold text-orange-600">
          R$ {amount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Tempo restante: {timeLeft}
        </p>
      </div>

      {/* QR Code or Manual Instructions */}
      {isManual ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-400 mb-2">
                Pagamento Manual PIX
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                Faça a transferência PIX para a chave abaixo:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded p-3 border border-yellow-300 dark:border-yellow-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Chave {pixKeyType === 'aleatoria' ? 'PIX Aleatória' : pixKeyType?.toUpperCase() || 'PIX'}
                </p>
                <p className="font-mono text-sm font-bold text-gray-900 dark:text-white break-all">
                  {pixKey || qrCodeText}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : qrCode ? (
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <Image
              src={qrCode}
              alt="PIX QR Code"
              width={200}
              height={200}
              className="w-48 h-48"
            />
          </div>
        </div>
      ) : null}

      {/* PIX Copy and Paste */}
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            PIX Copia e Cola
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={qrCodeText}
              readOnly
              className="flex-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-2">
            Como pagar:
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>1. Abra o app do seu banco</li>
            <li>2. Escolha pagar com PIX</li>
            <li>3. Escaneie o QR Code ou cole o código</li>
            <li>4. Confirme o pagamento</li>
          </ol>
        </div>

        {/* Status */}
        <div className="text-center">
          {isManual ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aguardando confirmação manual do pagamento...
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Um administrador confirmará o pagamento após verificar o recebimento
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aguardando confirmação do pagamento...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}