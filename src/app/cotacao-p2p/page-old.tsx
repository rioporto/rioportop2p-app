'use client'

import React, { useState, useEffect } from 'react'

interface Cotacao {
  compra: number
  venda: number
  ultimaAtualizacao: Date
}

interface FormularioCotacao {
  tipo: 'compra' | 'venda'
  valorBRL: string
  valorBTC: string
}

const CotacaoP2P: React.FC = () => {
  // Estado para cotação atual (mockada)
  const [cotacao, setCotacao] = useState<Cotacao>({
    compra: 287500.00,
    venda: 285000.00,
    ultimaAtualizacao: new Date()
  })

  // Estado do formulário
  const [formulario, setFormulario] = useState<FormularioCotacao>({
    tipo: 'compra',
    valorBRL: '',
    valorBTC: ''
  })

  // Estado para erros de validação
  const [erros, setErros] = useState<Record<string, string>>({})

  // Estado para loading
  const [enviando, setEnviando] = useState(false)

  // Atualizar cotação a cada 30 segundos (simulação)
  useEffect(() => {
    const interval = setInterval(() => {
      setCotacao(prev => ({
        compra: prev.compra + (Math.random() - 0.5) * 1000,
        venda: prev.venda + (Math.random() - 0.5) * 1000,
        ultimaAtualizacao: new Date()
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Calculadora automática de Bitcoin
  useEffect(() => {
    if (formulario.valorBRL) {
      const valorReais = parseFloat(formulario.valorBRL.replace(/[^\d,]/g, '').replace(',', '.'))
      if (!isNaN(valorReais)) {
        const taxaAtual = formulario.tipo === 'compra' ? cotacao.compra : cotacao.venda
        const valorBitcoin = valorReais / taxaAtual
        setFormulario(prev => ({
          ...prev,
          valorBTC: valorBitcoin.toFixed(8)
        }))
      }
    } else {
      setFormulario(prev => ({
        ...prev,
        valorBTC: ''
      }))
    }
  }, [formulario.valorBRL, formulario.tipo, cotacao])

  // Formatar valor em reais
  const formatarReais = (valor: string) => {
    const numero = valor.replace(/\D/g, '')
    const valorFormatado = (parseInt(numero) / 100).toFixed(2)
    return valorFormatado.replace('.', ',')
  }

  // Lidar com mudanças no formulário
  const handleChange = (campo: keyof FormularioCotacao, valor: string) => {
    if (campo === 'valorBRL') {
      valor = formatarReais(valor)
    }
    
    setFormulario(prev => ({
      ...prev,
      [campo]: valor
    }))

    // Limpar erro do campo
    if (erros[campo]) {
      setErros(prev => {
        const novosErros = { ...prev }
        delete novosErros[campo]
        return novosErros
      })
    }
  }

  // Validar formulário
  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {}

    if (!formulario.valorBRL) {
      novosErros.valorBRL = 'Por favor, insira um valor'
    } else {
      const valor = parseFloat(formulario.valorBRL.replace(',', '.'))
      if (valor < 100) {
        novosErros.valorBRL = 'Valor mínimo: R$ 100,00'
      } else if (valor > 50000) {
        novosErros.valorBRL = 'Valor máximo: R$ 50.000,00'
      }
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // Enviar cotação para WhatsApp
  const enviarCotacao = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    setEnviando(true)

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Montar mensagem para WhatsApp
    const tipoOperacao = formulario.tipo === 'compra' ? 'COMPRAR' : 'VENDER'
    const valorBRL = formulario.valorBRL
    const valorBTC = formulario.valorBTC
    const taxa = formulario.tipo === 'compra' ? cotacao.compra : cotacao.venda
    
    const mensagem = encodeURIComponent(
      `Olá! Gostaria de ${tipoOperacao} Bitcoin:\n\n` +
      `💰 Valor em Reais: R$ ${valorBRL}\n` +
      `₿ Quantidade BTC: ${valorBTC}\n` +
      `📊 Taxa: R$ ${taxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n` +
      `Por favor, confirme a disponibilidade.`
    )

    // Número de WhatsApp mockado
    const numeroWhatsApp = '5521999999999'
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`

    // Abrir WhatsApp em nova aba
    window.open(urlWhatsApp, '_blank')

    setEnviando(false)

    // Limpar formulário
    setFormulario({
      tipo: 'compra',
      valorBRL: '',
      valorBTC: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Cotação P2P Bitcoin
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Compre e venda Bitcoin de forma rápida e segura
          </p>
        </div>

        {/* Cards de Cotação Atual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Compra</h2>
              <span className="text-green-600 text-2xl">↑</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              R$ {cotacao.compra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Preço para comprar 1 BTC
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Venda</h2>
              <span className="text-red-600 text-2xl">↓</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              R$ {cotacao.venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Preço para vender 1 BTC
            </p>
          </div>
        </div>

        {/* Última atualização */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500">
            Última atualização: {cotacao.ultimaAtualizacao.toLocaleTimeString('pt-BR')}
          </p>
        </div>

        {/* Formulário de Cotação */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Solicitar Cotação
          </h2>

          <form onSubmit={enviarCotacao} className="space-y-6">
            {/* Tipo de Operação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Operação
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleChange('tipo', 'compra')}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    formulario.tipo === 'compra'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Comprar Bitcoin
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('tipo', 'venda')}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    formulario.tipo === 'venda'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Vender Bitcoin
                </button>
              </div>
            </div>

            {/* Valor em Reais */}
            <div>
              <label htmlFor="valorBRL" className="block text-sm font-medium text-gray-700 mb-2">
                Valor em Reais (R$)
              </label>
              <input
                type="text"
                id="valorBRL"
                value={formulario.valorBRL}
                onChange={(e) => handleChange('valorBRL', e.target.value)}
                placeholder="0,00"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  erros.valorBRL ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {erros.valorBRL && (
                <p className="mt-1 text-sm text-red-600">{erros.valorBRL}</p>
              )}
            </div>

            {/* Valor em Bitcoin (calculado automaticamente) */}
            <div>
              <label htmlFor="valorBTC" className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade de Bitcoin (BTC)
              </label>
              <input
                type="text"
                id="valorBTC"
                value={formulario.valorBTC}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg"
                placeholder="0.00000000"
              />
              <p className="mt-1 text-sm text-gray-500">
                Calculado automaticamente com base na cotação atual
              </p>
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={enviando}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                enviando
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {enviando ? 'Enviando...' : 'Enviar Cotação via WhatsApp'}
            </button>
          </form>
        </div>

        {/* Informações sobre Taxas e Limites */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Taxas
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Taxa de serviço: 1.5%</li>
              <li>• Sem taxas ocultas</li>
              <li>• Preço final garantido</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Limites
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Mínimo: R$ 100,00</li>
              <li>• Máximo: R$ 50.000,00</li>
              <li>• Valores maiores sob consulta</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Tempo de Processamento
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• PIX: Instantâneo</li>
              <li>• TED: Até 1 hora</li>
              <li>• Atendimento 24/7</li>
            </ul>
          </div>
        </div>

        {/* Aviso Legal */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Os valores apresentados são apenas para referência. 
            A cotação final será confirmada no momento da transação. Todas as operações são 
            realizadas de acordo com as regulamentações vigentes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CotacaoP2P