'use client';

import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Número 404 grande com efeito */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-gray-800 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              404
            </div>
          </div>
        </div>

        {/* Mensagem de erro */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Página não encontrada
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
          Parece que você encontrou um endereço que não existe em nossa plataforma. 
          Que tal explorar outras páginas?
        </p>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir para Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>

        {/* Links úteis */}
        <div className="border-t border-gray-800 pt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">
            Páginas populares:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link
              href="/cotacao-p2p"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Cotação P2P
            </Link>
            <Link
              href="/otc"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Mesa OTC
            </Link>
            <Link
              href="/cursos"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Cursos
            </Link>
            <Link
              href="/faq"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/blog"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/kyc"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Verificação KYC
            </Link>
            <Link
              href="/contato"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Contato
            </Link>
            <Link
              href="/sobre"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Sobre Nós
            </Link>
          </div>
        </div>

        {/* Mensagem adicional */}
        <div className="mt-12 p-6 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <Search className="w-5 h-5" />
            <span className="font-semibold">Dica:</span>
          </div>
          <p className="text-gray-300">
            Se você estava procurando algo específico, verifique se o endereço está correto 
            ou use nossa navegação para encontrar o que precisa.
          </p>
        </div>
      </div>
    </main>
  )
}