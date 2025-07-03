import { useState } from 'react'
import { X, AlertCircle, Upload } from 'lucide-react'

interface DisputeModalProps {
  isOpen: boolean
  onClose: () => void
  transactionId: string
  onDisputeCreated: () => void
}

const disputeReasons = [
  { value: 'payment_not_received', label: 'Pagamento não recebido' },
  { value: 'payment_incorrect', label: 'Valor do pagamento incorreto' },
  { value: 'crypto_not_received', label: 'Criptomoedas não recebidas' },
  { value: 'seller_unresponsive', label: 'Vendedor não responde' },
  { value: 'buyer_unresponsive', label: 'Comprador não responde' },
  { value: 'fraud_suspicion', label: 'Suspeita de fraude' },
  { value: 'other', label: 'Outro motivo' }
]

export default function DisputeModal({ 
  isOpen, 
  onClose, 
  transactionId, 
  onDisputeCreated 
}: DisputeModalProps) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [evidence, setEvidence] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reason || !description.trim()) {
      alert('Por favor, selecione um motivo e descreva o problema.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('transaction_id', transactionId)
      formData.append('reason', reason)
      formData.append('description', description)
      
      evidence.forEach((file, index) => {
        formData.append(`evidence_${index}`, file)
      })

      const response = await fetch(`/api/transactions/${transactionId}/dispute`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to create dispute')

      onDisputeCreated()
    } catch (error) {
      console.error('Error creating dispute:', error)
      alert('Erro ao criar disputa. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setEvidence(prev => [...prev, ...files].slice(0, 5)) // Max 5 files
  }

  const removeFile = (index: number) => {
    setEvidence(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-orange-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Abrir Disputa
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {/* Warning */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Antes de abrir uma disputa, tente resolver o problema diretamente com a 
                  outra parte através do chat. Disputas podem levar tempo para serem resolvidas.
                </p>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motivo da disputa
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Selecione um motivo</option>
                  {disputeReasons.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descreva o problema
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Explique detalhadamente o que aconteceu..."
                  required
                />
              </div>

              {/* Evidence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Evidências (opcional)
                </label>
                
                {evidence.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {evidence.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700 rounded">
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar arquivo
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                </label>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Máximo 5 arquivos • JPG, PNG ou PDF
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || !reason || !description.trim()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Abrir Disputa'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}