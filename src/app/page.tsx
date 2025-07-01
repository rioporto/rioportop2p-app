"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Compre e Venda Bitcoin</span>
              <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                P2P com Segurança
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              A plataforma mais confiável do Rio de Janeiro para negociar Bitcoin pessoa a pessoa. 
              Taxas competitivas, atendimento humano e segurança garantida.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/register"
                className="rounded-full bg-orange-500 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl hover:-translate-y-0.5"
              >
                Começar Agora
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-8 py-3 text-base font-medium text-gray-700 dark:text-gray-200 shadow-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl hover:-translate-y-0.5"
              >
                Saiba Mais
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated Bitcoin Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-900/20 dark:to-amber-900/20 blur-3xl animate-pulse" />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-12">
            Por que escolher a Rio Porto P2P?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Segurança */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Segurança Total</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sistema de escrow seguro e verificação KYC em níveis para garantir transações protegidas.
                </p>
              </div>
            </div>

            {/* Rapidez */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Transações Rápidas</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Confirme suas operações em minutos com nosso sistema otimizado de verificação.
                </p>
              </div>
            </div>

            {/* Atendimento */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Atendimento Humano</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Suporte real 24/7 com especialistas prontos para ajudar em cada etapa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-12">
            Como funciona?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                  1
                </div>
                <div className="ml-4 h-0.5 flex-1 bg-gray-300 dark:bg-gray-600 md:block hidden" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Crie sua conta</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cadastre-se rapidamente e escolha seu nível de verificação KYC de acordo com suas necessidades.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="ml-4 h-0.5 flex-1 bg-gray-300 dark:bg-gray-600 md:block hidden" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white font-bold mx-4">
                  2
                </div>
                <div className="h-0.5 flex-1 bg-gray-300 dark:bg-gray-600 md:block hidden" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Escolha uma oferta</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Navegue pelas ofertas disponíveis ou crie a sua própria com as melhores taxas do mercado.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="ml-4 h-0.5 flex-1 bg-gray-300 dark:bg-gray-600 md:block hidden" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Negocie com segurança</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Complete sua transação com proteção total do nosso sistema de escrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KYC Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Níveis de Verificação KYC
          </h2>
          <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Escolha o nível que melhor se adequa ao seu volume de negociação
          </p>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {/* KYC Level 1 */}
            <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Nível 1 - Básico</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Para começar rapidamente</p>
              </div>
              <div className="mb-6">
                <p className="text-4xl font-bold text-orange-500">2,5%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">taxa por transação</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Apenas e-mail e telefone</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Limite: R$ 5.000/mês</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Aprovação imediata</span>
                </li>
              </ul>
              <Link
                href="/register?kyc=1"
                className="block w-full rounded-full border border-orange-500 py-3 text-center font-medium text-orange-500 transition-all hover:bg-orange-500 hover:text-white"
              >
                Começar com Nível 1
              </Link>
            </div>

            {/* KYC Level 2 */}
            <div className="relative rounded-2xl border-2 border-orange-500 bg-white dark:bg-gray-800 p-8 shadow-xl transition-all hover:shadow-2xl hover:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-sm font-medium text-white">
                Mais Popular
              </div>
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Nível 2 - Intermediário</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Ideal para traders regulares</p>
              </div>
              <div className="mb-6">
                <p className="text-4xl font-bold text-orange-500">1,5%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">taxa por transação</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Documento com foto</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Limite: R$ 50.000/mês</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Suporte prioritário</span>
                </li>
              </ul>
              <Link
                href="/register?kyc=2"
                className="block w-full rounded-full bg-orange-500 py-3 text-center font-medium text-white transition-all hover:bg-orange-600"
              >
                Escolher Nível 2
              </Link>
            </div>

            {/* KYC Level 3 */}
            <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Nível 3 - Completo</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Para grandes volumes</p>
              </div>
              <div className="mb-6">
                <p className="text-4xl font-bold text-orange-500">0,8%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">taxa por transação</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Verificação completa</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Sem limites mensais</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Gerente dedicado</span>
                </li>
              </ul>
              <Link
                href="/register?kyc=3"
                className="block w-full rounded-full border border-orange-500 py-3 text-center font-medium text-orange-500 transition-all hover:bg-orange-500 hover:text-white"
              >
                Avançar para Nível 3
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Pronto para começar sua jornada Bitcoin?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Junte-se a milhares de usuários que já negociam com segurança na Rio Porto P2P
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl hover:-translate-y-0.5"
            >
              Criar Conta Gratuita
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-8 py-3 text-base font-medium text-gray-700 dark:text-gray-200 shadow-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl hover:-translate-y-0.5"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rio Porto P2P</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A plataforma mais segura para negociar Bitcoin no Rio de Janeiro.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Produto</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">Recursos</Link></li>
                <li><Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">Preços</Link></li>
                <li><Link href="/security" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">Segurança</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Suporte</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">Central de Ajuda</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">Contato</Link></li>
                <li><Link href="/api" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">Privacidade</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">Termos</Link></li>
                <li><Link href="/compliance" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Rio Porto P2P. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}