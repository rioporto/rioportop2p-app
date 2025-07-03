import { Check, Clock, AlertCircle, XCircle } from 'lucide-react'

interface TimelineEvent {
  id: string
  title: string
  description?: string
  timestamp: string
  status: 'completed' | 'current' | 'pending' | 'cancelled'
  icon?: React.ReactNode
}

interface TransactionTimelineProps {
  transaction: {
    status: string
    created_at: string
    payment_sent_at?: string
    payment_confirmed_at?: string
    completed_at?: string
    cancelled_at?: string
    disputed_at?: string
    dispute_reason?: string
  }
}

export default function TransactionTimeline({ transaction }: TransactionTimelineProps) {
  const getTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [
      {
        id: 'created',
        title: 'Transação Criada',
        description: 'A transação foi iniciada e está aguardando pagamento',
        timestamp: transaction.created_at,
        status: 'completed',
        icon: <Check className="h-4 w-4" />
      }
    ]

    // Payment sent
    if (transaction.payment_sent_at) {
      events.push({
        id: 'payment_sent',
        title: 'Pagamento Enviado',
        description: 'O comprador informou que o pagamento foi realizado',
        timestamp: transaction.payment_sent_at,
        status: 'completed',
        icon: <Check className="h-4 w-4" />
      })
    } else if (transaction.status === 'pending') {
      events.push({
        id: 'payment_sent',
        title: 'Aguardando Pagamento',
        description: 'O comprador deve realizar o pagamento',
        timestamp: '',
        status: 'current',
        icon: <Clock className="h-4 w-4" />
      })
    }

    // Payment confirmed
    if (transaction.payment_confirmed_at) {
      events.push({
        id: 'payment_confirmed',
        title: 'Pagamento Confirmado',
        description: 'O vendedor confirmou o recebimento do pagamento',
        timestamp: transaction.payment_confirmed_at,
        status: 'completed',
        icon: <Check className="h-4 w-4" />
      })
    } else if (transaction.status === 'payment_sent') {
      events.push({
        id: 'payment_confirmed',
        title: 'Aguardando Confirmação',
        description: 'O vendedor está verificando o pagamento',
        timestamp: '',
        status: 'current',
        icon: <Clock className="h-4 w-4" />
      })
    }

    // Completed
    if (transaction.completed_at) {
      events.push({
        id: 'completed',
        title: 'Transação Concluída',
        description: 'As criptomoedas foram liberadas para o comprador',
        timestamp: transaction.completed_at,
        status: 'completed',
        icon: <Check className="h-4 w-4" />
      })
    } else if (transaction.status === 'payment_confirmed') {
      events.push({
        id: 'completed',
        title: 'Liberação Pendente',
        description: 'Aguardando liberação das criptomoedas',
        timestamp: '',
        status: 'current',
        icon: <Clock className="h-4 w-4" />
      })
    }

    // Cancelled
    if (transaction.cancelled_at) {
      events.push({
        id: 'cancelled',
        title: 'Transação Cancelada',
        description: 'A transação foi cancelada',
        timestamp: transaction.cancelled_at,
        status: 'cancelled',
        icon: <XCircle className="h-4 w-4" />
      })
    }

    // Disputed
    if (transaction.disputed_at) {
      events.push({
        id: 'disputed',
        title: 'Disputa Aberta',
        description: transaction.dispute_reason || 'Uma disputa foi aberta para esta transação',
        timestamp: transaction.disputed_at,
        status: 'cancelled',
        icon: <AlertCircle className="h-4 w-4" />
      })
    }

    return events
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const events = getTimelineEvents()

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Linha do Tempo
      </h2>

      <div className="relative">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4 pb-8 last:pb-0">
            {/* Icon and line */}
            <div className="relative flex flex-col items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2
                ${event.status === 'completed' ? 'bg-green-100 border-green-500 text-green-600 dark:bg-green-900/20 dark:border-green-600 dark:text-green-400' : ''}
                ${event.status === 'current' ? 'bg-orange-100 border-orange-500 text-orange-600 dark:bg-orange-900/20 dark:border-orange-600 dark:text-orange-400' : ''}
                ${event.status === 'pending' ? 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500' : ''}
                ${event.status === 'cancelled' ? 'bg-red-100 border-red-500 text-red-600 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400' : ''}
              `}>
                {event.icon}
              </div>
              {index < events.length - 1 && (
                <div className={`
                  absolute top-10 w-0.5 h-full
                  ${event.status === 'completed' ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
                `} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {event.description}
                </p>
              )}
              {event.timestamp && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatTimestamp(event.timestamp)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}