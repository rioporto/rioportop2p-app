"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  Zap,
  Shield,
  TrendingUp,
  Calculator,
  CreditCard,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight,
  Sparkles,
  Lock,
  Award,
  BarChart3,
  Clock,
  HeadphonesIcon,
  Building2,
  Percent
} from 'lucide-react';

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
  notIncluded?: string[];
  cta: string;
  href: string;
  gradient: string;
  icon: React.ElementType;
}

interface TransactionFee {
  volume: string;
  buyerFee: string;
  sellerFee: string;
  discount?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface PaymentMethod {
  name: string;
  icon: React.ElementType;
  description: string;
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [calculatorAmount, setCalculatorAmount] = useState('1000');
  const [calculatorPlan, setCalculatorPlan] = useState('basic');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const pricingPlans: PricingPlan[] = [
    {
      name: 'Básico',
      description: 'Ideal para quem está começando no mundo P2P',
      price: 'Grátis',
      period: 'para sempre',
      features: [
        'Até R$ 10.000 em transações mensais',
        'Taxa de 2.5% por transação',
        'Suporte via chat',
        'Verificação KYC básica',
        'PIX como método de pagamento',
        'Histórico de 30 dias'
      ],
      notIncluded: [
        'API de integração',
        'Suporte prioritário',
        'Relatórios avançados'
      ],
      cta: 'Começar Grátis',
      href: '/signup',
      gradient: 'from-gray-500 to-gray-600',
      icon: Zap
    },
    {
      name: 'Pro',
      description: 'Para traders frequentes e pequenos negócios',
      price: isAnnual ? 'R$ 79' : 'R$ 99',
      period: '/mês',
      popular: true,
      features: [
        'Até R$ 100.000 em transações mensais',
        'Taxa de 1.5% por transação',
        'Suporte prioritário 24/7',
        'Verificação KYC completa',
        'Múltiplos métodos de pagamento',
        'Histórico ilimitado',
        'API básica de integração',
        'Relatórios mensais',
        'Limite de saque aumentado'
      ],
      cta: 'Escolher Pro',
      href: '/signup?plan=pro',
      gradient: 'from-orange-500 to-amber-500',
      icon: TrendingUp
    },
    {
      name: 'Enterprise',
      description: 'Soluções personalizadas para grandes volumes',
      price: 'Personalizado',
      period: 'sob consulta',
      features: [
        'Volume ilimitado de transações',
        'Taxa negociável (a partir de 0.8%)',
        'Gerente de conta dedicado',
        'KYC personalizado e em lote',
        'Integração white-label',
        'API completa com webhooks',
        'Relatórios personalizados',
        'SLA garantido',
        'Treinamento para equipe',
        'Suporte técnico dedicado'
      ],
      cta: 'Falar com Vendas',
      href: '/contato?type=enterprise',
      gradient: 'from-purple-500 to-pink-500',
      icon: Building2
    }
  ];

  const transactionFees: TransactionFee[] = [
    { volume: 'Até R$ 10.000', buyerFee: '2.5%', sellerFee: '2.5%' },
    { volume: 'R$ 10.001 - R$ 50.000', buyerFee: '2.0%', sellerFee: '2.0%', discount: '20% de desconto' },
    { volume: 'R$ 50.001 - R$ 100.000', buyerFee: '1.5%', sellerFee: '1.5%', discount: '40% de desconto' },
    { volume: 'R$ 100.001 - R$ 500.000', buyerFee: '1.2%', sellerFee: '1.2%', discount: '52% de desconto' },
    { volume: 'Acima de R$ 500.000', buyerFee: '0.8%', sellerFee: '0.8%', discount: '68% de desconto' }
  ];

  const faqs: FAQItem[] = [
    {
      question: 'Como funciona o período de teste gratuito?',
      answer: 'O plano Básico é totalmente gratuito e não requer cartão de crédito. Você pode usar indefinidamente com limite de R$ 10.000 em transações mensais. Para volumes maiores, faça upgrade para o plano Pro ou Enterprise.'
    },
    {
      question: 'Posso mudar de plano a qualquer momento?',
      answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente e o valor é calculado proporcionalmente.'
    },
    {
      question: 'As taxas incluem impostos?',
      answer: 'Sim, todas as nossas taxas já incluem os impostos aplicáveis. O valor que você vê é o valor final, sem surpresas.'
    },
    {
      question: 'Como funciona o desconto anual?',
      answer: 'Ao escolher o pagamento anual, você economiza 20% comparado ao pagamento mensal. Por exemplo, o plano Pro sai por R$ 948/ano ao invés de R$ 1.188/ano.'
    },
    {
      question: 'Existe taxa de saque ou depósito?',
      answer: 'Não cobramos taxas adicionais para depósitos ou saques via PIX. As únicas taxas são as de transação P2P conforme a tabela acima.'
    },
    {
      question: 'O que acontece se eu exceder o limite do meu plano?',
      answer: 'Se você exceder o limite mensal do seu plano, suas transações serão pausadas até o próximo mês ou até você fazer upgrade. Recomendamos fazer upgrade preventivamente para evitar interrupções.'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      name: 'Cartão de Crédito',
      icon: CreditCard,
      description: 'Visa, Mastercard, Elo e American Express'
    },
    {
      name: 'PIX',
      icon: Zap,
      description: 'Pagamento instantâneo 24/7'
    },
    {
      name: 'Boleto Bancário',
      icon: BarChart3,
      description: 'Vencimento em até 3 dias úteis'
    },
    {
      name: 'Faturamento Mensal',
      icon: Building2,
      description: 'Disponível para planos Enterprise'
    }
  ];

  const calculateSavings = () => {
    const amount = parseFloat(calculatorAmount) || 0;
    let fee = 0;
    let standardFee = amount * 0.025; // 2.5% taxa padrão

    switch (calculatorPlan) {
      case 'basic':
        fee = amount * 0.025;
        break;
      case 'pro':
        fee = amount * 0.015;
        break;
      case 'enterprise':
        fee = amount * 0.008;
        break;
    }

    const savings = standardFee - fee;
    const percentage = standardFee > 0 ? (savings / standardFee) * 100 : 0;

    return {
      fee: fee.toFixed(2),
      savings: savings.toFixed(2),
      percentage: percentage.toFixed(0)
    };
  };

  const savings = calculateSavings();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-900/30 px-4 py-2 text-sm font-medium text-orange-800 dark:text-orange-300 mb-6">
              <Sparkles className="w-4 h-4" />
              Economize até 68% em taxas
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Preços transparentes e</span>
              <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                justos para todos
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Escolha o plano ideal para o seu volume de negociação. 
              Sem taxas escondidas, sem surpresas. Apenas o melhor custo-benefício do mercado P2P.
            </p>

            {/* Annual/Monthly Toggle */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Mensal
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Anual
                <span className="ml-1 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                  20% OFF
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-orange-200/30 to-amber-200/30 dark:from-orange-900/20 dark:to-amber-900/20 blur-3xl" />
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    plan.popular ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 -mt-4 -mr-4">
                      <div className="rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                        MAIS POPULAR
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} text-white mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {plan.description}
                    </p>

                    <div className="mb-8">
                      <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {plan.period}
                      </span>
                    </div>

                    <Link
                      href={plan.href}
                      className={`mb-8 block w-full rounded-full bg-gradient-to-r ${plan.gradient} py-3 text-center font-bold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5`}
                    >
                      {plan.cta}
                    </Link>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        O que está incluído:
                      </h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {plan.notIncluded && (
                        <>
                          <h4 className="font-semibold text-gray-900 dark:text-white mt-6">
                            Não incluído:
                          </h4>
                          <ul className="space-y-3">
                            {plan.notIncluded.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start gap-3">
                                <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transaction Fees Table */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Tabela de Taxas de Transação
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Quanto mais você negocia, menos você paga
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Volume Mensal
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Taxa de Compra
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Taxa de Venda
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Economia
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactionFees.map((fee, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {fee.volume}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                      {fee.buyerFee}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                      {fee.sellerFee}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {fee.discount && (
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                          {fee.discount}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Info className="h-4 w-4" />
            <span>Taxas já incluem todos os impostos aplicáveis</span>
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Calculadora de Economia
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Veja quanto você pode economizar com nossos planos
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white shadow-xl">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">
                  Volume mensal estimado (R$)
                </label>
                <input
                  type="number"
                  value={calculatorAmount}
                  onChange={(e) => setCalculatorAmount(e.target.value)}
                  className="w-full rounded-lg bg-white/20 backdrop-blur border border-white/30 px-4 py-3 text-white placeholder-orange-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Ex: 10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-100 mb-2">
                  Plano escolhido
                </label>
                <select
                  value={calculatorPlan}
                  onChange={(e) => setCalculatorPlan(e.target.value)}
                  className="w-full rounded-lg bg-white/20 backdrop-blur border border-white/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="basic" className="text-gray-900">Básico (2.5%)</option>
                  <option value="pro" className="text-gray-900">Pro (1.5%)</option>
                  <option value="enterprise" className="text-gray-900">Enterprise (0.8%)</option>
                </select>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-white/20 backdrop-blur p-4 text-center">
                <Calculator className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm text-orange-100">Taxa estimada</p>
                <p className="text-2xl font-bold">R$ {savings.fee}</p>
              </div>

              <div className="rounded-lg bg-white/20 backdrop-blur p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm text-orange-100">Economia mensal</p>
                <p className="text-2xl font-bold">R$ {savings.savings}</p>
              </div>

              <div className="rounded-lg bg-white/20 backdrop-blur p-4 text-center">
                <Percent className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm text-orange-100">Percentual economizado</p>
                <p className="text-2xl font-bold">{savings.percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Formas de Pagamento
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Escolha a forma mais conveniente para você
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="group rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <Icon className="h-10 w-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {method.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Nossas Garantias
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Sua satisfação é nossa prioridade
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                30 dias de garantia
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Não ficou satisfeito? Devolvemos seu dinheiro sem perguntas nos primeiros 30 dias.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Segurança garantida
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Suas transações são protegidas com criptografia de ponta e sistemas anti-fraude.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <HeadphonesIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Suporte dedicado
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Time de especialistas disponível 24/7 para ajudar você em português.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Perguntas Frequentes
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Tire suas dúvidas sobre preços e planos
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg bg-white dark:bg-gray-800 shadow-md"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Reconhecimento do Mercado
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3 rounded-lg bg-gray-100 dark:bg-gray-800 px-6 py-4">
              <Award className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Melhor P2P 2024</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">CryptoBrasil Awards</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-100 dark:bg-gray-800 px-6 py-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">4.8/5 Estrelas</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">+5000 avaliações</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-100 dark:bg-gray-800 px-6 py-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">50K+ Usuários</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Crescendo 20% ao mês</p>
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
                Comece agora mesmo, é grátis!
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Crie sua conta em menos de 2 minutos e comece a negociar Bitcoin 
                com as melhores taxas do mercado.
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
                  href="/contato"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-4 text-base font-bold text-white transition-all hover:bg-white hover:text-orange-600"
                >
                  Falar com Especialista
                </Link>
              </div>
              <p className="mt-6 text-sm text-orange-100">
                Não pedimos cartão de crédito • Cadastro em 2 minutos • Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}