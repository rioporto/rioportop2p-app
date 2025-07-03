'use client'

import { useState, useEffect } from 'react'
import { Copy, CheckCircle, Download, Info } from 'lucide-react'
import QRCode from 'qrcode'

interface PixQRCodeDisplayProps {
  pixKey: string
  pixKeyType: string
  amount: number
  recipientName: string
  transactionId: string
  bankName?: string
}

export default function PixQRCodeDisplay({
  pixKey,
  pixKeyType,
  amount,
  recipientName,
  transactionId,
  bankName
}: PixQRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  // Generate PIX copy-paste string
  const generatePixString = () => {
    // This is a simplified version. In production, use proper PIX EMV format
    return `00020126330014BR.GOV.BCB.PIX01${pixKey.length.toString().padStart(2, '0')}${pixKey}52040000530398654${amount.toFixed(2).length.toString().padStart(2, '0')}${amount.toFixed(2)}5802BR59${recipientName.length.toString().padStart(2, '0')}${recipientName}6009SAO PAULO62${(transactionId.length + 4).toString().padStart(2, '0')}05${transactionId.length.toString().padStart(2, '0')}${transactionId}6304`
  }

  const pixString = generatePixString()

  useEffect(() => {
    // Generate QR Code
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(pixString, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeUrl(url)
      } catch (err) {
        console.error('Error generating QR code:', err)
      } finally {
        setLoading(false)
      }
    }

    generateQR()
  }, [pixString])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQRCode = () => {
    const link = document.createElement('a')
    link.download = `pix-qrcode-${transactionId}.png`
    link.href = qrCodeUrl
    link.click()
  }

  const formatPixKey = (key: string, type: string) => {
    switch (type) {
      case 'cpf':
        return key.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      case 'cnpj':
        return key.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      case 'phone':
        return key.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      default:
        return key
    }
  }

  const getPixKeyTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      cpf: 'CPF',
      cnpj: 'CNPJ',
      email: 'E-mail',
      phone: 'Telefone',
      random: 'Chave Aleatória'
    }
    return labels[type] || type
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          QR Code PIX
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Escaneie o código ou copie o código PIX
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        {loading ? (
          <div className="w-[300px] h-[300px] bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse" />
        ) : (
          <div className="relative">
            <img 
              src={qrCodeUrl} 
              alt="PIX QR Code" 
              className="rounded-lg shadow-lg"
            />
            <button
              onClick={downloadQRCode}
              className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              title="Baixar QR Code"
            >
              <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* PIX Details */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Valor:</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                R$ {amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Destinatário:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {recipientName}
              </span>
            </div>
            {bankName && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Banco:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {bankName}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Chave {getPixKeyTypeLabel(pixKeyType)}:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatPixKey(pixKey, pixKeyType)}
              </span>
            </div>
          </div>
        </div>

        {/* Copy PIX Code */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-2">
            PIX Copia e Cola
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={pixString}
              readOnly
              className="flex-1 p-2 text-xs font-mono bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-800 rounded-lg select-all"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
              Como pagar:
            </p>
            <ol className="text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
              <li>Abra o app do seu banco</li>
              <li>Acesse a área PIX</li>
              <li>Escaneie o QR Code ou use o PIX Copia e Cola</li>
              <li>Confirme os dados e o valor</li>
              <li>Finalize o pagamento</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}