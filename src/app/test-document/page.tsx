'use client'

import { useState } from 'react'
import { DocumentInput } from '@/components/ui/DocumentInput'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { Alert } from '@/components/ui/Alert'

export default function TestDocumentPage() {
  const [document, setDocument] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [docType, setDocType] = useState<'cpf' | 'cnpj' | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid) {
      alert('Por favor, insira um CPF ou CNPJ válido')
      return
    }

    setLoading(true)
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    setShowAlert(true)
    
    // Remove alerta após 5 segundos
    setTimeout(() => setShowAlert(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Teste de Validação de Documento
          </h1>

          {showAlert && (
            <Alert
              type="success"
              title="Documento válido!"
              dismissible
              onDismiss={() => setShowAlert(false)}
              className="mb-6"
            >
              O {docType?.toUpperCase()} {document} foi validado com sucesso.
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <DocumentInput
              value={document}
              onChange={(value, valid, type) => {
                setDocument(value)
                setIsValid(valid)
                setDocType(type)
              }}
              label="Documento"
              placeholder="Digite seu CPF ou CNPJ"
              required
            />

            {isValid && (
              <Alert type="info">
                Documento detectado: <strong>{docType?.toUpperCase()}</strong>
              </Alert>
            )}

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Validando..."
              fullWidth
              disabled={!isValid}
            >
              Validar Documento
            </LoadingButton>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recursos do componente:
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>✓ Validação em tempo real de CPF e CNPJ</li>
              <li>✓ Formatação automática ao sair do campo</li>
              <li>✓ Detecção automática do tipo de documento</li>
              <li>✓ Feedback visual (ícones e cores)</li>
              <li>✓ Mensagens de erro contextuais</li>
              <li>✓ Suporte a dark mode</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Dica:</strong> Experimente digitar um CPF (11 dígitos) ou CNPJ (14 dígitos). 
              O componente detectará automaticamente o tipo e aplicará a formatação correta.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}