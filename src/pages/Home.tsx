import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Zap, Users, TrendingUp, Lock, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Compre e venda Bitcoin com{' '}
              <span className="text-primary">segurança e praticidade</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Evite exchanges complexas. Na Rio Porto P2P, você negocia diretamente 
              com nossa mesa de operações, com atendimento personalizado e as 
              melhores taxas do mercado.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/cotacao">
                  Solicitar Cotação <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/kyc">
                  Criar Conta Verificada
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Operações a partir de R$ 500. Grandes volumes? 
              <Link to="/otc" className="text-primary hover:underline ml-1">
                Conheça nosso OTC
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Por que escolher a Rio Porto P2P?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Somos especialistas em Bitcoin desde 2018
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Segurança Total</h3>
              <p className="text-muted-foreground">
                KYC completo, operações rastreáveis e conformidade com todas as 
                regulamentações brasileiras.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Rapidez nas Operações</h3>
              <p className="text-muted-foreground">
                Bitcoin na sua carteira em minutos. Pagamentos via PIX processados 
                instantaneamente.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Atendimento Humano</h3>
              <p className="text-muted-foreground">
                Sem robôs. Fale diretamente com nossa equipe especializada via 
                WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Como funciona?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simples, rápido e transparente
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Solicite uma cotação</h3>
                  <p className="text-muted-foreground">
                    Informe o valor e escolha se quer comprar ou vender Bitcoin.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Receba o atendimento</h3>
                  <p className="text-muted-foreground">
                    Nossa equipe entrará em contato via WhatsApp com a melhor cotação.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Finalize a operação</h3>
                  <p className="text-muted-foreground">
                    Faça o pagamento via PIX e receba seus Bitcoins em minutos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KYC Benefits */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Aumente seus limites com nosso KYC
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Nível 1: até R$ 4.999/mês</p>
                      <p className="text-sm text-muted-foreground">Taxa: 3,5%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Nível 2: até R$ 50.000/mês</p>
                      <p className="text-sm text-muted-foreground">Taxa: 2,5%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Nível 3: até R$ 100.000/mês</p>
                      <p className="text-sm text-muted-foreground">Taxa: 1,5%</p>
                    </div>
                  </div>
                </div>
                <Button className="mt-6" asChild>
                  <Link to="/kyc">
                    Iniciar Verificação
                  </Link>
                </Button>
              </div>
              <div className="space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <Lock className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">100% Seguro</h3>
                  <p className="text-sm text-muted-foreground">
                    Seus dados são criptografados e armazenados com segurança 
                    seguindo a LGPD.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <Headphones className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Suporte Prioritário</h3>
                  <p className="text-sm text-muted-foreground">
                    Clientes verificados têm acesso a atendimento prioritário 
                    e limites especiais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Junte-se a milhares de brasileiros que já negociam Bitcoin conosco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/cotacao">
                Solicitar Cotação Agora
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href="https://wa.me/5521201877776" target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}