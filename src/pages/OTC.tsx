import { Button } from '@/components/ui/button'
import { Building2, TrendingUp, Users, Zap, Shield, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function OTC() {
  const beneficios = [
    {
      icon: TrendingUp,
      titulo: 'Taxas Especiais',
      descricao: 'Quanto maior o volume, menor a taxa. Negociações personalizadas.'
    },
    {
      icon: Users,
      titulo: 'Atendimento VIP',
      descricao: 'Gerente de conta dedicado para suas operações.'
    },
    {
      icon: Zap,
      titulo: 'Liquidez Garantida',
      descricao: 'Capacidade para grandes volumes com execução imediata.'
    },
    {
      icon: Shield,
      titulo: 'Sigilo Total',
      descricao: 'Operações discretas com total privacidade e segurança.'
    }
  ]

  const volumes = [
    {
      faixa: 'R$ 100.000 - R$ 500.000',
      taxa: '1.2%',
      tempo: '30 min'
    },
    {
      faixa: 'R$ 500.000 - R$ 1.000.000',
      taxa: '0.9%',
      tempo: '45 min'
    },
    {
      faixa: 'Acima de R$ 1.000.000',
      taxa: 'Negociável',
      tempo: 'Sob consulta'
    }
  ]

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Building2 className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              OTC - Over The Counter
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Soluções exclusivas para grandes volumes. 
              Operações acima de R$ 100.000 com condições especiais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="https://wa.me/5521201877776?text=Olá, gostaria de informações sobre operações OTC" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Phone className="mr-2 h-5 w-5" />
                  Falar com Especialista OTC
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Vantagens Exclusivas OTC
            </h2>
            <p className="text-lg text-muted-foreground">
              Condições especiais para investidores institucionais e high net worth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {beneficios.map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.titulo}</h3>
                <p className="text-muted-foreground">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabela de Volumes */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Estrutura de Taxas OTC
            </h2>

            <div className="bg-card rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Volume</th>
                    <th className="px-6 py-4 text-center font-semibold">Taxa</th>
                    <th className="px-6 py-4 text-center font-semibold">Tempo de Execução</th>
                  </tr>
                </thead>
                <tbody>
                  {volumes.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-6 py-4">{item.faixa}</td>
                      <td className="px-6 py-4 text-center font-semibold text-primary">
                        {item.taxa}
                      </td>
                      <td className="px-6 py-4 text-center">{item.tempo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-6">
              * Taxas e prazos sujeitos a análise e aprovação. Condições especiais 
              para operações recorrentes.
            </p>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Como Funciona o OTC
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Contato Inicial</h3>
                    <p className="text-muted-foreground">
                      Entre em contato via WhatsApp ou telefone com nossa equipe especializada.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Análise e Proposta</h3>
                    <p className="text-muted-foreground">
                      Analisamos seu perfil e volume para oferecer as melhores condições.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">KYC Empresarial</h3>
                    <p className="text-muted-foreground">
                      Processo simplificado de verificação para empresas e investidores.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Execução</h3>
                    <p className="text-muted-foreground">
                      Operação executada com total segurança e sigilo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-8">
                <h3 className="text-xl font-bold mb-4">Requisitos Mínimos</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Volume mínimo de R$ 100.000 por operação</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Documentação empresarial completa (para PJ)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Comprovação de origem dos recursos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Conta bancária em nome do titular</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link to="/kyc">
                    Iniciar Processo KYC
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para Operar em Grande Escala?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nossa equipe OTC está pronta para atender suas necessidades 
              com soluções personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://wa.me/5521201877776?text=Olá, gostaria de informações sobre operações OTC" 
                   target="_blank" 
                   rel="noopener noreferrer">
                  Falar com Especialista OTC
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+5521201877776">
                  <Phone className="mr-2 h-5 w-5" />
                  +55 21 2018-7776
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}