'use client'

import React, { useState } from 'react'
import { 
  Shield, 
  CheckCircle, 
  FileText, 
  Camera,
  User,
  Building,
  Globe,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  Zap,
  TrendingUp
} from 'lucide-react'

export default function KYCPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const verificationLevels = [
    {
      level: 1,
      name: 'Verificação Básica',
      icon: <User className="w-8 h-8" />,
      limits: 'Até R$ 10.000/mês',
      documents: [
        'CPF válido',
        'Nome completo',
        'Data de nascimento',
        'E-mail verificado'
      ],
      benefits: [
        'Compra e venda de Bitcoin',
        'Transferências P2P básicas',
        'Acesso ao suporte padrão'
      ],
      color: 'blue'
    },
    {
      level: 2,
      name: 'Verificação Intermediária',
      icon: <Building className="w-8 h-8" />,
      limits: 'Até R$ 50.000/mês',
      documents: [
        'Documento com foto (RG ou CNH)',
        'Selfie com documento',
        'Comprovante de residência',
        'Telefone verificado'
      ],
      benefits: [
        'Todos os benefícios do Nível 1',
        'Limites aumentados',
        'Taxas reduzidas',
        'Suporte prioritário'
      ],
      color: 'green'
    },
    {
      level: 3,
      name: 'Verificação Completa',
      icon: <Globe className="w-8 h-8" />,
      limits: 'Sem limites',
      documents: [
        'Todos os documentos anteriores',
        'Comprovante de renda',
        'Declaração de origem dos recursos',
        'Videochamada (se necessário)'
      ],
      benefits: [
        'Todos os benefícios anteriores',
        'Acesso ao OTC',
        'Limites personalizados',
        'Gerente de conta dedicado',
        'Melhores taxas do mercado'
      ],
      color: 'purple'
    }
  ]

  const kycProcess = [
    {
      step: 1,
      title: 'Cadastro Inicial',
      description: 'Crie sua conta com informações básicas',
      icon: <User className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Envio de Documentos',
      description: 'Faça upload dos documentos necessários',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Verificação Automática',
      description: 'Nossa IA valida seus documentos em minutos',
      icon: <Zap className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Aprovação',
      description: 'Receba a confirmação e comece a operar',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ]

  const faqItems = [
    {
      question: 'Por que preciso verificar minha identidade?',
      answer: 'A verificação KYC é uma exigência legal para prevenir fraudes, lavagem de dinheiro e garantir a segurança de todos os usuários. Ela também permite que oferecemos limites maiores e melhores taxas.'
    },
    {
      question: 'Quanto tempo leva o processo de verificação?',
      answer: 'A verificação do Nível 1 é instantânea. O Nível 2 geralmente leva de 5 a 30 minutos. O Nível 3 pode levar até 24 horas úteis, dependendo da complexidade da análise.'
    },
    {
      question: 'Meus documentos estão seguros?',
      answer: 'Sim! Utilizamos criptografia de ponta a ponta e armazenamento seguro em conformidade com a LGPD. Seus documentos são acessados apenas para fins de verificação e são mantidos em servidores seguros.'
    },
    {
      question: 'Posso aumentar meu nível de verificação depois?',
      answer: 'Sim! Você pode fazer upgrade para um nível superior a qualquer momento através do seu painel de usuário. O processo é simples e você mantém todos os benefícios anteriores.'
    },
    {
      question: 'O que acontece se minha verificação for rejeitada?',
      answer: 'Você receberá um e-mail explicando o motivo da rejeição e as instruções para corrigir o problema. Nossa equipe de suporte está disponível para ajudar em todo o processo.'
    },
    {
      question: 'Preciso renovar minha verificação?',
      answer: 'Geralmente não. A verificação é permanente, mas podemos solicitar documentos atualizados se houver mudanças regulatórias ou se seus documentos expirarem.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Verificação KYC</h1>
            <p className="text-xl mb-8">
              Desbloqueie todo o potencial da plataforma com nossa verificação segura e rápida
            </p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Iniciar Verificação
            </button>
          </div>
        </div>
      </section>

      {/* Why KYC Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que o KYC é importante?</h2>
            <p className="text-lg text-gray-600">
              A verificação KYC (Know Your Customer) garante um ambiente seguro para todos,
              além de desbloquear benefícios exclusivos para você.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Segurança</h3>
              <p className="text-gray-600">Proteja sua conta contra fraudes e acessos não autorizados</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Maiores Limites</h3>
              <p className="text-gray-600">Aumente seus limites de transação conforme seu nível</p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Benefícios VIP</h3>
              <p className="text-gray-600">Acesse taxas especiais e atendimento prioritário</p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Levels Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Níveis de Verificação</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {verificationLevels.map((level) => (
              <div
                key={level.level}
                className={`border-2 rounded-lg p-6 hover:shadow-xl transition ${
                  level.color === 'blue' ? 'border-blue-200 hover:border-blue-400' :
                  level.color === 'green' ? 'border-green-200 hover:border-green-400' :
                  'border-purple-200 hover:border-purple-400'
                }`}
              >
                <div className={`mb-4 ${
                  level.color === 'blue' ? 'text-blue-600' :
                  level.color === 'green' ? 'text-green-600' :
                  'text-purple-600'
                }`}>
                  {level.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">Nível {level.level}</h3>
                <h4 className="text-lg font-semibold mb-4">{level.name}</h4>
                <p className={`text-lg font-semibold mb-4 ${
                  level.color === 'blue' ? 'text-blue-600' :
                  level.color === 'green' ? 'text-green-600' :
                  'text-purple-600'
                }`}>
                  {level.limits}
                </p>
                
                <div className="mb-6">
                  <h5 className="font-semibold mb-2">Documentos necessários:</h5>
                  <ul className="space-y-1">
                    {level.documents.map((doc, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h5 className="font-semibold mb-2">Benefícios:</h5>
                  <ul className="space-y-1">
                    {level.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className={`w-full py-2 rounded-lg font-semibold transition ${
                  level.color === 'blue' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                  level.color === 'green' ? 'bg-green-600 text-white hover:bg-green-700' :
                  'bg-purple-600 text-white hover:bg-purple-700'
                }`}>
                  Verificar Nível {level.level}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona o processo?</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {kycProcess.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                    {item.icon}
                  </div>
                  <div className="relative">
                    {index < kycProcess.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-purple-200"></div>
                    )}
                    <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold relative z-10">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex items-center justify-between transition"
                >
                  <span className="font-semibold text-left">{item.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="bg-white p-4 rounded-b-lg border-x border-b">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Complete sua verificação em minutos e desbloqueie todos os recursos da plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Iniciar Verificação Agora
            </button>
            <button className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition">
              Falar com Suporte
            </button>
          </div>
        </div>
      </section>

      {/* Notice Section */}
      <section className="py-8 bg-yellow-50 border-t border-yellow-200">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4 max-w-4xl mx-auto">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Importante</h3>
              <p className="text-sm text-yellow-700">
                A verificação KYC é obrigatória para operar em conformidade com as regulamentações brasileiras.
                Seus dados são protegidos pela LGPD e utilizados exclusivamente para fins de verificação e segurança.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}