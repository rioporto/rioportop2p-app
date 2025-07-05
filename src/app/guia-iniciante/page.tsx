import { Metadata } from 'next'
import { BookOpen, Shield, DollarSign, Users, Clock, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guia do Iniciante - Rio Porto P2P',
  description: 'Aprenda tudo sobre como comprar e vender Bitcoin de forma segura na plataforma Rio Porto P2P.',
}

export default function GuiaIniciantePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Guia Completo para Iniciantes
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Aprenda passo a passo como usar a Rio Porto P2P para comprar e vender Bitcoin com segurança
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6">Navegação Rápida</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="#o-que-e-p2p" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Users className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="font-semibold">O que é P2P?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Entenda o conceito</p>
              </div>
            </Link>
            <Link href="#como-funciona" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="font-semibold">Como Funciona</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Passo a passo</p>
              </div>
            </Link>
            <Link href="#seguranca" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Shield className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="font-semibold">Segurança</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dicas importantes</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Section 1: O que é P2P? */}
        <section id="o-que-e-p2p" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Users className="w-10 h-10 text-orange-600" />
              O que é P2P (Peer-to-Peer)?
            </h2>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="mb-4">
                P2P significa "pessoa para pessoa" (peer-to-peer em inglês). Na Rio Porto P2P, 
                você negocia diretamente com outros usuários, sem intermediários tradicionais.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-300">
                    Vantagens do P2P
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Melhores taxas e preços</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Maior flexibilidade de pagamento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Transações mais rápidas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Controle total sobre suas negociações</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">
                    Como nos diferenciamos
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span>Sistema de escrow seguro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span>Verificação KYC obrigatória</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span>Suporte 24/7 em português</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span>Resolução rápida de disputas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Como Funciona */}
        <section id="como-funciona" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-10 h-10 text-orange-600" />
              Como Funciona - Passo a Passo
            </h2>

            {/* Para Compradores */}
            <div className="mb-10">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Para Compradores</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Cadastre-se e verifique sua conta", desc: "Complete o KYC enviando seus documentos" },
                  { step: 2, title: "Encontre uma oferta", desc: "Browse as ofertas de venda disponíveis" },
                  { step: 3, title: "Inicie a transação", desc: "Clique em 'Comprar' na oferta desejada" },
                  { step: 4, title: "Faça o pagamento PIX", desc: "Transfira o valor para o vendedor via PIX" },
                  { step: 5, title: "Confirme o pagamento", desc: "Marque como pago e envie o comprovante" },
                  { step: 6, title: "Receba seu Bitcoin", desc: "O Bitcoin será liberado automaticamente" }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-600 dark:text-blue-300">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Para Vendedores */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-green-600">Para Vendedores</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Cadastre-se e verifique sua conta", desc: "Complete o KYC e adicione suas chaves PIX" },
                  { step: 2, title: "Crie uma oferta de venda", desc: "Defina quantidade, preço e forma de pagamento" },
                  { step: 3, title: "Aguarde um comprador", desc: "Você será notificado quando alguém aceitar" },
                  { step: 4, title: "Deposite no escrow", desc: "Envie o Bitcoin para o endereço de custódia" },
                  { step: 5, title: "Aguarde o pagamento", desc: "O comprador fará o PIX para sua conta" },
                  { step: 6, title: "Confirme o recebimento", desc: "Verifique e confirme para liberar o Bitcoin" }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="font-bold text-green-600 dark:text-green-300">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Segurança */}
        <section id="seguranca" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Shield className="w-10 h-10 text-orange-600" />
              Dicas de Segurança
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-red-800 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  O que NÃO fazer
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>❌ Nunca negocie fora da plataforma</li>
                  <li>❌ Não compartilhe senhas ou códigos 2FA</li>
                  <li>❌ Não libere Bitcoin antes de confirmar o pagamento</li>
                  <li>❌ Não aceite pagamentos de terceiros</li>
                  <li>❌ Não faça transações apressadas</li>
                  <li>❌ Não ignore alertas de segurança</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-300 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Boas Práticas
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>✅ Sempre use o sistema de escrow</li>
                  <li>✅ Verifique a reputação do outro usuário</li>
                  <li>✅ Confirme todos os dados antes de pagar</li>
                  <li>✅ Guarde comprovantes de pagamento</li>
                  <li>✅ Use autenticação de 2 fatores</li>
                  <li>✅ Mantenha seus dados atualizados</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Sistema de Escrow
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Nosso sistema de escrow garante que o Bitcoin fique em custódia segura até que 
                o pagamento seja confirmado. Isso protege tanto compradores quanto vendedores 
                contra fraudes.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <HelpCircle className="w-10 h-10 text-orange-600" />
              Perguntas Frequentes
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Quanto tempo leva uma transação?",
                  a: "Em média, transações são concluídas em 15-30 minutos, dependendo da velocidade de confirmação do pagamento."
                },
                {
                  q: "Quais são as taxas?",
                  a: "Cobramos apenas 1% de taxa sobre o valor da transação, uma das menores do mercado."
                },
                {
                  q: "É seguro?",
                  a: "Sim! Usamos escrow, verificação KYC, 2FA e temos uma equipe de suporte dedicada."
                },
                {
                  q: "Posso cancelar uma transação?",
                  a: "Transações podem ser canceladas antes do pagamento ser confirmado, sujeito às regras da plataforma."
                },
                {
                  q: "Como funciona o KYC?",
                  a: "Você precisa enviar documento de identidade, comprovante de residência e uma selfie para verificação."
                }
              ].map((item, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-6">
            Junte-se a milhares de usuários que já negociam Bitcoin com segurança
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Criar Conta Grátis
            </Link>
            <Link
              href="/cotacao-p2p"
              className="bg-orange-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-900 transition-colors"
            >
              Ver Ofertas Disponíveis
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}