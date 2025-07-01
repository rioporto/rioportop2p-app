'use client'

import { useState } from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react'

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  views: number
  helpful: number
  notHelpful: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const mockFAQs: FAQ[] = [
  {
    id: 1,
    question: 'Como funciona a negociação P2P de Bitcoin?',
    answer: 'A negociação P2P (peer-to-peer) permite que você compre e venda Bitcoin diretamente com outros usuários, sem intermediários. Nossa plataforma conecta compradores e vendedores, garantindo segurança através de um sistema de custódia temporária.',
    category: 'Geral',
    views: 1523,
    helpful: 432,
    notHelpful: 12,
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: 2,
    question: 'Quais são as taxas cobradas pela plataforma?',
    answer: 'As taxas variam de acordo com o nível KYC do usuário:\n- Nível 1: 3.5% (limite R$ 4.999/mês)\n- Nível 2: 2.5% (limite R$ 50.000/mês)\n- Nível 3: 1.5% (limite R$ 100.000/mês)\nPara valores acima, as taxas são negociáveis.',
    category: 'Taxas',
    views: 2341,
    helpful: 789,
    notHelpful: 23,
    isActive: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-02-15',
  },
  {
    id: 3,
    question: 'Quanto tempo demora para completar uma transação?',
    answer: 'O tempo varia conforme o método de pagamento:\n- PIX: Instantâneo a 10 minutos\n- TED: 30 minutos a 2 horas\n- Transferência bancária: 1 a 24 horas\nApós confirmação do pagamento, os Bitcoins são liberados imediatamente.',
    category: 'Transações',
    views: 1876,
    helpful: 543,
    notHelpful: 34,
    isActive: true,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
  {
    id: 4,
    question: 'Como faço para aumentar meu nível KYC?',
    answer: 'Para aumentar seu nível KYC:\n1. Acesse Configurações > Verificação\n2. Envie os documentos solicitados\n3. Complete a verificação facial\n4. Aguarde aprovação (até 48h)\nCada nível exige documentação adicional.',
    category: 'KYC',
    views: 923,
    helpful: 234,
    notHelpful: 8,
    isActive: true,
    createdAt: '2024-01-18',
    updatedAt: '2024-02-01',
  },
  {
    id: 5,
    question: 'É seguro negociar na plataforma?',
    answer: 'Sim! Utilizamos várias camadas de segurança:\n- Sistema de custódia temporária\n- Verificação KYC obrigatória\n- Sistema de reputação\n- Suporte 24/7\n- Seguro contra fraudes\nTodas as transações são monitoradas.',
    category: 'Segurança',
    views: 3456,
    helpful: 1234,
    notHelpful: 45,
    isActive: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-25',
  },
]

const categories = ['Todos', 'Geral', 'Transações', 'Taxas', 'KYC', 'Segurança', 'Pagamentos']

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState(mockFAQs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const toggleActive = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
    ))
  }

  const deleteFAQ = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
      setFaqs(faqs.filter(faq => faq.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FAQ - Perguntas Frequentes</h1>
        <button 
          onClick={() => {
            setEditingFAQ(null)
            setShowModal(true)
          }}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Pergunta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total de Perguntas</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{faqs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total de Visualizações</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {faqs.reduce((sum, faq) => sum + faq.views, 0).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Utilidade</p>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(
              (faqs.reduce((sum, faq) => sum + faq.helpful, 0) / 
              faqs.reduce((sum, faq) => sum + faq.helpful + faq.notHelpful, 0) * 100)
            )}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Perguntas Ativas</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {faqs.filter(faq => faq.isActive).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar perguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <HelpCircle className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {faq.category}
                    </span>
                    <span>{faq.views} visualizações</span>
                    <span className="text-green-600">{faq.helpful} útil</span>
                    <span className="text-red-600">{faq.notHelpful} não útil</span>
                    <span className={faq.isActive ? 'text-green-600' : 'text-red-600'}>
                      {faq.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(faq.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {faq.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingFAQ(faq)
                      setShowModal(true)
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteFAQ(faq.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {expandedId === faq.id && (
                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {faq.answer}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Criado em: {new Date(faq.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span>Atualizado em: {new Date(faq.updatedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingFAQ ? 'Editar Pergunta' : 'Nova Pergunta'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              setShowModal(false)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pergunta
                  </label>
                  <input
                    type="text"
                    defaultValue={editingFAQ?.question}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resposta
                  </label>
                  <textarea
                    rows={6}
                    defaultValue={editingFAQ?.answer}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoria
                  </label>
                  <select
                    defaultValue={editingFAQ?.category || 'Geral'}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                  >
                    {categories.filter(cat => cat !== 'Todos').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    defaultChecked={editingFAQ?.isActive ?? true}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Pergunta ativa
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  {editingFAQ ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}