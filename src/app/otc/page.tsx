'use client'

export const dynamic = 'force-dynamic';

import React from 'react'
import Link from 'next/link'
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  HeadphonesIcon,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  DollarSign
} from 'lucide-react'
import OTCContactForm from '@/components/OTCContactForm'

export default function OTCPage() {
  const taxRanges = [
    { range: 'R$ 50.000 - R$ 100.000', buyRate: '1.8%', sellRate: '1.6%' },
    { range: 'R$ 100.001 - R$ 500.000', buyRate: '1.5%', sellRate: '1.3%' },
    { range: 'R$ 500.001 - R$ 1.000.000', buyRate: '1.2%', sellRate: '1.0%' },
    { range: 'Acima de R$ 1.000.000', buyRate: 'Negociável', sellRate: 'Negociável' },
  ]

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Taxas Exclusivas',
      description: 'Melhores taxas do mercado para grandes volumes'
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      title: 'Atendimento VIP',
      description: 'Suporte dedicado via WhatsApp e telefone'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Execução Rápida',
      description: 'Transações processadas com prioridade máxima'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Segurança Garantida',
      description: 'Custódia segregada e processos auditados'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">OTC - Over The Counter</h1>
            <p className="text-xl mb-8">
              Serviço exclusivo para operações de grandes volumes com atendimento personalizado
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="#contact-form"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Solicitar Cotação
              </Link>
              <a 
                href="https://wa.me/552120187776?text=Olá! Gostaria de falar com um especialista sobre operações OTC."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Falar com Especialista
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefícios Exclusivos OTC</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <div className="text-blue-600 mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax Table Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Tabela de Taxas OTC</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-6 py-4 text-left font-semibold">Faixa de Valor</th>
                    <th className="border border-gray-300 px-6 py-4 text-center font-semibold">Taxa de Compra</th>
                    <th className="border border-gray-300 px-6 py-4 text-center font-semibold">Taxa de Venda</th>
                  </tr>
                </thead>
                <tbody>
                  {taxRanges.map((range, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-6 py-4">{range.range}</td>
                      <td className="border border-gray-300 px-6 py-4 text-center font-semibold text-green-600">
                        {range.buyRate}
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-center font-semibold text-blue-600">
                        {range.sellRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              * Taxas sujeitas a alteração conforme condições de mercado
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                { step: '1', title: 'Solicite uma Cotação', description: 'Preencha o formulário com o valor desejado' },
                { step: '2', title: 'Análise Personalizada', description: 'Nossa equipe analisará sua solicitação' },
                { step: '3', title: 'Proposta Exclusiva', description: 'Receba uma proposta com condições especiais' },
                { step: '4', title: 'Execução Segura', description: 'Realize a operação com total segurança' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Solicite uma Cotação OTC</h2>
            <OTCContactForm />
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fale com Nossa Equipe OTC</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Phone className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Telefone</h3>
              <p>0800 123 4567</p>
              <p className="text-sm opacity-80">Seg-Sex 9h às 18h</p>
            </div>
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
              <p>(11) 99999-9999</p>
              <p className="text-sm opacity-80">Atendimento 24/7</p>
            </div>
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">E-mail</h3>
              <p>otc@rioportop2p.com</p>
              <p className="text-sm opacity-80">Resposta em até 2h</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}