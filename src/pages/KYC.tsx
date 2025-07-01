import { Button } from '@/components/ui/button'
import { CheckCircle2, Upload, Shield, UserCheck, Building, FileText, TrendingUp, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function KYC() {
  const niveis = [
    {
      nivel: 1,
      titulo: 'Básico',
      limite: 'Até R$ 4.999/mês',
      taxa: '3,5%',
      requisitos: [
        'Nome completo',
        'CPF válido',
        'E-mail verificado',
        'Telefone celular'
      ],
      tempo: '5 minutos',
      cor: 'text-blue-600'
    },
    {
      nivel: 2,
      titulo: 'Intermediário',
      limite: 'Até R$ 50.000/mês',
      taxa: '2,5%',
      requisitos: [
        'Todos do nível 1',
        'Selfie com documento',
        'Comprovante de residência',
        'Comprovante de renda'
      ],
      tempo: '24 horas',
      cor: 'text-purple-600'
    },
    {
      nivel: 3,
      titulo: 'Avançado',
      limite: 'Até R$ 100.000/mês',
      taxa: '1,5%',
      requisitos: [
        'Todos do nível 2',
        'Declaração de IR',
        'Origem dos recursos',
        'Videochamada (se necessário)'
      ],
      tempo: '48 horas',
      cor: 'text-green-600'
    }
  ]

  const documentosPF = [
    'RG ou CNH (frente e verso)',
    'CPF (se não constar no documento)',
    'Selfie segurando documento',
    'Comprovante de residência (últimos 3 meses)',
    'Comprovante de renda',
    'Declaração de Imposto de Renda (para nível 3)'
  ]

  const documentosPJ = [
    'Contrato Social e alterações',
    'CNPJ - Comprovante de inscrição',
    'Documentos dos sócios (RG/CPF)',
    'Comprovante de endereço da empresa',
    'Balanço patrimonial',
    'Faturamento dos últimos 12 meses',
    'Procuração (se aplicável)'
  ]

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <UserCheck className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Verificação KYC
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Know Your Customer - Processo seguro e rápido para liberar 
              limites maiores e melhores taxas
            </p>
            <Button size="lg" asChild>
              <Link to="/kyc/cadastro">
                Iniciar Verificação
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Por que KYC */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Por que fazer o KYC?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Segurança Garantida</h3>
                    <p className="text-muted-foreground">
                      Proteja suas operações e garanta que está negociando em 
                      um ambiente seguro e regulamentado.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Melhores Taxas</h3>
                    <p className="text-muted-foreground">
                      Quanto maior seu nível de verificação, menores as taxas 
                      cobradas em suas operações.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Conformidade Legal</h3>
                    <p className="text-muted-foreground">
                      Estamos em total conformidade com as regulamentações 
                      brasileiras e internacionais.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Processo Rápido</h3>
                    <p className="text-muted-foreground">
                      Verificação básica em minutos. Níveis avançados em até 
                      48 horas úteis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Níveis de Verificação */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              Níveis de Verificação
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Escolha o nível adequado ao seu volume de operações
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {niveis.map((nivel) => (
                <div key={nivel.nivel} className="bg-card rounded-lg border p-6">
                  <div className="text-center mb-6">
                    <div className={`text-6xl font-bold ${nivel.cor} mb-2`}>
                      {nivel.nivel}
                    </div>
                    <h3 className="text-2xl font-bold">{nivel.titulo}</h3>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Limite mensal</p>
                      <p className="text-lg font-semibold">{nivel.limite}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de operação</p>
                      <p className="text-lg font-semibold text-primary">{nivel.taxa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tempo de aprovação</p>
                      <p className="text-lg font-semibold">{nivel.tempo}</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <p className="text-sm font-semibold mb-3">Requisitos:</p>
                    <ul className="space-y-2">
                      {nivel.requisitos.map((req, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full mt-6" asChild>
                    <Link to="/kyc/cadastro">
                      Selecionar Nível {nivel.nivel}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documentos Necessários */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Documentos Necessários
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center mb-4">
                  <UserCheck className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-bold">Pessoa Física</h3>
                </div>
                <ul className="space-y-3">
                  {documentosPF.map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <Upload className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center mb-4">
                  <Building className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-bold">Pessoa Jurídica</h3>
                </div>
                <ul className="space-y-3">
                  {documentosPJ.map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <Upload className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-muted rounded-lg">
              <p className="text-sm text-center">
                <strong>Importante:</strong> Todos os documentos devem estar legíveis 
                e dentro da validade. Documentos em outros idiomas devem ser 
                traduzidos por tradutor juramentado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Aumentar seus Limites?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Processo 100% online, seguro e rápido
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/kyc/cadastro">
                Iniciar Verificação Agora
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href="https://wa.me/5521201877776" target="_blank" rel="noopener noreferrer">
                Tirar Dúvidas no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}