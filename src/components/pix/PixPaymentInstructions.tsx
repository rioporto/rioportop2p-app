'use client'

import { useState, useEffect } from 'react'
import { Copy, CheckCircle, Clock, AlertCircle, QrCode, Smartphone } from 'lucide-react'
import { PixQRCodeDisplay } from './PixQRCodeDisplay'
import PixPaymentConfirmation from './PixPaymentConfirmation'
import CountdownTimer from '../transactions/CountdownTimer'
import { supabase } from '@/lib/supabase'

interface PixPaymentInstructionsProps {
  transaction: {
    id: string
    fiat_amount: number
    payment_method: string
    seller_id: string
    created_at: string
  }
  paymentTimeLimit?: number // in minutes
  onPaymentSent: (proofUrl: string, endToEndId?: string) => void
  onCancel: () => void
}

interface PixDetails {
  key_type: string
  key_value: string
  bank_name: string | null
  account_holder_name: string
  qr_code_string?: string
  qr_code_image_url?: string
}

export default function PixPaymentInstructions({
  transaction,
  paymentTimeLimit = 30,
  onPaymentSent,
  onCancel
}: PixPaymentInstructionsProps) {
  const [pixDetails, setPixDetails] = useState<PixDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQRCode, setShowQRCode] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    loadPixDetails()
  }, [transaction.id])

  const loadPixDetails = async () => {
    try {
      // First, check if PIX details already exist for this transaction
      const { data: existingDetails, error: detailsError } = await supabase
        .from('pix_payment_details')
        .select('*')
        .eq('transaction_id', transaction.id)
        .single()

      if (existingDetails && !detailsError) {
        setPixDetails({
          key_type: existingDetails.pix_key_type,
          key_value: existingDetails.pix_key_value,
          bank_name: existingDetails.bank_name,
          account_holder_name: existingDetails.account_holder_name,
          qr_code_string: existingDetails.qr_code_string,
          qr_code_image_url: existingDetails.qr_code_image_url
        })
      } else {
        // Load seller's active PIX key
        const { data: pixKeys, error: keysError } = await supabase
          .from('pix_keys')
          .select('*')
          .eq('user_id', transaction.seller_id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)

        if (keysError || !pixKeys || pixKeys.length === 0) {
          throw new Error('Seller has no active PIX keys')
        }

        const pixKey = pixKeys[0]
        
        // Create PIX payment details for this transaction
        const { data: newDetails, error: createError } = await supabase
          .from('pix_payment_details')
          .insert({
            transaction_id: transaction.id,
            pix_key_id: pixKey.id,
            pix_key_type: pixKey.key_type,
            pix_key_value: pixKey.key_value,
            bank_name: pixKey.bank_name,
            account_holder_name: pixKey.account_holder_name
          })
          .select()
          .single()

        if (createError) throw createError

        setPixDetails({
          key_type: pixKey.key_type,
          key_value: pixKey.key_value,
          bank_name: pixKey.bank_name,
          account_holder_name: pixKey.account_holder_name
        })
      }
    } catch (error) {
      console.error('Error loading PIX details:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(label)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const formatPixKey = (key: string, type: string) => {
    switch (type) {
      case 'cpf':
        return key.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      case 'cnpj':
        return key.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      case 'phone':
        return key.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      default:
        return key
    }
  }

  const getKeyTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      cpf: 'CPF',
      cnpj: 'CNPJ',
      email: 'E-mail',
      phone: 'Telefone',
      random: 'Chave Aleatória'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!pixDetails) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-900 dark:text-white font-medium">
            Erro ao carregar dados de pagamento
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            O vendedor não possui chaves PIX ativas
          </p>
        </div>
      </div>
    )
  }

  if (showConfirmation) {
    return (
      <PixPaymentConfirmation
        transactionId={transaction.id}
        amount={transaction.fiat_amount}
        onConfirm={onPaymentSent}
        onCancel={() => setShowConfirmation(false)}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Timer */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tempo restante para pagamento:
            </span>
          </div>
          <CountdownTimer
            deadline={new Date(new Date(transaction.created_at).getTime() + paymentTimeLimit * 60 * 1000).toISOString()}
            onExpire={onCancel}
          />
        </div>
      </div>

      {/* Payment Method Toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pagamento via PIX
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowQRCode(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showQRCode
                  ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <QrCode className="h-4 w-4 inline mr-1" />
              QR Code
            </button>
            <button
              onClick={() => setShowQRCode(false)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !showQRCode
                  ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Smartphone className="h-4 w-4 inline mr-1" />
              Chave PIX
            </button>
          </div>
        </div>

        {showQRCode ? (
          <PixQRCodeDisplay
            pixKey={pixDetails.key_value}
            pixKeyType={pixDetails.key_type}
            amount={transaction.fiat_amount}
            recipientName={pixDetails.account_holder_name}
            transactionId={transaction.id}
            bankName={pixDetails.bank_name || undefined}
          />
        ) : (
          <div className="space-y-4">
            {/* PIX Key Details */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Dados para Pagamento
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tipo de chave:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getKeyTypeLabel(pixDetails.key_type)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Chave PIX:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPixKey(pixDetails.key_value, pixDetails.key_type)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(pixDetails.key_value, 'pix-key')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {copiedField === 'pix-key' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Nome do destinatário:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {pixDetails.account_holder_name}
                  </span>
                </div>

                {pixDetails.bank_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Banco:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {pixDetails.bank_name}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-600">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Valor a pagar:
                  </span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    R$ {transaction.fiat_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Como fazer o pagamento:
              </h4>
              <ol className="space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium flex items-center justify-center mr-3">
                    1
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Abra o aplicativo do seu banco
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium flex items-center justify-center mr-3">
                    2
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Acesse a área PIX e escolha "Pagar com chave PIX"
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium flex items-center justify-center mr-3">
                    3
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Cole ou digite a chave PIX fornecida acima
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium flex items-center justify-center mr-3">
                    4
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Digite o valor exato de <strong>R$ {transaction.fiat_amount.toFixed(2)}</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium flex items-center justify-center mr-3">
                    5
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Confirme o pagamento e guarde o comprovante
                  </span>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                Atenção:
              </p>
              <ul className="text-yellow-700 dark:text-yellow-400 space-y-1">
                <li>• Transfira exatamente R$ {transaction.fiat_amount.toFixed(2)}</li>
                <li>• Não arredonde o valor</li>
                <li>• Guarde o comprovante do pagamento</li>
                <li>• Você precisará enviar o comprovante na próxima etapa</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => setShowConfirmation(true)}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Já fiz o pagamento
          </button>
        </div>
      </div>
    </div>
  )
}