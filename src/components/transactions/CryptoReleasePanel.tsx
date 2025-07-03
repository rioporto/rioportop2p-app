import { useState } from 'react'
import { Shield, AlertCircle, CheckCircle, ExternalLink, Loader2 } from 'lucide-react'

interface CryptoReleasePanelProps {
  transaction: {
    id: string
    crypto_amount: number
    fiat_amount: number
    payment_proof_url?: string
    buyer_crypto_address?: string
    buyer: {
      full_name: string
    }
    crypto: {
      symbol: string
      name: string
    }
  }
  onRelease: () => void
}

export default function CryptoReleasePanel({ transaction, onRelease }: CryptoReleasePanelProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [releasing, setReleasing] = useState(false)
  const [showProof, setShowProof] = useState(false)

  const handleRelease = async () => {
    if (!confirmed) return
    
    setReleasing(true)
    try {
      // In a real app, this would trigger the smart contract or escrow release
      await new Promise(resolve => setTimeout(resolve, 2000))
      onRelease()
    } catch (error) {
      console.error('Error releasing crypto:', error)
    } finally {
      setReleasing(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Liberar Criptomoedas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Confirme o recebimento do pagamento antes de liberar
          </p>
        </div>
        <Shield className="h-8 w-8 text-green-500" />
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
          Resumo do Pagamento
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Comprador:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {transaction.buyer.full_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Valor esperado:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              R$ {transaction.fiat_amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Crypto a liberar:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {transaction.crypto_amount} {transaction.crypto.symbol}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Proof */}
      {transaction.payment_proof_url && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Comprovante de Pagamento
            </h3>
            <button
              onClick={() => setShowProof(!showProof)}
              className="text-sm text-orange-500 hover:text-orange-600"
            >
              {showProof ? 'Ocultar' : 'Ver comprovante'}
            </button>
          </div>
          
          {showProof && (
            <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <img 
                src={transaction.payment_proof_url} 
                alt="Comprovante de pagamento"
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      )}

      {/* Buyer's wallet address */}
      {transaction.buyer_crypto_address && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Endereço de Destino
          </h3>
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
            <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
              {transaction.buyer_crypto_address}
            </code>
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
          Antes de liberar, verifique:
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              O valor recebido corresponde exatamente ao esperado
            </span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              O pagamento foi confirmado em sua conta bancária
            </span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              O nome do pagador corresponde ao comprador
            </span>
          </li>
        </ul>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
              Atenção:
            </p>
            <p className="text-yellow-700 dark:text-yellow-400">
              A liberação das criptomoedas é irreversível. Certifique-se de que o pagamento 
              foi realmente recebido antes de prosseguir.
            </p>
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
            Confirmo que recebi o pagamento de R$ {transaction.fiat_amount.toFixed(2)} 
            e autorizo a liberação de {transaction.crypto_amount} {transaction.crypto.symbol}
          </span>
        </label>

        <button
          onClick={handleRelease}
          disabled={!confirmed || releasing}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center
            ${confirmed && !releasing
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {releasing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Liberando...
            </>
          ) : (
            <>
              <Shield className="h-5 w-5 mr-2" />
              Liberar Criptomoedas
            </>
          )}
        </button>
      </div>
    </div>
  )
}