import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre Nós | RioPorto',
  description: 'Conheça a RioPorto, pioneira em soluções P2P e OTC para criptomoedas no Brasil. Segurança, transparência e inovação em cada transação.',
  openGraph: {
    title: 'Sobre a RioPorto',
    description: 'Pioneira em soluções P2P e OTC para criptomoedas no Brasil',
    type: 'website',
  },
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sobre a RioPorto
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Pioneiros em soluções P2P e OTC para criptomoedas no Brasil, 
              oferecendo segurança e transparência em cada transação.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Missão</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Democratizar o acesso às criptomoedas no Brasil, oferecendo uma plataforma 
                  segura, transparente e eficiente para transações P2P e OTC.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Acreditamos que todos devem ter acesso fácil e seguro ao mercado de 
                  criptomoedas, com as melhores taxas e total controle sobre suas transações.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">+10.000</h3>
                    <p className="text-blue-100">Transações realizadas</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">+5.000</h3>
                    <p className="text-blue-100">Clientes satisfeitos</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">99.9%</h3>
                    <p className="text-blue-100">Taxa de satisfação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Nossos Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Segurança</h3>
                <p className="text-gray-600">
                  Protocolos rigorosos e tecnologia de ponta para proteger suas transações
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparência</h3>
                <p className="text-gray-600">
                  Taxas claras, processos transparentes e comunicação aberta
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Inovação</h3>
                <p className="text-gray-600">
                  Constantemente evoluindo para oferecer as melhores soluções do mercado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Nossa Equipe
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Uma equipe dedicada de especialistas em criptomoedas, tecnologia e finanças, 
              trabalhando para oferecer a melhor experiência em transações P2P e OTC.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">CEO & Fundador</h3>
                <p className="text-gray-600">Líder visionário com mais de 10 anos no mercado crypto</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">CTO</h3>
                <p className="text-gray-600">Especialista em blockchain e segurança digital</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">CFO</h3>
                <p className="text-gray-600">Expert em finanças e compliance regulatório</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para começar sua jornada crypto?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Junte-se a milhares de usuários que confiam na RioPorto
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Criar Conta Grátis
              </Link>
              <Link
                href="/contato"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Entre em Contato
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}