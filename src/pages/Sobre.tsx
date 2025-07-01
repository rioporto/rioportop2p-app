import { Building2, Users, Target, Award, Calendar, TrendingUp, Shield, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function Sobre() {
  const marcos = [
    {
      ano: '2018',
      titulo: 'Fundação',
      descricao: 'Nascemos com a missão de democratizar o acesso ao Bitcoin no Brasil'
    },
    {
      ano: '2019',
      titulo: 'Primeira Mesa OTC',
      descricao: 'Lançamos operações para grandes volumes com atendimento personalizado'
    },
    {
      ano: '2020',
      titulo: 'Expansão Digital',
      descricao: 'Digitalizamos processos e expandimos atendimento via WhatsApp'
    },
    {
      ano: '2021',
      titulo: 'Educação Cripto',
      descricao: 'Iniciamos programa educacional com cursos e conteúdo gratuito'
    },
    {
      ano: '2023',
      titulo: 'KYC Multinível',
      descricao: 'Implementamos sistema KYC em 3 níveis para maior segurança'
    },
    {
      ano: '2024',
      titulo: 'Nova Plataforma',
      descricao: 'Lançamento da plataforma moderna e totalmente reformulada'
    }
  ]

  const valores = [
    {
      icon: Shield,
      titulo: 'Segurança',
      descricao: 'Proteção máxima em todas as operações com KYC completo e conformidade regulatória'
    },
    {
      icon: Users,
      titulo: 'Atendimento Humano',
      descricao: 'Relacionamento direto e personalizado, sem robôs ou respostas automáticas'
    },
    {
      icon: Target,
      titulo: 'Transparência',
      descricao: 'Taxas claras, processos transparentes e comunicação honesta sempre'
    },
    {
      icon: Heart,
      titulo: 'Educação',
      descricao: 'Comprometidos em educar e capacitar pessoas sobre Bitcoin e finanças digitais'
    }
  ]

  const numeros = [
    { valor: '50K+', label: 'Clientes atendidos' },
    { valor: 'R$ 500M+', label: 'Volume transacionado' },
    { valor: '6 anos', label: 'No mercado' },
    { valor: '98%', label: 'Satisfação' }
  ]

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Building2 className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre a Rio Porto P2P
            </h1>
            <p className="text-xl text-muted-foreground">
              Desde 2018 facilitando o acesso ao Bitcoin para brasileiros com 
              segurança, transparência e atendimento personalizado.
            </p>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {numeros.map((item, index) => (
              <div key={index}>
                <p className="text-3xl font-bold text-primary">{item.valor}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossa História</h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Uma jornada de inovação e compromisso com o futuro das finanças
            </p>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  A Rio Porto P2P nasceu em 2018 com uma visão clara: tornar o Bitcoin 
                  acessível a todos os brasileiros, independentemente de seu conhecimento 
                  técnico ou volume de investimento.
                </p>
                <p className="text-muted-foreground">
                  Começamos como uma pequena mesa de operações no centro do Rio de Janeiro, 
                  atendendo clientes presencialmente. Com o tempo, percebemos a necessidade 
                  de escalar e digitalizar nossos serviços, mas sem perder o toque humano 
                  que sempre nos diferenciou.
                </p>
                <p className="text-muted-foreground">
                  Hoje, somos referência em operações P2P de Bitcoin no Brasil, combinando 
                  tecnologia de ponta com atendimento personalizado. Nossa equipe é formada 
                  por especialistas em criptomoedas, segurança digital e compliance.
                </p>
              </div>

              <div className="bg-card rounded-lg border p-8">
                <h3 className="text-xl font-bold mb-6">Dados da Empresa</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Razão Social</dt>
                    <dd className="font-medium">RIO PORTO MEDIAÇÃO LTDA</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">CNPJ</dt>
                    <dd className="font-medium">11.741.563/0001-57</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Fundação</dt>
                    <dd className="font-medium">2018</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Sede</dt>
                    <dd className="font-medium">Rio de Janeiro, RJ</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">CNAE Principal</dt>
                    <dd className="font-medium">66.19-3-99 - Atividades auxiliares dos serviços financeiros</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Marcos da Nossa Jornada
            </h2>

            <div className="relative">
              {/* Linha vertical */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

              <div className="space-y-12">
                {marcos.map((marco, index) => (
                  <div key={index} className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Círculo */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full md:-translate-x-1/2 z-10" />
                    
                    {/* Conteúdo */}
                    <div className={`ml-20 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    }`}>
                      <div className="bg-card rounded-lg border p-6">
                        <Calendar className="h-5 w-5 text-primary mb-2" />
                        <p className="text-2xl font-bold text-primary mb-1">{marco.ano}</p>
                        <h3 className="text-lg font-semibold mb-2">{marco.titulo}</h3>
                        <p className="text-sm text-muted-foreground">{marco.descricao}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Valores</h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Os princípios que guiam cada uma de nossas ações
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {valores.map((valor, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <valor.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{valor.titulo}</h3>
                    <p className="text-muted-foreground">{valor.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Missão e Visão */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
                <p className="text-muted-foreground">
                  Democratizar o acesso ao Bitcoin no Brasil, oferecendo uma 
                  plataforma segura, transparente e com atendimento humano para 
                  que qualquer pessoa possa participar da revolução das criptomoedas.
                </p>
              </div>

              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Nossa Visão</h2>
                <p className="text-muted-foreground">
                  Ser a principal referência em operações P2P de Bitcoin no Brasil, 
                  reconhecida pela excelência no atendimento, segurança nas operações 
                  e compromisso com a educação financeira.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Nossa Equipe</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Profissionais especializados e apaixonados por Bitcoin
            </p>
            <div className="bg-card rounded-lg border p-8 max-w-2xl mx-auto">
              <p className="text-muted-foreground mb-6">
                Nossa equipe é formada por especialistas em criptomoedas, segurança digital, 
                compliance e atendimento ao cliente. Todos compartilham a mesma paixão: 
                tornar o Bitcoin acessível e seguro para todos.
              </p>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">15+</p>
                  <p className="text-sm text-muted-foreground">Especialistas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">24/7</p>
                  <p className="text-sm text-muted-foreground">Suporte</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">100%</p>
                  <p className="text-sm text-muted-foreground">Dedicação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Faça Parte da Nossa História
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Junte-se a milhares de brasileiros que já confiam na Rio Porto P2P
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/cotacao">
                Começar a Operar
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/contato">
                Entre em Contato
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}