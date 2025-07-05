'use client'

import { useState } from 'react'
import { Search, BookOpen } from 'lucide-react'

interface Term {
  term: string
  definition: string
  category: 'crypto' | 'p2p' | 'financeiro' | 'seguranca'
}

const terms: Term[] = [
  // Termos de Criptomoedas
  {
    term: 'Bitcoin (BTC)',
    definition: 'A primeira e mais conhecida criptomoeda descentralizada, criada em 2009. Permite transações diretas sem intermediários.',
    category: 'crypto' as const
  },
  {
    term: 'Blockchain',
    definition: 'Tecnologia de registro distribuído que armazena transações de forma imutável e transparente em blocos conectados.',
    category: 'crypto' as const
  },
  {
    term: 'Wallet (Carteira)',
    definition: 'Software ou hardware usado para armazenar, enviar e receber criptomoedas. Contém suas chaves privadas.',
    category: 'crypto' as const
  },
  {
    term: 'Hash',
    definition: 'Identificador único de uma transação na blockchain, como um código de rastreamento.',
    category: 'crypto' as const
  },
  {
    term: 'Satoshi',
    definition: 'A menor unidade de Bitcoin. 1 Bitcoin = 100.000.000 satoshis.',
    category: 'crypto' as const
  },
  {
    term: 'Altcoin',
    definition: 'Qualquer criptomoeda que não seja Bitcoin. Exemplos: Ethereum, Litecoin, etc.',
    category: 'crypto' as const
  },
  {
    term: 'HODL',
    definition: 'Estratégia de manter criptomoedas a longo prazo, independente das flutuações de preço.',
    category: 'crypto' as const
  },
  
  // Termos P2P
  {
    term: 'P2P (Peer-to-Peer)',
    definition: 'Modelo de negociação direta entre pessoas, sem intermediários centralizados.',
    category: 'p2p' as const
  },
  {
    term: 'Escrow',
    definition: 'Sistema de custódia onde um terceiro confiável mantém os fundos até que ambas as partes cumpram o acordo.',
    category: 'p2p' as const
  },
  {
    term: 'Maker',
    definition: 'Usuário que cria uma oferta de compra ou venda na plataforma.',
    category: 'p2p' as const
  },
  {
    term: 'Taker',
    definition: 'Usuário que aceita uma oferta existente de compra ou venda.',
    category: 'p2p' as const
  },
  {
    term: 'Order Book',
    definition: 'Lista de todas as ofertas de compra e venda disponíveis na plataforma.',
    category: 'p2p' as const
  },
  {
    term: 'Spread',
    definition: 'Diferença entre o preço de compra e venda. Quanto menor, melhor para o trader.',
    category: 'p2p' as const
  },
  {
    term: 'Reputação',
    definition: 'Sistema de avaliação baseado no histórico de transações bem-sucedidas do usuário.',
    category: 'p2p' as const
  },
  
  // Termos Financeiros
  {
    term: 'PIX',
    definition: 'Sistema de pagamento instantâneo brasileiro que funciona 24/7.',
    category: 'financeiro' as const
  },
  {
    term: 'TED',
    definition: 'Transferência Eletrônica Disponível. Pagamento bancário que demora até 1 dia útil.',
    category: 'financeiro' as const
  },
  {
    term: 'Cotação',
    definition: 'Preço atual de mercado de uma criptomoeda em relação ao real brasileiro.',
    category: 'financeiro' as const
  },
  {
    term: 'Volatilidade',
    definition: 'Medida da variação de preço de um ativo. Bitcoin é conhecido por alta volatilidade.',
    category: 'financeiro' as const
  },
  {
    term: 'Liquidez',
    definition: 'Facilidade de comprar ou vender um ativo sem afetar significativamente seu preço.',
    category: 'financeiro' as const
  },
  {
    term: 'Taxa de Câmbio',
    definition: 'Relação de valor entre duas moedas, como BTC/BRL.',
    category: 'financeiro' as const
  },
  {
    term: 'Ágio',
    definition: 'Valor adicional cobrado acima do preço de mercado.',
    category: 'financeiro' as const
  },
  
  // Termos de Segurança
  {
    term: 'KYC',
    definition: 'Know Your Customer (Conheça Seu Cliente). Processo de verificação de identidade obrigatório.',
    category: 'seguranca' as const
  },
  {
    term: '2FA',
    definition: 'Autenticação de Dois Fatores. Camada extra de segurança além da senha.',
    category: 'seguranca' as const
  },
  {
    term: 'Phishing',
    definition: 'Tentativa de golpe onde criminosos se passam por empresas legítimas para roubar dados.',
    category: 'seguranca' as const
  },
  {
    term: 'Chave Privada',
    definition: 'Código secreto que permite acessar e movimentar suas criptomoedas. Nunca compartilhe!',
    category: 'seguranca' as const
  },
  {
    term: 'Chave Pública',
    definition: 'Endereço que você compartilha para receber criptomoedas, como um número de conta.',
    category: 'seguranca' as const
  },
  {
    term: 'Cold Wallet',
    definition: 'Carteira offline para armazenamento seguro de criptomoedas a longo prazo.',
    category: 'seguranca' as const
  },
  {
    term: 'Hot Wallet',
    definition: 'Carteira conectada à internet, mais conveniente mas menos segura que cold wallet.',
    category: 'seguranca' as const
  }
].sort((a, b) => a.term.localeCompare(b.term))

const categoryInfo = {
  crypto: { name: 'Criptomoedas', color: 'blue' },
  p2p: { name: 'Trading P2P', color: 'green' },
  financeiro: { name: 'Financeiro', color: 'orange' },
  seguranca: { name: 'Segurança', color: 'red' }
}

export default function GlossarioPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group terms by first letter
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(term)
    return acc
  }, {} as Record<string, Term[]>)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Glossário de Termos
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Entenda todos os termos técnicos usados no mundo das criptomoedas e trading P2P
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar termo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Todos
              </button>
              {Object.entries(categoryInfo).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {info.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Terms count */}
        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredTerms.length} termos encontrados
          </p>
        </div>

        {/* Alphabet Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => {
              const hasTerms = Object.keys(groupedTerms).includes(letter)
              return (
                <button
                  key={letter}
                  onClick={() => {
                    const element = document.getElementById(`letter-${letter}`)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  disabled={!hasTerms}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    hasTerms
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </div>

        {/* Terms List */}
        <div className="space-y-8">
          {Object.entries(groupedTerms).map(([letter, letterTerms]) => (
            <div key={letter} id={`letter-${letter}`}>
              <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
                {letter}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {letterTerms.map((term) => {
                  const category = categoryInfo[term.category]
                  return (
                    <div
                      key={term.term}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {term.term}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full bg-${category.color}-100 dark:bg-${category.color}-900 text-${category.color}-600 dark:text-${category.color}-300`}>
                          {category.name}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {term.definition}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Nenhum termo encontrado para sua busca.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Não encontrou o que procurava?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Entre em contato com nosso suporte ou visite nossa seção de tutoriais
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tutoriais"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Ver Tutoriais
            </a>
            <a
              href="/faq"
              className="bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Perguntas Frequentes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}