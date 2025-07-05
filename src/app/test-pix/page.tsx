'use client'

import { useState } from 'react'
import { PixQRCodeDisplay } from '@/components/pix/PixQRCodeDisplay'
import { usePixPayment } from '@/hooks/usePixPayment'

export default function TestPixPage() {
  const [showPayment, setShowPayment] = useState(false)
  const [testData] = useState({
    transactionId: `test-${Date.now()}`,
    amount: 10.00,
    customerName: 'Teste Silva',
    customerDocument: '123.456.789-00'
  })

  const { payment, loading, error } = usePixPayment({
    ...testData,
    onPaymentConfirmed: () => {
      alert('Pagamento confirmado!')
    }
  })

  const createTestPayment = async () => {
    setShowPayment(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Teste do Sistema PIX
        </h1>

        {!showPayment ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Criar Pagamento de Teste
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Clique no botão abaixo para simular um pagamento PIX de R$ 10,00
            </p>
            <button
              onClick={createTestPayment}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Criar Pagamento PIX
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {loading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Criando pagamento...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-red-600 dark:text-red-400">
                Erro: {error}
              </div>
            )}

            {payment && !loading && (
              <div>
                <PixQRCodeDisplay
                  qrCode={payment.qrCode}
                  qrCodeText={payment.qrCodeText || payment.pixKey}
                  pixKey={payment.pixKey}
                  pixKeyType={payment.pixKeyType}
                  amount={payment.amount}
                  expiresAt={payment.expiresAt}
                  isManual={payment.isManual}
                />

                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-3">
                    Instruções para Teste:
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-300">
                    <li>Copie a chave PIX acima</li>
                    <li>Faça uma transferência de R$ 10,00 (ou simule)</li>
                    <li>Acesse <a href="/admin/pix-payments" className="underline font-semibold">Admin → Pagamentos PIX</a></li>
                    <li>Confirme o pagamento manualmente</li>
                    <li>O sistema atualizará o status automaticamente</li>
                  </ol>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID do Pagamento: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{payment.id}</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}