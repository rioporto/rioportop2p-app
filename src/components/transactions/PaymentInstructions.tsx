import { useState } from 'react'
import { Copy, CheckCircle, ExternalLink, Info } from 'lucide-react'

interface PaymentInstructionsProps {
  transaction: {
    id: string
    payment_method: string
    fiat_amount: number
    seller: {
      full_name: string
    }
    order: {
      payment_time_limit: number
    }
  }
  onPaymentSent: () => void
}

interface PaymentDetails {
  [key: string]: {
    title: string
    fields: Array<{
      label: string
      value: string
      copyable?: boolean
    }>
    instructions: string[]
  }
}

// Mock payment details - in a real app, this would come from the seller's payment settings
const mockPaymentDetails: PaymentDetails = {
  PIX: {
    title: 'Pagamento via PIX',
    fields: [
      { label: 'Chave PIX (CPF)', value: '123.456.789-00', copyable: true },
      { label: 'Nome', value: 'João Silva' },
      { label: 'Banco', value: 'Banco do Brasil' }
    ],
    instructions: [
      'Abra o aplicativo do seu banco',
      'Acesse a área PIX',
      'Escolha pagar com chave PIX',
      'Cole ou digite a chave PIX acima',
      'Confira o nome do destinatário',
      'Digite o valor exato da transação',
      'Confirme o pagamento'
    ]
  },
  TED: {
    title: 'Pagamento via TED',
    fields: [
      { label: 'Banco', value: 'Banco do Brasil (001)' },
      { label: 'Agência', value: '1234-5', copyable: true },
      { label: 'Conta', value: '12345-6', copyable: true },
      { label: 'Nome', value: 'João Silva' },
      { label: 'CPF', value: '123.456.789-00', copyable: true }
    ],
    instructions: [
      'Acesse o app ou internet banking do seu banco',
      'Selecione a opção TED',
      'Insira os dados bancários acima',
      'Digite o valor exato da transação',
      'Adicione o ID da transação na descrição',
      'Confirme o pagamento'
    ]
  },
  bank_transfer: {
    title: 'Transferência Bancária',
    fields: [
      { label: 'Banco', value: 'Itaú' },
      { label: 'Agência', value: '0001', copyable: true },
      { label: 'Conta Corrente', value: '12345-6', copyable: true },
      { label: 'Nome', value: 'João Silva' },
      { label: 'CNPJ/CPF', value: '123.456.789-00', copyable: true }
    ],
    instructions: [
      'Faça login no seu internet banking',
      'Selecione transferência para outro banco',
      'Insira os dados bancários fornecidos',
      'Digite o valor exato da transação',
      'Confirme todos os dados antes de finalizar',
      'Guarde o comprovante'
    ]
  }
}

export default function PaymentInstructions({ transaction, onPaymentSent }: PaymentInstructionsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const paymentDetails = mockPaymentDetails[transaction.payment_method] || mockPaymentDetails['PIX']

  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(label)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handlePaymentConfirmation = () => {
    if (confirmed) {
      onPaymentSent()
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Instruções de Pagamento
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Siga as instruções abaixo para realizar o pagamento
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Valor a pagar</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {transaction.fiat_amount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment Method Details */}
      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
          {paymentDetails.title}
        </h3>
        
        <div className="space-y-2">
          {paymentDetails.fields.map((field) => (
            <div key={field.label} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {field.label}:
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {field.value}
                </span>
                {field.copyable && (
                  <button
                    onClick={() => copyToClipboard(field.value, field.label)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {copiedField === field.label ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step by step instructions */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
          Passo a passo:
        </h3>
        <ol className="space-y-2">
          {paymentDetails.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium flex items-center justify-center mr-3">
                {index + 1}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {instruction}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Important notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
              Importante:
            </p>
            <ul className="text-yellow-700 dark:text-yellow-400 space-y-1">
              <li>• Transfira exatamente R$ {transaction.fiat_amount.toFixed(2)}</li>
              <li>• Use apenas o método de pagamento selecionado</li>
              <li>• Guarde o comprovante de pagamento</li>
              <li>• Você tem {transaction.order.payment_time_limit} minutos para concluir</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
        <label className="flex items-start mb-4">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Confirmo que realizei o pagamento de R$ {transaction.fiat_amount.toFixed(2)} 
            para {transaction.seller.full_name} usando {paymentDetails.title.toLowerCase()}
          </span>
        </label>

        <button
          onClick={handlePaymentConfirmation}
          disabled={!confirmed}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-colors
            ${confirmed
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Marquei como Pago
        </button>
      </div>
    </div>
  )
}