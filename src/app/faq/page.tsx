'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "O que é Bitcoin P2P?",
    answer: "Bitcoin P2P (peer-to-peer) é um método de negociação direta entre compradores e vendedores de Bitcoin, sem a necessidade de uma exchange centralizada. Na Rio Porto P2P, conectamos compradores e vendedores verificados, proporcionando segurança e melhores taxas.",
    category: "Básico"
  },
  {
    id: 2,
    question: "Como funciona o processo de compra?",
    answer: "1. Crie sua conta e complete o KYC\n2. Escolha um vendedor verificado\n3. Inicie uma negociação\n4. Faça o pagamento conforme instruído\n5. Receba seus Bitcoins após confirmação do vendedor\n\nTodo o processo é mediado pela plataforma para garantir segurança.",
    category: "Transações"
  },
  {
    id: 3,
    question: "Quais métodos de pagamento são aceitos?",
    answer: "Aceitamos: PIX, Transferência Bancária (TED/DOC), Dinheiro em espécie (para transações presenciais) e Cartões pré-pagos. Cada vendedor pode especificar seus métodos preferidos.",
    category: "Pagamentos"
  },
  {
    id: 4,
    question: "É seguro comprar Bitcoin P2P?",
    answer: "Sim! Implementamos várias camadas de segurança:\n- KYC obrigatório para todos os usuários\n- Sistema de reputação e avaliações\n- Escrow para garantir as transações\n- Suporte 24/7 para resolver disputas\n- Verificação de identidade em transações grandes",
    category: "Segurança"
  },
  {
    id: 5,
    question: "Qual é a taxa cobrada pela plataforma?",
    answer: "Cobramos uma taxa de 1% sobre o valor da transação para compradores e 0.5% para vendedores. Não há taxas de cadastro ou manutenção de conta.",
    category: "Taxas"
  },
  {
    id: 6,
    question: "Como faço para vender Bitcoin?",
    answer: "1. Complete seu cadastro e KYC\n2. Crie um anúncio de venda com seu preço e condições\n3. Aguarde compradores interessados\n4. Quando alguém iniciar uma negociação, seus Bitcoins ficam em escrow\n5. Após confirmar o recebimento do pagamento, libere os Bitcoins",
    category: "Transações"
  },
  {
    id: 7,
    question: "O que é KYC e por que é necessário?",
    answer: "KYC (Know Your Customer) é o processo de verificação de identidade. É necessário para:\n- Prevenir fraudes e lavagem de dinheiro\n- Criar um ambiente seguro de negociação\n- Cumprir com regulamentações locais\n- Proteger todos os usuários da plataforma",
    category: "Segurança"
  },
  {
    id: 8,
    question: "Posso cancelar uma transação?",
    answer: "Transações podem ser canceladas apenas se ambas as partes concordarem e se o pagamento ainda não foi realizado. Após o pagamento, entre em contato com nosso suporte para mediação.",
    category: "Transações"
  },
  {
    id: 9,
    question: "Qual o limite de transação?",
    answer: "Limites variam de acordo com seu nível de verificação:\n- Nível 1 (KYC básico): R$ 5.000/dia\n- Nível 2 (KYC completo): R$ 50.000/dia\n- Nível 3 (KYC avançado): Sem limite\n\nVendedores podem definir seus próprios limites mínimos e máximos.",
    category: "Limites"
  },
  {
    id: 10,
    question: "Como funciona o sistema de reputação?",
    answer: "Após cada transação, compradores e vendedores se avaliam mutuamente. A reputação é baseada em:\n- Número de transações realizadas\n- Avaliações recebidas (1-5 estrelas)\n- Taxa de conclusão de negócios\n- Tempo de resposta\n- Ausência de disputas",
    category: "Básico"
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

  const categories = ['Todos', ...Array.from(new Set(faqItems.map(item => item.category)))]
  
  const filteredItems = selectedCategory === 'Todos' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory)

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">
          Perguntas Frequentes
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Tire suas dúvidas sobre Bitcoin P2P e nossa plataforma
        </p>

        {/* Filtros de categoria */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Accordion FAQ */}
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
              >
                <span className="font-medium text-lg">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openItems.includes(item.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4 text-gray-300 whitespace-pre-line">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-gray-400 mb-6">
            Nossa equipe está pronta para ajudar você
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contato"
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Fale Conosco
            </a>
            <a
              href="/cursos"
              className="px-8 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
            >
              Aprenda Mais
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}