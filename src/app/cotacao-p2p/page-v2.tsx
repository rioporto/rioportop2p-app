'use client'

import React, { useState, useEffect } from 'react'
import { useWhatsApp } from '@/lib/whatsapp'

interface PriceData {
  symbol: string
  price: number
  change24h: number
}

export default function CotacaoP2PV2() {
  const { sendMessage, numbers, templates } = useWhatsApp()
  
  // Estados
  const [loading, setLoading] = useState(false)
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [formData, setFormData] = useState({
    tipo: 'compra' as 'compra' | 'venda',
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    crypto: 'BTC',
    valorBRL: '',
    quantidade: '',
    paymentMethod: 'PIX',
    receivingMethod: 'PIX'
  })

  // Buscar cotação ao carregar
  useEffect(() => {
    fetchPrice()
    const interval = setInterval(fetchPrice, 60000) // Atualiza a cada minuto
    return () => clearInterval(interval)
  }, [formData.crypto])

  const fetchPrice = async () => {
    try {
      const response = await fetch(`/api/cotacao?symbol=${formData.crypto}`)
      const data = await response.json()
      if (data.success && data.data) {
        setPriceData({
          symbol: formData.crypto,
          price: data.data.price,
          change24h: data.data.change24h
        })
      }
    } catch (error) {
      console.error('Erro ao buscar cotação:', error)
    }
  }

  // Calcular valores
  const calculateValues = () => {
    if (!priceData || !formData.valorBRL) return { quantity: 0, total: 0 }
    
    const valorBRL = parseFloat(formData.valorBRL.replace(/[^\d,]/g, '').replace(',', '.'))
    const taxa = formData.tipo === 'compra' ? 1.025 : 0.975 // 2.5% de spread
    const priceWithSpread = priceData.price * taxa
    const quantity = valorBRL / priceWithSpread
    
    return {
      quantity,
      total: valorBRL,
      priceWithSpread
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { quantity, total, priceWithSpread } = calculateValues()

    // Montar mensagem completa
    const messageData = {
      name: formData.nome,
      cpf: formData.cpf,
      amount: parseFloat(formData.valorBRL.replace(/[^\d,]/g, '').replace(',', '.')),
      crypto: formData.crypto,
      cryptoAmount: quantity,
      price: priceWithSpread || 0,
      total: total,
      ...(formData.tipo === 'compra' 
        ? { paymentMethod: formData.paymentMethod }
        : { receivingMethod: formData.receivingMethod }
      )
    }

    // Usar o template apropriado
    const message = formData.tipo === 'compra' 
      ? templates.quoteBuy(messageData)
      : templates.quoteSell(messageData as any)

    // Enviar para WhatsApp
    sendMessage(numbers.main, message)
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Cotação P2P</h1>
        
        {/* Display de Preço */}
        <div className="bg-card rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            {formData.crypto}/BRL
          </h2>
          {priceData ? (
            <>
              <p className="text-4xl font-bold">
                R$ {priceData.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-lg mt-2 ${priceData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceData.change24h >= 0 ? '+' : ''}{priceData.change24h.toFixed(2)}% (24h)
              </p>
            </>
          ) : (
            <p>Carregando cotação...</p>
          )}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 space-y-6">
          {/* Tipo de Operação */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipo: 'compra' })}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                formData.tipo === 'compra'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Comprar
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipo: 'venda' })}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                formData.tipo === 'venda'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Vender
            </button>
          </div>

          {/* Seleção de Cripto */}
          <div>
            <label className="block text-sm font-medium mb-2">Criptomoeda</label>
            <select
              value={formData.crypto}
              onChange={(e) => setFormData({ ...formData, crypto: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="BNB">Binance Coin (BNB)</option>
              <option value="SOL">Solana (SOL)</option>
              <option value="XRP">Ripple (XRP)</option>
              <option value="ADA">Cardano (ADA)</option>
              <option value="DOGE">Dogecoin (DOGE)</option>
            </select>
          </div>

          {/* Dados Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome Completo *</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CPF</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefone</label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="(21) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Valor em Reais (R$) *
            </label>
            <input
              type="text"
              required
              value={formData.valorBRL}
              onChange={(e) => setFormData({ ...formData, valorBRL: e.target.value })}
              className="w-full p-3 border rounded-lg text-lg"
              placeholder="1.000,00"
            />
            {formData.valorBRL && priceData && (
              <p className="text-sm text-gray-600 mt-2">
                ≈ {calculateValues().quantity.toFixed(8)} {formData.crypto}
              </p>
            )}
          </div>

          {/* Método de Pagamento/Recebimento */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {formData.tipo === 'compra' ? 'Forma de Pagamento' : 'Forma de Recebimento'}
            </label>
            <select
              value={formData.tipo === 'compra' ? formData.paymentMethod : formData.receivingMethod}
              onChange={(e) => setFormData({ 
                ...formData, 
                [formData.tipo === 'compra' ? 'paymentMethod' : 'receivingMethod']: e.target.value 
              })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="PIX">PIX</option>
              <option value="TED">TED</option>
              <option value="Dinheiro">Dinheiro (Presencial)</option>
              <option value="Transferência Bancária">Transferência Bancária</option>
            </select>
          </div>

          {/* Resumo */}
          {formData.valorBRL && priceData && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumo da Operação</h3>
              <div className="space-y-1 text-sm">
                <p>Tipo: <strong>{formData.tipo === 'compra' ? 'COMPRA' : 'VENDA'}</strong></p>
                <p>Cripto: <strong>{formData.crypto}</strong></p>
                <p>Quantidade: <strong>{calculateValues().quantity.toFixed(8)} {formData.crypto}</strong></p>
                <p>Valor: <strong>R$ {formData.valorBRL}</strong></p>
                <p>Taxa P2P: <strong>2.5%</strong></p>
                <p className="pt-2 border-t">
                  Total: <strong className="text-lg">
                    R$ {calculateValues().total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>
                </p>
              </div>
            </div>
          )}

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={loading || !formData.nome || !formData.valorBRL}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Enviar Cotação via WhatsApp'}
          </button>
        </form>

        {/* Avisos */}
        <div className="mt-8 text-sm text-gray-600 space-y-2">
          <p>• Valor mínimo: R$ 100,00</p>
          <p>• Valor máximo: R$ 50.000,00 (acima disso, use nosso serviço OTC)</p>
          <p>• Taxa P2P de 2.5% já incluída no cálculo</p>
          <p>• Atendimento das 9h às 18h (dias úteis)</p>
        </div>
      </div>
    </div>
  )
}