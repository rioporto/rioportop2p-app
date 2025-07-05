import { Check, Clock, Lock, DollarSign, AlertCircle } from 'lucide-react'
import { EscrowTransaction } from '@/lib/escrow/escrow-service'

interface EscrowTimelineProps {
  escrow: EscrowTransaction
}

interface TimelineStep {
  title: string
  description: string
  icon: any
  status: 'completed' | 'active' | 'pending'
  timestamp?: Date
}

export function EscrowTimeline({ escrow }: EscrowTimelineProps) {
  const getTimelineSteps = (): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        title: 'Escrow Criado',
        description: 'Transação iniciada com segurança',
        icon: Lock,
        status: 'completed',
        timestamp: escrow.createdAt
      }
    ]

    // Add funded step
    if (escrow.fundedAt || ['funded', 'payment_pending', 'payment_confirmed', 'completed'].includes(escrow.status)) {
      steps.push({
        title: 'Criptomoeda Depositada',
        description: 'Vendedor depositou no escrow',
        icon: Lock,
        status: 'completed',
        timestamp: escrow.fundedAt
      })
    } else if (escrow.status === 'pending') {
      steps.push({
        title: 'Aguardando Depósito',
        description: 'Vendedor deve depositar a criptomoeda',
        icon: Clock,
        status: 'active',
      })
    }

    // Add payment step
    if (['payment_confirmed', 'completed'].includes(escrow.status)) {
      steps.push({
        title: 'Pagamento Confirmado',
        description: 'Vendedor confirmou recebimento do PIX',
        icon: DollarSign,
        status: 'completed',
        timestamp: escrow.paymentConfirmedAt
      })
    } else if (['funded', 'payment_pending'].includes(escrow.status)) {
      steps.push({
        title: 'Aguardando Pagamento',
        description: escrow.status === 'funded' 
          ? 'Comprador deve realizar o PIX'
          : 'Vendedor deve confirmar o recebimento',
        icon: DollarSign,
        status: 'active',
      })
    }

    // Add release step
    if (escrow.status === 'completed' && escrow.releasedAt) {
      steps.push({
        title: 'Criptomoeda Liberada',
        description: 'Transação concluída com sucesso',
        icon: Check,
        status: 'completed',
        timestamp: escrow.releasedAt
      })
    } else if (escrow.status === 'payment_confirmed') {
      steps.push({
        title: 'Liberando Criptomoeda',
        description: 'Processando liberação automática',
        icon: Clock,
        status: 'active',
      })
    }

    // Add dispute step if applicable
    if (escrow.status === 'disputed' && escrow.disputedAt) {
      steps.push({
        title: 'Disputa Aberta',
        description: 'Aguardando resolução do suporte',
        icon: AlertCircle,
        status: 'active',
        timestamp: escrow.disputedAt
      })
    }

    // Add cancellation step if applicable
    if (escrow.status === 'cancelled') {
      steps.push({
        title: 'Transação Cancelada',
        description: 'Escrow cancelado',
        icon: AlertCircle,
        status: 'completed',
        timestamp: escrow.updatedAt
      })
    }

    return steps
  }

  const steps = getTimelineSteps()

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isLast = index === steps.length - 1

        return (
          <div key={index} className="flex gap-4">
            {/* Icon and line */}
            <div className="flex flex-col items-center">
              <div className={`
                p-2 rounded-full
                ${step.status === 'completed' ? 'bg-green-100 dark:bg-green-900' : ''}
                ${step.status === 'active' ? 'bg-blue-100 dark:bg-blue-900' : ''}
                ${step.status === 'pending' ? 'bg-gray-100 dark:bg-gray-800' : ''}
              `}>
                <Icon className={`
                  w-5 h-5
                  ${step.status === 'completed' ? 'text-green-600' : ''}
                  ${step.status === 'active' ? 'text-blue-600' : ''}
                  ${step.status === 'pending' ? 'text-gray-400' : ''}
                `} />
              </div>
              
              {!isLast && (
                <div className={`
                  w-0.5 h-16 -mt-2
                  ${step.status === 'completed' ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-200 dark:bg-gray-700'}
                `} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <h4 className={`
                font-medium
                ${step.status === 'completed' ? 'text-gray-900 dark:text-gray-100' : ''}
                ${step.status === 'active' ? 'text-blue-600 dark:text-blue-400' : ''}
                ${step.status === 'pending' ? 'text-gray-400' : ''}
              `}>
                {step.title}
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {step.description}
              </p>
              
              {step.timestamp && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {step.timestamp.toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}