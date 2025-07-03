'use client'

import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PixPaymentConfirmationProps {
  transactionId: string
  amount: number
  onConfirm: (proofUrl: string, endToEndId?: string) => void
  onCancel: () => void
}

export default function PixPaymentConfirmation({
  transactionId,
  amount,
  onConfirm,
  onCancel
}: PixPaymentConfirmationProps) {
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [endToEndId, setEndToEndId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setError('Arquivo inválido. Use JPG, PNG ou PDF.')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Tamanho máximo: 5MB')
      return
    }

    setError('')
    setUploadFile(file)
  }

  const uploadProofFile = async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${transactionId}/${Date.now()}.${fileExt}`
    const filePath = `payment-proofs/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async () => {
    if (!uploadFile) {
      setError('Por favor, selecione um comprovante')
      return
    }

    try {
      setUploading(true)
      setError('')

      // Upload the file
      const proofUrl = await uploadProofFile(uploadFile)

      // Call the confirmation callback
      onConfirm(proofUrl, endToEndId || undefined)
    } catch (err) {
      console.error('Error uploading proof:', err)
      setError('Erro ao enviar comprovante. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Confirmar Pagamento PIX
      </h3>

      <div className="mb-6">
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
            Valor do pagamento:
          </p>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">
            R$ {amount.toFixed(2)}
          </p>
        </div>

        {/* End-to-End ID Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID da Transação PIX (E2E) - Opcional
          </label>
          <input
            type="text"
            value={endToEndId}
            onChange={(e) => setEndToEndId(e.target.value)}
            placeholder="Ex: E12345678202312311234567890123456"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            O ID E2E pode ser encontrado no comprovante PIX
          </p>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comprovante de Pagamento *
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6">
            <input
              type="file"
              id="payment-proof"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <label
              htmlFor="payment-proof"
              className="cursor-pointer flex flex-col items-center"
            >
              {uploadFile ? (
                <>
                  <FileText className="h-8 w-8 text-orange-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {uploadFile.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {(uploadFile.size / 1024).toFixed(1)} KB
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Clique para selecionar o comprovante
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    JPG, PNG ou PDF (máx. 5MB)
                  </span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                Importante:
              </p>
              <ul className="text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Envie apenas comprovantes reais de pagamento</li>
                <li>• O comprovante deve mostrar o valor exato de R$ {amount.toFixed(2)}</li>
                <li>• Informações falsas podem resultar em suspensão da conta</li>
                <li>• O vendedor verificará o pagamento antes de liberar a criptomoeda</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={uploading}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!uploadFile || uploading}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            !uploadFile || uploading
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Confirmar Pagamento
            </>
          )}
        </button>
      </div>
    </div>
  )
}