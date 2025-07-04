'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaQuestionCircle,
  FaBook,
  FaVideo,
  FaTicketAlt,
  FaComments,
  FaServer,
  FaChevronDown,
  FaChevronRight,
  FaPlay,
  FaFileAlt,
  FaLifeRing,
  FaUserShield,
  FaWallet,
  FaExchangeAlt,
  FaShieldAlt,
  FaCreditCard,
  FaMobileAlt,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClock,
  FaLightbulb,
  FaGraduationCap,
  FaRocket,
  FaHeadset,
  FaClipboardList,
  FaChartLine,
  FaUsers,
  FaGlobe,
  FaCog,
  FaDownload,
  FaUpload,
  FaHistory,
  FaBell,
  FaKey,
  FaIdCard,
  FaMoneyBillWave,
  FaHandshake,
  FaBalanceScale,
  FaNewspaper,
  FaQuoteLeft,
  FaStar,
  FaArrowRight,
  FaExternalLinkAlt,
  FaPaperPlane
} from 'react-icons/fa';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  icon: React.ReactNode;
  views: number;
  helpful: number;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  embedId: string;
  duration: string;
  category: string;
}

interface SystemStatus {
  service: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: string;
  lastCheck: string;
}

interface SupportTicket {
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  description: string;
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState<SupportTicket>({
    subject: '',
    priority: 'medium',
    category: 'general',
    description: ''
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);

  // Categorias de ajuda
  const categories = [
    { id: 'all', name: 'Todos', icon: <FaBook /> },
    { id: 'account', name: 'Conta e Segurança', icon: <FaUserShield /> },
    { id: 'trading', name: 'Negociação P2P', icon: <FaExchangeAlt /> },
    { id: 'wallet', name: 'Carteira e Saldo', icon: <FaWallet /> },
    { id: 'payment', name: 'Pagamentos', icon: <FaCreditCard /> },
    { id: 'security', name: 'Segurança', icon: <FaShieldAlt /> },
    { id: 'verification', name: 'Verificação KYC', icon: <FaIdCard /> }
  ];

  // FAQ categorizado
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Como criar uma conta na plataforma?',
      answer: 'Para criar uma conta, clique em "Cadastrar" no canto superior direito. Preencha seus dados pessoais, e-mail e crie uma senha forte. Após o cadastro, você receberá um e-mail de confirmação. Clique no link para ativar sua conta.',
      category: 'account'
    },
    {
      id: '2',
      question: 'Como funciona a negociação P2P?',
      answer: 'A negociação P2P permite que você compre e venda criptomoedas diretamente com outros usuários. Você pode criar ofertas ou aceitar ofertas existentes. O sistema de escrow garante a segurança da transação.',
      category: 'trading'
    },
    {
      id: '3',
      question: 'Quais são as taxas da plataforma?',
      answer: 'Nossa plataforma cobra uma taxa de 1% sobre cada transação P2P concluída. Não há taxas para depósitos, mas saques podem ter taxas variáveis dependendo do método escolhido.',
      category: 'payment'
    },
    {
      id: '4',
      question: 'Como ativar a autenticação de dois fatores (2FA)?',
      answer: 'Acesse Configurações > Segurança > Autenticação de Dois Fatores. Baixe um aplicativo autenticador como Google Authenticator ou Authy. Escaneie o QR Code e insira o código gerado para ativar.',
      category: 'security'
    },
    {
      id: '5',
      question: 'O que é KYC e por que preciso fazer?',
      answer: 'KYC (Know Your Customer) é um processo de verificação de identidade obrigatório para garantir a segurança e conformidade regulatória. Você precisará enviar documentos como RG/CNH e comprovante de residência.',
      category: 'verification'
    },
    {
      id: '6',
      question: 'Como fazer um depósito via PIX?',
      answer: 'Acesse sua carteira, clique em "Depositar" e selecione PIX. Gere um QR Code ou copie a chave PIX. Faça a transferência pelo seu banco e o valor será creditado automaticamente em até 5 minutos.',
      category: 'payment'
    },
    {
      id: '7',
      question: 'O que fazer se minha transação está travada?',
      answer: 'Se uma transação P2P estiver travada, primeiro tente contatar o outro usuário pelo chat. Se não resolver, abra uma disputa clicando em "Reportar Problema" na página da transação.',
      category: 'trading'
    },
    {
      id: '8',
      question: 'Como proteger minha conta contra hackers?',
      answer: 'Use uma senha forte e única, ative 2FA, nunca compartilhe suas credenciais, verifique sempre o URL do site, mantenha seu e-mail seguro e monitore regularmente suas atividades de login.',
      category: 'security'
    }
  ];

  // Artigos da base de conhecimento
  const articles: Article[] = [
    {
      id: '1',
      title: 'Guia Completo para Iniciantes em P2P',
      description: 'Aprenda tudo sobre negociação P2P, desde o básico até estratégias avançadas.',
      category: 'trading',
      readTime: '10 min',
      icon: <FaGraduationCap />,
      views: 15420,
      helpful: 1289
    },
    {
      id: '2',
      title: 'Configurando sua Carteira Digital',
      description: 'Passo a passo para configurar e gerenciar sua carteira com segurança.',
      category: 'wallet',
      readTime: '5 min',
      icon: <FaWallet />,
      views: 8932,
      helpful: 756
    },
    {
      id: '3',
      title: 'Verificação KYC: Documentos Necessários',
      description: 'Lista completa de documentos e dicas para aprovação rápida.',
      category: 'verification',
      readTime: '3 min',
      icon: <FaIdCard />,
      views: 12304,
      helpful: 1045
    },
    {
      id: '4',
      title: 'Segurança: Melhores Práticas',
      description: 'Proteja sua conta e seus fundos com estas dicas essenciais.',
      category: 'security',
      readTime: '7 min',
      icon: <FaShieldAlt />,
      views: 9876,
      helpful: 892
    },
    {
      id: '5',
      title: 'Resolvendo Disputas em Transações',
      description: 'Como lidar com problemas em transações P2P de forma eficaz.',
      category: 'trading',
      readTime: '6 min',
      icon: <FaBalanceScale />,
      views: 6543,
      helpful: 567
    },
    {
      id: '6',
      title: 'Métodos de Pagamento Aceitos',
      description: 'Conheça todos os métodos de pagamento disponíveis na plataforma.',
      category: 'payment',
      readTime: '4 min',
      icon: <FaCreditCard />,
      views: 11234,
      helpful: 923
    }
  ];

  // Vídeos tutoriais
  const videoTutorials: VideoTutorial[] = [
    {
      id: '1',
      title: 'Como Criar sua Primeira Oferta P2P',
      description: 'Tutorial completo sobre criação de ofertas de compra e venda.',
      embedId: 'dQw4w9WgXcQ',
      duration: '8:45',
      category: 'trading'
    },
    {
      id: '2',
      title: 'Verificação KYC em 5 Minutos',
      description: 'Processo rápido e simples de verificação de identidade.',
      embedId: 'dQw4w9WgXcQ',
      duration: '5:12',
      category: 'verification'
    },
    {
      id: '3',
      title: 'Configurando 2FA na sua Conta',
      description: 'Aumente a segurança com autenticação de dois fatores.',
      embedId: 'dQw4w9WgXcQ',
      duration: '3:30',
      category: 'security'
    },
    {
      id: '4',
      title: 'Depositando e Sacando com PIX',
      description: 'Guia visual para transações PIX na plataforma.',
      embedId: 'dQw4w9WgXcQ',
      duration: '6:20',
      category: 'payment'
    }
  ];

  // Status do sistema
  useEffect(() => {
    // Simular verificação de status do sistema
    const services: SystemStatus[] = [
      { service: 'Plataforma P2P', status: 'operational', uptime: '99.98%', lastCheck: 'Há 1 min' },
      { service: 'Sistema de Pagamentos', status: 'operational', uptime: '99.95%', lastCheck: 'Há 2 min' },
      { service: 'API de Cotações', status: 'operational', uptime: '99.99%', lastCheck: 'Há 30s' },
      { service: 'Verificação KYC', status: 'operational', uptime: '99.90%', lastCheck: 'Há 3 min' },
      { service: 'Suporte ao Cliente', status: 'operational', uptime: '100%', lastCheck: 'Há 1 min' },
      { service: 'Sistema de E-mails', status: 'operational', uptime: '99.97%', lastCheck: 'Há 5 min' }
    ];
    setSystemStatus(services);
  }, []);

  // Filtrar artigos e FAQs baseado na busca e categoria
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredVideos = videoTutorials.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para enviar o ticket
    console.log('Ticket enviado:', ticketForm);
    setShowTicketForm(false);
    setTicketForm({ subject: '', priority: 'medium', category: 'general', description: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <FaCheckCircle />;
      case 'degraded': return <FaExclamationTriangle />;
      case 'down': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Central de Ajuda</h1>
            <p className="text-gray-300 text-lg">Como podemos ajudar você hoje?</p>
          </div>

          {/* Barra de busca */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar artigos, tutoriais, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: <FaLightbulb /> },
            { id: 'articles', label: 'Artigos', icon: <FaFileAlt /> },
            { id: 'faq', label: 'FAQ', icon: <FaQuestionCircle /> },
            { id: 'videos', label: 'Vídeos', icon: <FaVideo /> },
            { id: 'support', label: 'Suporte', icon: <FaHeadset /> },
            { id: 'status', label: 'Status', icon: <FaServer /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo das abas */}
        <AnimatePresence mode="wait">
          {/* Visão Geral */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {/* Card de Início Rápido */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <FaRocket className="text-green-500 text-2xl" />
                  <h3 className="text-xl font-bold text-white">Início Rápido</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-300 hover:text-green-400 cursor-pointer transition-colors">
                    <FaArrowRight className="text-sm" />
                    <span>Como criar uma conta</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300 hover:text-green-400 cursor-pointer transition-colors">
                    <FaArrowRight className="text-sm" />
                    <span>Verificar identidade (KYC)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300 hover:text-green-400 cursor-pointer transition-colors">
                    <FaArrowRight className="text-sm" />
                    <span>Fazer primeiro depósito</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300 hover:text-green-400 cursor-pointer transition-colors">
                    <FaArrowRight className="text-sm" />
                    <span>Criar primeira oferta P2P</span>
                  </li>
                </ul>
              </div>

              {/* Card de Recursos Populares */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <FaStar className="text-yellow-500 text-2xl" />
                  <h3 className="text-xl font-bold text-white">Mais Populares</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-300 hover:text-green-400 cursor-pointer transition-colors">
                    <FaArrowRight className="text-sm" />
                    <span>Guia de segurança</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300 hover:text-green-400 cursor-pointer transition-colors">
                    <FaArrowRight className="text-sm" />
                    <span>Taxas e limites</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300 hover:text-green-400 cursor-pointer transition-colors">
                    <FaArrowRight className="text-sm" />
                    <span>Resolver disputas</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300 hover:text-green-400 cursor-pointer transition-colors">
                    <FaArrowRight className="text-sm" />
                    <span>Métodos de pagamento</span>
                  </li>
                </ul>
              </div>

              {/* Card de Contato Rápido */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <FaHeadset className="text-blue-500 text-2xl" />
                  <h3 className="text-xl font-bold text-white">Contato Rápido</h3>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => setIsLiveChatOpen(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaComments />
                    <span>Chat ao Vivo</span>
                  </button>
                  <button
                    onClick={() => setShowTicketForm(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaTicketAlt />
                    <span>Abrir Ticket</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaClock />
                    <span>Tempo médio de resposta: 2h</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Artigos */}
          {activeTab === 'articles' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-green-500 text-3xl group-hover:scale-110 transition-transform">
                      {article.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{article.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaClock />
                      {article.readTime}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FaUsers />
                        {article.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaLightbulb />
                        {article.helpful.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/30 transition-colors"
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaChevronDown className="text-gray-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-4 bg-gray-700/20 border-t border-gray-700">
                            <p className="text-gray-300">{faq.answer}</p>
                            <div className="mt-4 flex items-center gap-4">
                              <button className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-1">
                                <FaLightbulb />
                                Útil
                              </button>
                              <button className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
                                <FaTimesCircle />
                                Não útil
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Vídeos */}
          {activeTab === 'videos' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700"
                >
                  <div className="relative aspect-video bg-gray-900">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.embedId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{video.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{video.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {video.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaPlay />
                        Tutorial
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Suporte */}
          {activeTab === 'support' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Opções de suporte */}
              <div className="space-y-6">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Canais de Suporte</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsLiveChatOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-lg flex items-center justify-between px-6 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <FaComments className="text-2xl" />
                        <div className="text-left">
                          <div className="font-semibold">Chat ao Vivo</div>
                          <div className="text-sm opacity-90">Resposta imediata</div>
                        </div>
                      </div>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => setShowTicketForm(true)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg flex items-center justify-between px-6 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <FaTicketAlt className="text-2xl" />
                        <div className="text-left">
                          <div className="font-semibold">Abrir Ticket</div>
                          <div className="text-sm opacity-90">Resposta em até 24h</div>
                        </div>
                      </div>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
                      <FaEnvelope className="text-gray-400 text-xl" />
                      <div>
                        <div className="text-white font-medium">E-mail</div>
                        <div className="text-gray-400 text-sm">suporte@rioportop2p.com</div>
                      </div>
                    </div>

                    <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
                      <FaPhone className="text-gray-400 text-xl" />
                      <div>
                        <div className="text-white font-medium">Telefone</div>
                        <div className="text-gray-400 text-sm">0800 123 4567</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horário de atendimento */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Horário de Atendimento</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Segunda a Sexta</span>
                      <span className="text-green-400 font-medium">08:00 - 22:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Sábado</span>
                      <span className="text-green-400 font-medium">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Domingo</span>
                      <span className="text-yellow-400 font-medium">10:00 - 16:00</span>
                    </div>
                    <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/50">
                      <p className="text-blue-300 text-sm flex items-center gap-2">
                        <FaLightbulb />
                        Chat ao vivo disponível 24/7 com IA
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulário de ticket */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Enviar Mensagem</h3>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Assunto</label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="Descreva brevemente o problema"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Categoria</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                    >
                      <option value="general">Geral</option>
                      <option value="account">Conta</option>
                      <option value="trading">Negociação</option>
                      <option value="payment">Pagamento</option>
                      <option value="security">Segurança</option>
                      <option value="technical">Técnico</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Prioridade</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Descrição</label>
                    <textarea
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                      placeholder="Descreva detalhadamente o problema..."
                      rows={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <FaPaperPlane />
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Status do Sistema */}
          {activeTab === 'status' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Status dos Serviços</h3>
                  <div className="flex items-center gap-2 text-green-400">
                    <FaCheckCircle />
                    <span className="font-medium">Todos os sistemas operacionais</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {systemStatus.map((service, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`text-2xl ${getStatusColor(service.status)}`}>
                          {getStatusIcon(service.status)}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{service.service}</h4>
                          <p className="text-gray-400 text-sm">Última verificação: {service.lastCheck}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                          {service.status === 'operational' ? 'Operacional' :
                           service.status === 'degraded' ? 'Degradado' : 'Fora do ar'}
                        </div>
                        <div className="text-gray-400 text-sm">Uptime: {service.uptime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Histórico de incidentes */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Histórico de Incidentes</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">Manutenção programada concluída</h4>
                      <span className="text-gray-400 text-sm">2 dias atrás</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Atualização de segurança realizada com sucesso sem interrupções.
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">Lentidão no sistema de pagamentos</h4>
                      <span className="text-gray-400 text-sm">5 dias atrás</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Problema resolvido após 30 minutos. Causa: alto volume de transações.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">Nova API de cotações implementada</h4>
                      <span className="text-gray-400 text-sm">1 semana atrás</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Melhorias de performance e precisão nas cotações em tempo real.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Widget de Chat ao Vivo */}
      {isLiveChatOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaComments className="text-white text-xl" />
              <div>
                <h4 className="text-white font-bold">Chat ao Vivo</h4>
                <p className="text-blue-100 text-sm">Estamos online</p>
              </div>
            </div>
            <button
              onClick={() => setIsLiveChatOpen(false)}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <FaTimesCircle className="text-xl" />
            </button>
          </div>
          <div className="h-[380px] p-4 overflow-y-auto">
            <div className="bg-gray-700/50 rounded-lg p-3 mb-3">
              <p className="text-gray-300 text-sm">
                Olá! Como posso ajudar você hoje? 👋
              </p>
            </div>
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ticket */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-lg w-full border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Abrir Novo Ticket</h3>
              <button
                onClick={() => setShowTicketForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Assunto</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Descreva brevemente o problema"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Categoria</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                >
                  <option value="general">Geral</option>
                  <option value="account">Conta</option>
                  <option value="trading">Negociação</option>
                  <option value="payment">Pagamento</option>
                  <option value="security">Segurança</option>
                  <option value="technical">Técnico</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Prioridade</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Descrição</label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                  placeholder="Descreva detalhadamente o problema..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowTicketForm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium transition-all"
                >
                  Enviar Ticket
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}