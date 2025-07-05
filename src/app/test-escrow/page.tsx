'use client'

import { useState } from 'react'
import { EscrowStatus } from '@/components/escrow/EscrowStatus'
import { EscrowTimeline } from '@/components/escrow/EscrowTimeline'
import { EscrowTransaction } from '@/lib/escrow/escrow-service'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { Alert } from '@/components/ui/Alert'

// Mock escrow data for testing
const mockEscrows: { [key: string]: EscrowTransaction } = {
  pending: {
    id: '1',
    transactionId: 'trans-1',
    sellerId: 'seller-1',
    buyerId: 'buyer-1',
    cryptoAmount: 0.01,
    cryptoCurrency: 'BTC',
    fiatAmount: 2450.00,
    fiatCurrency: 'BRL',
    status: 'pending',
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    updatedAt: new Date()
  },
  funded: {
    id: '2',
    transactionId: 'trans-2',
    sellerId: 'seller-1',
    buyerId: 'buyer-1',
    cryptoAmount: 0.005,
    cryptoCurrency: 'BTC',
    fiatAmount: 1225.00,
    fiatCurrency: 'BRL',
    status: 'funded',
    escrowAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    fundedAt: new Date(Date.now() - 10 * 60 * 1000),
    expiresAt: new Date(Date.now() + 20 * 60 * 1000),
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    updatedAt: new Date()
  },
  completed: {
    id: '3',
    transactionId: 'trans-3',
    sellerId: 'seller-1',
    buyerId: 'buyer-1',
    cryptoAmount: 0.1,
    cryptoCurrency: 'BTC',
    fiatAmount: 24500.00,
    fiatCurrency: 'BRL',
    status: 'completed',
    escrowAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    fundedAt: new Date(Date.now() - 60 * 60 * 1000),
    paymentConfirmedAt: new Date(Date.now() - 30 * 60 * 1000),
    releasedAt: new Date(Date.now() - 25 * 60 * 1000),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 90 * 60 * 1000),
    updatedAt: new Date()
  }
}

export default function TestEscrowPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('pending')
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer')
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const currentEscrow = mockEscrows[selectedStatus]

  const handleAction = async (action: string) => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    setShowAlert(true)
    
    // Hide alert after 5 seconds
    setTimeout(() => setShowAlert(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Teste do Sistema de Escrow
        </h1>

        {showAlert && (
          <Alert
            type="success"
            title="Ação realizada!"
            dismissible
            onDismiss={() => setShowAlert(false)}
            className="mb-6"
          >
            A ação foi simulada com sucesso. Em produção, isso atualizaria o status do escrow.
          </Alert>
        )}

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Controles de Teste</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status do Escrow</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              >
                <option value="pending">Pendente</option>
                <option value="funded">Financiado</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Papel do Usuário</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as 'buyer' | 'seller')}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              >
                <option value="buyer">Comprador</option>
                <option value="seller">Vendedor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Escrow Status */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Status do Escrow</h2>
            <EscrowStatus escrow={currentEscrow} userRole={userRole} />
            
            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {selectedStatus === 'pending' && userRole === 'seller' && (
                <LoadingButton
                  onClick={() => handleAction('fund')}
                  loading={loading}
                  loadingText="Processando..."
                  fullWidth
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Marcar como Financiado
                </LoadingButton>
              )}
              
              {selectedStatus === 'funded' && userRole === 'buyer' && (
                <LoadingButton
                  onClick={() => handleAction('pay')}
                  loading={loading}
                  loadingText="Processando..."
                  fullWidth
                  className="bg-green-600 hover:bg-green-700"
                >
                  Confirmar Pagamento PIX
                </LoadingButton>
              )}
              
              {selectedStatus === 'funded' && userRole === 'seller' && (
                <LoadingButton
                  onClick={() => handleAction('confirm')}
                  loading={loading}
                  loadingText="Processando..."
                  fullWidth
                  className="bg-green-600 hover:bg-green-700"
                >
                  Confirmar Recebimento
                </LoadingButton>
              )}
              
              {['pending', 'funded'].includes(selectedStatus) && (
                <LoadingButton
                  onClick={() => handleAction('dispute')}
                  loading={loading}
                  loadingText="Processando..."
                  fullWidth
                  className="bg-white dark:bg-gray-800 border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                >
                  Abrir Disputa
                </LoadingButton>
              )}
            </div>
          </div>

          {/* Escrow Timeline */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Linha do Tempo</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <EscrowTimeline escrow={currentEscrow} />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Como funciona o Escrow?</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>O vendedor deposita a criptomoeda em um endereço de custódia seguro</li>
            <li>O comprador realiza o pagamento PIX para o vendedor</li>
            <li>O vendedor confirma o recebimento do pagamento</li>
            <li>O sistema libera automaticamente a criptomoeda para o comprador</li>
            <li>Em caso de disputa, nossa equipe intervém para resolver</li>
          </ol>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-1">Tempo de Expiração</h4>
              <p className="text-gray-600 dark:text-gray-400">30 minutos por padrão</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-1">Taxa de Escrow</h4>
              <p className="text-gray-600 dark:text-gray-400">1% do valor da transação</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-1">Resolução de Disputas</h4>
              <p className="text-gray-600 dark:text-gray-400">24-48 horas úteis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}