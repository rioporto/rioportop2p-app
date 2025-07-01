import { useState } from 'react'
import { ChevronDown, Search, MessageCircle, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FAQItem {
  id: number
  pergunta: string
  resposta: string
  categoria: string
}

export default function FAQ() {
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas')
  const [perguntaAberta, setPerguntaAberta] = useState<number | null>(null)

  const categorias = [
    'Todas',
    'Conta e KYC',
    'Compra e Venda',
    'Segurança',
    'Taxas e Limites',
    'Pagamentos',
    'Bitcoin'
  ]

  const perguntas: FAQItem[] = [
    {
      id: 1,
      categoria: 'Conta e KYC',
      pergunta: 'Como criar uma conta na Rio Porto P2P?',
      resposta: 'Criar uma conta é simples e rápido. Clique em "Criar Conta" no menu superior, preencha seus dados básicos (nome, e-mail, telefone) e siga as instruções. Para operações básicas até R$ 4.999/mês, apenas esses dados são necessários. Para limites maiores, você precisará completar o processo KYC enviando documentos adicionais.'
    },
    {
      id: 2,
      categoria: 'Conta e KYC',
      pergunta: 'O que é KYC e por que preciso fazer?',
      resposta: 'KYC (Know Your Customer) é um processo de verificação de identidade exigido por regulamentações financeiras. É necessário para: garantir a segurança das operações, prevenir fraudes e lavagem de dinheiro, liberar limites maiores de transação e oferecer taxas mais competitivas. Temos 3 níveis de KYC, cada um com seus benefícios.'
    },
    {
      id: 3,
      categoria: 'Compra e Venda',
      pergunta: 'Como comprar Bitcoin na Rio Porto P2P?',
      resposta: 'Para comprar Bitcoin: 1) Solicite uma cotação informando o valor em reais, 2) Nossa equipe entrará em contato via WhatsApp com o valor e instruções, 3) Faça o pagamento via PIX para nossa conta, 4) Envie o endereço da sua carteira Bitcoin, 5) Receba seus bitcoins em até 15 minutos após a confirmação do pagamento.'
    },
    {
      id: 4,
      categoria: 'Compra e Venda',
      pergunta: 'Como vender Bitcoin e receber em reais?',
      resposta: 'Para vender Bitcoin: 1) Solicite uma cotação de venda, 2) Receba o endereço da nossa carteira para envio, 3) Envie seus bitcoins para o endereço fornecido, 4) Após a confirmação na blockchain (geralmente 1-3 confirmações), 5) Receba o PIX em sua conta em até 15 minutos. Sempre confirme o endereço antes de enviar!'
    },
    {
      id: 5,
      categoria: 'Segurança',
      pergunta: 'É seguro comprar Bitcoin na Rio Porto P2P?',
      resposta: 'Sim, é totalmente seguro. Somos uma empresa registrada (CNPJ 11.741.563/0001-57), operamos desde 2018, seguimos todas as regulamentações brasileiras, realizamos KYC para prevenir fraudes, todas as transações são rastreáveis e documentadas, e oferecemos suporte humano via WhatsApp para qualquer dúvida.'
    },
    {
      id: 6,
      categoria: 'Taxas e Limites',
      pergunta: 'Quais são as taxas cobradas?',
      resposta: 'Nossas taxas variam de acordo com seu nível KYC: Nível 1 (até R$ 4.999/mês): 3,5% | Nível 2 (até R$ 50.000/mês): 2,5% | Nível 3 (até R$ 100.000/mês): 1,5% | OTC (acima de R$ 100.000): taxas negociáveis. A taxa já está incluída no valor final da cotação.'
    },
    {
      id: 7,
      categoria: 'Taxas e Limites',
      pergunta: 'Qual o valor mínimo e máximo para operar?',
      resposta: 'Valor mínimo: R$ 500 por operação. Valores máximos dependem do seu nível KYC: Sem KYC completo: até R$ 4.999/mês | KYC Nível 2: até R$ 50.000/mês | KYC Nível 3: até R$ 100.000/mês | Acima disso, entre em contato com nosso OTC para condições especiais.'
    },
    {
      id: 8,
      categoria: 'Pagamentos',
      pergunta: 'Quais formas de pagamento são aceitas?',
      resposta: 'Atualmente aceitamos exclusivamente PIX para pagamentos em reais. É a forma mais rápida e segura, com confirmação instantânea. Para pagamentos em Bitcoin (em nossos cursos, por exemplo), aceitamos transferências para nossa carteira com confirmação na blockchain.'
    },
    {
      id: 9,
      categoria: 'Pagamentos',
      pergunta: 'Quanto tempo demora para receber meus bitcoins?',
      resposta: 'Após a confirmação do seu pagamento PIX, enviamos os bitcoins em até 15 minutos. O tempo total pode variar dependendo da rede Bitcoin, mas geralmente: Envio da nossa parte: 15 minutos | Confirmação na blockchain: 10-60 minutos (dependendo da taxa de rede escolhida).'
    },
    {
      id: 10,
      categoria: 'Bitcoin',
      pergunta: 'Preciso ter uma carteira Bitcoin antes de comprar?',
      resposta: 'Sim, você precisa ter uma carteira Bitcoin para receber suas moedas. Recomendamos: Para iniciantes: Carteiras móveis como Blue Wallet ou Exodus | Para valores maiores: Carteiras hardware como Ledger ou Trezor | Nunca deixe seus bitcoins em exchanges por longos períodos. Not your keys, not your coins!'
    },
    {
      id: 11,
      categoria: 'Bitcoin',
      pergunta: 'O que é o endereço Bitcoin e como obter?',
      resposta: 'O endereço Bitcoin é como seu "número de conta" para receber bitcoins. É uma sequência de letras e números que começa com "1", "3" ou "bc1". Para obter: 1) Baixe uma carteira Bitcoin confiável, 2) Crie ou importe uma carteira, 3) Procure a opção "Receber" ou "Receive", 4) Copie o endereço mostrado. Sempre verifique o endereço antes de compartilhar!'
    },
    {
      id: 12,
      categoria: 'Segurança',
      pergunta: 'Como proteger meus bitcoins após a compra?',
      resposta: 'Para máxima segurança: Use carteiras hardware para grandes valores | Nunca compartilhe sua seed phrase (frase de recuperação) | Faça backup da seed phrase em local seguro | Use autenticação de 2 fatores quando disponível | Evite carteiras online ou de exchanges | Mantenha seu software sempre atualizado | Desconfie de golpes e phishing.'
    }
  ]

  const perguntasFiltradas = perguntas.filter(item => {
    const correspondeCategoria = categoriaAtiva === 'Todas' || item.categoria === categoriaAtiva
    const correspondeBusca = item.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
                            item.resposta.toLowerCase().includes(busca.toLowerCase())
    return correspondeCategoria && correspondeBusca
  })

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Encontre respostas rápidas para suas dúvidas sobre Bitcoin, 
              operações P2P e nossa plataforma.
            </p>
            
            {/* Barra de Busca */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar perguntas..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-8 border-b sticky top-16 bg-background z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categorias.map((cat) => (
              <Button
                key={cat}
                variant={categoriaAtiva === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoriaAtiva(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Lista de Perguntas */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {perguntasFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Nenhuma pergunta encontrada para sua busca.
                </p>
                <Button variant="outline" onClick={() => { setBusca(''); setCategoriaAtiva('Todas') }}>
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {perguntasFiltradas.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-lg border overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
                      onClick={() => setPerguntaAberta(perguntaAberta === item.id ? null : item.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.pergunta}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.categoria}</p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 mt-1",
                          perguntaAberta === item.id && "transform rotate-180"
                        )}
                      />
                    </button>
                    
                    {perguntaAberta === item.id && (
                      <div className="px-6 pb-4">
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                          {item.resposta}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA de Contato */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <MessageCircle className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Não encontrou sua resposta?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Nossa equipe está pronta para ajudar você no WhatsApp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="https://wa.me/5521201877776" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar no WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Ver Horário de Atendimento
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}