import { useState, useRef } from 'react'
import { Upload, X, Check, FileText, Image, Loader2 } from 'lucide-react'

interface PaymentProofUploadProps {
  transactionId: string
  onUploadComplete: () => void
}

export default function PaymentProofUpload({ transactionId, onUploadComplete }: PaymentProofUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  const maxFileSize = 5 * 1024 * 1024 // 5MB

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!acceptedFileTypes.includes(selectedFile.type)) {
      alert('Tipo de arquivo não suportado. Use JPG, PNG ou PDF.')
      return
    }

    // Validate file size
    if (selectedFile.size > maxFileSize) {
      alert('Arquivo muito grande. O tamanho máximo é 5MB.')
      return
    }

    setFile(selectedFile)

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('transaction_id', transactionId)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Upload file
      const response = await fetch(`/api/transactions/${transactionId}/proof`, {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) throw new Error('Upload failed')

      // Success
      setTimeout(() => {
        onUploadComplete()
      }, 500)
    } catch (error) {
      console.error('Error uploading proof:', error)
      alert('Erro ao enviar comprovante. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Enviar Comprovante de Pagamento
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Faça upload do comprovante de pagamento para que o vendedor possa confirmar o recebimento.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/jpg,application/pdf"
        className="hidden"
      />

      {!file ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Clique para selecionar o arquivo
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            JPG, PNG ou PDF • Máximo 5MB
          </p>
        </button>
      ) : (
        <div>
          {/* File preview */}
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-4">
              {preview ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {uploadProgress}% enviado
                    </p>
                  </div>
                )}
              </div>

              {!uploading && (
                <button
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center
                ${!uploading
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Enviar Comprovante
                </>
              )}
            </button>

            {!uploading && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Trocar arquivo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
          Dicas para um bom comprovante:
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• O valor do pagamento deve estar visível</li>
          <li>• Data e hora devem estar legíveis</li>
          <li>• Nome do destinatário deve aparecer</li>
          <li>• Evite cortar informações importantes</li>
        </ul>
      </div>
    </div>
  )
}