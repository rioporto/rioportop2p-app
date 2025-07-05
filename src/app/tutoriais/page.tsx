import { Metadata } from 'next'
import { PlayCircle, BookOpen, FileText, HelpCircle, Clock, Shield, DollarSign, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tutoriais - Rio Porto P2P',
  description: 'Tutoriais em vídeo e guias passo a passo para usar a plataforma Rio Porto P2P.',
}

interface Tutorial {
  id: string
  title: string
  description: string
  duration: string
  category: 'basico' | 'avancado' | 'seguranca' | 'trading'
  icon: any
  videoUrl?: string
  articleUrl?: string
}

const tutorials: Tutorial[] = [
  // Tutoriais Básicos
  {
    id: '1',
    title: 'Como criar sua conta',
    description: 'Aprenda a criar e verificar sua conta na Rio Porto P2P',
    duration: '5 min',
    category: 'basico',
    icon: Users,
    videoUrl: '#',
    articleUrl: '/guia-iniciante#cadastro'
  },
  {
    id: '2',
    title: 'Verificação KYC passo a passo',
    description: 'Entenda como enviar seus documentos para verificação',
    duration: '8 min',
    category: 'basico',
    icon: Shield,
    videoUrl: '#',
    articleUrl: '/kyc'
  },
  {
    id: '3',
    title: 'Sua primeira compra de Bitcoin',
    description: 'Tutorial completo para realizar sua primeira compra',
    duration: '10 min',
    category: 'basico',
    icon: DollarSign,
    videoUrl: '#',
    articleUrl: '/guia-iniciante#como-funciona'
  },
  {
    id: '4',
    title: 'Como vender Bitcoin',
    description: 'Passo a passo para criar ofertas e vender Bitcoin',
    duration: '12 min',
    category: 'basico',
    icon: DollarSign,
    videoUrl: '#',
    articleUrl: '/guia-iniciante#como-funciona'
  },
  
  // Tutoriais de Segurança
  {
    id: '5',
    title: 'Configurando 2FA',
    description: 'Aumente a segurança da sua conta com autenticação de 2 fatores',
    duration: '6 min',
    category: 'seguranca',
    icon: Shield,
    videoUrl: '#',
    articleUrl: '/dashboard/security'
  },
  {
    id: '6',
    title: 'Como funciona o Escrow',
    description: 'Entenda nosso sistema de custódia segura',
    duration: '8 min',
    category: 'seguranca',
    icon: Shield,
    videoUrl: '#',
    articleUrl: '/test-escrow'
  },
  {
    id: '7',
    title: 'Identificando golpes comuns',
    description: 'Aprenda a se proteger contra fraudes',
    duration: '15 min',
    category: 'seguranca',
    icon: Shield,
    videoUrl: '#',
    articleUrl: '/guia-iniciante#seguranca'
  },
  
  // Tutoriais Avançados
  {
    id: '8',
    title: 'Análise de mercado P2P',
    description: 'Como identificar as melhores oportunidades',
    duration: '20 min',
    category: 'avancado',
    icon: BookOpen,
    videoUrl: '#',
    articleUrl: '/cotacao-p2p'
  },
  {
    id: '9',
    title: 'Estratégias de trading P2P',
    description: 'Maximize seus lucros com estratégias profissionais',
    duration: '25 min',
    category: 'avancado',
    icon: BookOpen,
    videoUrl: '#'
  },
  {
    id: '10',
    title: 'Gerenciamento de disputas',
    description: 'Como resolver disputas de forma eficiente',
    duration: '10 min',
    category: 'avancado',
    icon: HelpCircle,
    videoUrl: '#'
  }
]

const categoryInfo = {
  basico: {
    title: 'Tutoriais Básicos',
    description: 'Comece aqui se você é novo na plataforma',
    color: 'blue'
  },
  seguranca: {
    title: 'Segurança',
    description: 'Proteja sua conta e suas transações',
    color: 'green'
  },
  avancado: {
    title: 'Avançado',
    description: 'Para usuários experientes',
    color: 'purple'
  },
  trading: {
    title: 'Trading',
    description: 'Estratégias e análises de mercado',
    color: 'orange'
  }
}

export default function TutoriaisPage() {
  const tutorialsByCategory = tutorials.reduce((acc, tutorial) => {
    if (!acc[tutorial.category]) {
      acc[tutorial.category] = []
    }
    acc[tutorial.category].push(tutorial)
    return acc
  }, {} as Record<string, Tutorial[]>)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <PlayCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Central de Tutoriais
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Aprenda tudo sobre a plataforma com nossos tutoriais em vídeo e guias detalhados
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <PlayCircle className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{tutorials.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Tutoriais</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <Clock className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">2h 30min</div>
            <div className="text-gray-600 dark:text-gray-400">Conteúdo Total</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <BookOpen className="w-10 h-10 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">4</div>
            <div className="text-gray-600 dark:text-gray-400">Categorias</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <Shield className="w-10 h-10 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-gray-600 dark:text-gray-400">Gratuito</div>
          </div>
        </div>

        {/* Featured Tutorial */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-8 text-white mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  Tutorial em Destaque
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Guia Completo: Do Cadastro à Primeira Transação
              </h2>
              <p className="text-lg mb-6">
                Tutorial especial para iniciantes com tudo que você precisa saber para 
                começar a negociar Bitcoin com segurança na Rio Porto P2P.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/guia-iniciante"
                  className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Assistir Agora
                </Link>
                <Link
                  href="/signup"
                  className="bg-orange-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-900 transition-colors"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white/10 rounded-lg p-8">
                <PlayCircle className="w-32 h-32" />
              </div>
            </div>
          </div>
        </div>

        {/* Tutorials by Category */}
        {Object.entries(tutorialsByCategory).map(([category, categoryTutorials]) => {
          const info = categoryInfo[category as keyof typeof categoryInfo]
          return (
            <section key={category} className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{info.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{info.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTutorials.map((tutorial) => {
                  const Icon = tutorial.icon
                  return (
                    <div
                      key={tutorial.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-${info.color}-100 dark:bg-${info.color}-900`}>
                            <Icon className={`w-6 h-6 text-${info.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              {tutorial.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {tutorial.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {tutorial.duration}
                              </span>
                              <div className="flex gap-2">
                                {tutorial.videoUrl && (
                                  <Link
                                    href={tutorial.videoUrl}
                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                                  >
                                    <PlayCircle className="w-4 h-4" />
                                    Vídeo
                                  </Link>
                                )}
                                {tutorial.articleUrl && (
                                  <Link
                                    href={tutorial.articleUrl}
                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Artigo
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

        {/* Help Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <HelpCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Nossa equipe de suporte está disponível 24/7 para ajudar você. 
            Entre em contato através do chat ou visite nossa página de FAQ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/faq"
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Ver FAQ
            </Link>
            <Link
              href="/contato"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Falar com Suporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}