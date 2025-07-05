import { Clock, CheckCircle, AlertCircle, XCircle, Lock, DollarSign } from 'lucide-react'
import { EscrowTransaction } from '@/lib/escrow/escrow-service'

interface EscrowStatusProps {
  escrow: EscrowTransaction
  userRole: 'buyer' | 'seller'
}

export function EscrowStatus({ escrow, userRole }: EscrowStatusProps) {
  const getStatusInfo = () => {
    switch (escrow.status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900',
          title: 'Aguardando Depósito',
          description: userRole === 'seller' 
            ? 'Deposite a criptomoeda no endereço de escrow'
            : 'Aguardando o vendedor depositar a criptomoeda'
        }
      
      case 'funded':
        return {
          icon: Lock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 dark:bg-blue-900',
          title: 'Criptomoeda em Custódia',
          description: userRole === 'buyer'
            ? 'Realize o pagamento PIX para o vendedor'
            : 'Aguardando pagamento do comprador'
        }
      
      case 'payment_pending':
        return {
          icon: DollarSign,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 dark:bg-orange-900',
          title: 'Pagamento Pendente',
          description: userRole === 'seller'
            ? 'Verifique o recebimento do PIX e confirme'
            : 'Aguardando confirmação do vendedor'
        }
      
      case 'payment_confirmed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900',
          title: 'Pagamento Confirmado',
          description: 'Liberando criptomoeda para o comprador...'
        }
      
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900',
          title: 'Transação Concluída',
          description: 'Criptomoeda liberada com sucesso!'
        }
      
      case 'disputed':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100 dark:bg-red-900',
          title: 'Em Disputa',
          description: 'Aguardando resolução da equipe de suporte'
        }
      
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 dark:bg-gray-900',
          title: 'Cancelada',
          description: 'Transação cancelada'
        }
      
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 dark:bg-gray-900',
          title: 'Status Desconhecido',
          description: ''
        }
    }
  }

  const statusInfo = getStatusInfo()
  const Icon = statusInfo.icon

  // Calculate time remaining
  const timeRemaining = escrow.expiresAt.getTime() - new Date().getTime()
  const minutesRemaining = Math.floor(timeRemaining / 60000)
  const isExpiring = minutesRemaining < 10 && minutesRemaining > 0

  return (
    <div className={`rounded-lg p-6 ${statusInfo.bgColor}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${statusInfo.bgColor}`}>
          <Icon className={`w-6 h-6 ${statusInfo.color}`} />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${statusInfo.color}`}>
            {statusInfo.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {statusInfo.description}
          </p>
          
          {/* Show time remaining for active escrows */}
          {['pending', 'funded', 'payment_pending'].includes(escrow.status) && timeRemaining > 0 && (
            <div className={`mt-3 text-sm ${isExpiring ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
              <Clock className="inline-block w-4 h-4 mr-1" />
              Expira em {minutesRemaining} minutos
            </div>
          )}
          
          {/* Escrow details */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Valor em Custódia:</span>
              <span className="font-medium">
                {escrow.cryptoAmount} {escrow.cryptoCurrency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Valor PIX:</span>
              <span className="font-medium">
                R$ {escrow.fiatAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          {/* Escrow address for seller */}
          {userRole === 'seller' && escrow.status === 'pending' && escrow.escrowAddress && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-md">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Endereço de Escrow:
              </p>
              <p className="font-mono text-xs break-all">
                {escrow.escrowAddress}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}