"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Shield,
  Zap,
  Users,
  LineChart,
  Lock,
  Clock,
  Smartphone,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  CreditCard,
  UserCheck,
  FileText,
  HeadphonesIcon,
  Settings,
  Eye,
  Wallet,
  Building,
  ChevronRight,
  X
} from 'lucide-react';

interface Feature {
  icon: any;
  title: string;
  description: string;
  highlight?: boolean;
}

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface ComparisonItem {
  feature: string;
  rioporto: boolean | string;
  competitor1: boolean | string;
  competitor2: boolean | string;
}

export default function FeaturesPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('security');
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleFeatures((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureElements = document.querySelectorAll('.feature-card');
    featureElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const mainFeatures: Feature[] = [
    {
      icon: Shield,
      title: 'Sistema de Escrow Seguro',
      description: 'Suas transações são protegidas por nosso sistema de custódia que garante que os fundos só sejam liberados após confirmação de ambas as partes.',
      highlight: true
    },
    {
      icon: UserCheck,
      title: 'KYC em Níveis',
      description: 'Sistema flexível de verificação que se adapta ao seu volume de negociação, desde básico até completo.',
    },
    {
      icon: Zap,
      title: 'Transações Instantâneas',
      description: 'Confirme suas operações em minutos com nosso sistema otimizado de processamento e verificação automática.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Suporte Humano 24/7',
      description: 'Equipe especializada disponível a qualquer hora para ajudar você em português, com conhecimento local do mercado.',
      highlight: true
    },
    {
      icon: CreditCard,
      title: 'Múltiplos Métodos de Pagamento',
      description: 'PIX, TED, DOC, dinheiro em espécie e até mesmo criptomoedas. Escolha o método que melhor se adequa a você.',
    },
    {
      icon: LineChart,
      title: 'Taxas Competitivas',
      description: 'As menores taxas do mercado P2P brasileiro, com descontos progressivos baseados no seu volume de negociação.',
    }
  ];

  const securityFeatures: Feature[] = [
    {
      icon: Lock,
      title: 'Autenticação de Dois Fatores',
      description: 'Proteção adicional para sua conta com 2FA via SMS, e-mail ou aplicativo autenticador.',
    },
    {
      icon: Eye,
      title: 'Monitoramento em Tempo Real',
      description: 'Sistema de detecção de fraudes que monitora atividades suspeitas 24/7.',
    },
    {
      icon: FileText,
      title: 'Compliance Total',
      description: 'Operamos em conformidade com todas as regulamentações brasileiras de prevenção à lavagem de dinheiro.',
    },
    {
      icon: Building,
      title: 'Parceiros Verificados',
      description: 'Todos os vendedores passam por rigoroso processo de verificação antes de operar na plataforma.',
    }
  ];

  const tradingFeatures: Feature[] = [
    {
      icon: TrendingUp,
      title: 'Cotações em Tempo Real',
      description: 'Preços atualizados a cada segundo, refletindo o mercado global e local de Bitcoin.',
    },
    {
      icon: Wallet,
      title: 'Carteira Integrada',
      description: 'Gerencie seus Bitcoins diretamente na plataforma com segurança de nível institucional.',
    },
    {
      icon: Globe,
      title: 'API para Desenvolvedores',
      description: 'Integre nossa plataforma ao seu sistema com nossa API RESTful completa e documentada.',
    },
    {
      icon: Settings,
      title: 'Ordens Automatizadas',
      description: 'Configure compras e vendas automáticas baseadas em preços-alvo que você define.',
    }
  ];

  const stats: Stat[] = [
    { value: '50K+', label: 'Usuários Ativos', suffix: '' },
    { value: '99.9', label: 'Uptime', suffix: '%' },
    { value: '2.5M', label: 'em Transações', suffix: 'BRL' },
    { value: '< 5', label: 'Tempo de Resposta', suffix: 'min' }
  ];

  const comparisonData: ComparisonItem[] = [
    { feature: 'Sistema de Escrow', rioporto: true, competitor1: true, competitor2: false },
    { feature: 'Suporte 24/7 em Português', rioporto: true, competitor1: false, competitor2: false },
    { feature: 'KYC Flexível', rioporto: true, competitor1: false, competitor2: true },
    { feature: 'Taxas Transparentes', rioporto: '0.8%-2.5%', competitor1: '2%-4%', competitor2: '1.5%-3.5%' },
    { feature: 'PIX Instantâneo', rioporto: true, competitor1: true, competitor2: true },
    { feature: 'API para Desenvolvedores', rioporto: true, competitor1: false, competitor2: true },
    { feature: 'App Mobile', rioporto: 'Em breve', competitor1: true, competitor2: true },
    { feature: 'Limite Mínimo', rioporto: 'R$ 50', competitor1: 'R$ 200', competitor2: 'R$ 100' },
    { feature: 'Verificação Rápida', rioporto: '< 1h', competitor1: '24-48h', competitor2: '12-24h' },
    { feature: 'Disputas Resolvidas', rioporto: '< 24h', competitor1: '48-72h', competitor2: '24-48h' }
  ];

  const getFeaturesByTab = () => {
    switch (activeTab) {
      case 'security':
        return securityFeatures;
      case 'trading':
        return tradingFeatures;
      default:
        return mainFeatures;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Recursos que fazem a</span>
              <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                diferença no P2P
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Conheça todas as funcionalidades que tornam a Rio Porto P2P a plataforma mais 
              completa e segura para negociar Bitcoin no Brasil.
            </p>
          </div>
        </div>
        
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-orange-200/30 to-amber-200/30 dark:from-orange-900/20 dark:to-amber-900/20 blur-3xl animate-pulse" />
          <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-blue-200/20 to-purple-200/20 dark:from-blue-900/10 dark:to-purple-900/10 blur-3xl animate-pulse delay-1000" />
        </div>
      </section>

      {/* Main Features Grid */}
      <section ref={featuresRef} className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Recursos Principais
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Tudo que você precisa para negociar com confiança
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  data-index={index}
                  className={`feature-card group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${
                    visibleFeatures.has(index)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  } ${feature.highlight ? 'ring-2 ring-orange-500' : ''}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {feature.highlight && (
                    <div className="absolute top-4 right-4">
                      <Star className="w-5 h-5 text-orange-500 fill-current" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Categories Tabs */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Explore por Categoria
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Recursos organizados para facilitar sua descoberta
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
              <button
                onClick={() => setActiveTab('main')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'main'
                    ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Principais
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'security'
                    ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Segurança
              </button>
              <button
                onClick={() => setActiveTab('trading')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'trading'
                    ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Negociação
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid gap-6 md:grid-cols-2">
            {getFeaturesByTab().map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Números que Impressionam
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Nossa plataforma em números
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <p className="text-4xl font-bold">
                    {stat.value}
                    <span className="text-2xl">{stat.suffix}</span>
                  </p>
                  <p className="mt-2 text-orange-100">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Compare com a Concorrência
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Veja por que somos a melhor escolha
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Recurso
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-orange-600">
                    Rio Porto P2P
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Concorrente A
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Concorrente B
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {item.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof item.rioporto === 'boolean' ? (
                        item.rioporto ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-semibold text-orange-600">
                          {item.rioporto}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof item.competitor1 === 'boolean' ? (
                        item.competitor1 ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.competitor1}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof item.competitor2 === 'boolean' ? (
                        item.competitor2 ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.competitor2}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Exclusive Features */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Recursos Exclusivos
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Inovações que você só encontra aqui
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Feature 1 */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
              <div className="relative">
                <Users className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Rede de Confiança</h3>
                <p className="text-orange-100 mb-4">
                  Sistema único de reputação que conecta você com os melhores traders da plataforma, 
                  baseado em histórico real de transações e avaliações da comunidade.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center text-white font-semibold hover:text-orange-100 transition-colors"
                >
                  Conhecer a rede
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-8 text-white">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
              <div className="relative">
                <Zap className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">P2P Express</h3>
                <p className="text-blue-100 mb-4">
                  Modalidade exclusiva para transações rápidas com traders verificados. 
                  Complete sua negociação em menos de 5 minutos com segurança total.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center text-white font-semibold hover:text-blue-100 transition-colors"
                >
                  Experimentar agora
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-16 sm:px-16 text-center shadow-2xl">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                Experimente todos os recursos
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Crie sua conta gratuita e descubra por que somos a plataforma P2P 
                mais completa do Brasil.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-orange-600 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/cotacao-p2p"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-4 text-base font-bold text-white transition-all hover:bg-white hover:text-orange-600"
                >
                  Ver Cotação Atual
                </Link>
              </div>
              <p className="mt-6 text-sm text-orange-100">
                Sem taxas de cadastro • Aprovação em minutos • Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}