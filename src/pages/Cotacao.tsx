import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator, ArrowDownUp, Clock, Shield, MessageCircle } from 'lucide-react'

export default function Cotacao() {
  const [operacao, setOperacao] = useState<'comprar' | 'vender'>('comprar')
  const [valor, setValor] = useState('')
  const [cotacaoMock] = useState({
    compra: 305842.50,
    venda: 298765.00,
    variacao: '+2.45%'
  })

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const amount = parseInt(numbers) / 100
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    if (rawValue) {
      setValor(formatCurrency(rawValue))
    } else {
      setValor('')
    }
  }

  const calcularBitcoin = () => {
    const valorNumerico = parseFloat(valor.replace(/\D/g, '')) / 100
    const taxa = operacao === 'comprar' ? cotacaoMock.compra : cotacaoMock.venda
    return (valorNumerico / taxa).toFixed(8)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Cotação P2P</h1>
            <p className="text-lg text-muted-foreground">
              Negocie Bitcoin diretamente com nossa mesa de operações. 
              Atendimento personalizado e as melhores taxas do mercado.
            </p>
          </div>
        </div>
      </section>

      {/* Cotação Atual */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Bitcoin (Compra)</p>
              <p className="text-2xl font-bold">
                {cotacaoMock.compra.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Bitcoin (Venda)</p>
              <p className="text-2xl font-bold">
                {cotacaoMock.venda.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Variação 24h</p>
              <p className="text-2xl font-bold text-green-600">{cotacaoMock.variacao}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Calcular Operação
              </h2>

              {/* Tipo de Operação */}
              <div className="mb-6">
                <Label className="text-base mb-3 block">Eu quero:</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={operacao === 'comprar' ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setOperacao('comprar')}
                    className="w-full"
                  >
                    Comprar Bitcoin
                  </Button>
                  <Button
                    variant={operacao === 'vender' ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setOperacao('vender')}
                    className="w-full"
                  >
                    Vender Bitcoin
                  </Button>
                </div>
              </div>

              {/* Valor */}
              <div className="mb-6">
                <Label htmlFor="valor" className="text-base mb-3 block">
                  Valor em Reais (R$):
                </Label>
                <Input
                  id="valor"
                  type="text"
                  placeholder="R$ 0,00"
                  value={valor}
                  onChange={handleValueChange}
                  className="text-lg h-12"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Mínimo: R$ 500,00 | Máximo: R$ 100.000,00
                </p>
              </div>

              {/* Resultado */}
              {valor && parseFloat(valor.replace(/\D/g, '')) >= 50000 && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Você {operacao === 'comprar' ? 'receberá' : 'enviará'}:
                  </p>
                  <p className="text-2xl font-bold">
                    ₿ {calcularBitcoin()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Taxa inclusa de 2.5% (cliente nível 2)
                  </p>
                </div>
              )}

              {/* CTA */}
              <Button 
                size="lg" 
                className="w-full"
                disabled={!valor || parseFloat(valor.replace(/\D/g, '')) < 50000}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Solicitar Cotação via WhatsApp
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Ao solicitar cotação, você será direcionado ao WhatsApp para atendimento personalizado.
              </p>
            </div>

            {/* Benefícios */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Operação Rápida</h3>
                <p className="text-sm text-muted-foreground">
                  Bitcoin em sua carteira em até 15 minutos após confirmação
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">100% Seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Operações rastreáveis e em conformidade com a legislação
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <ArrowDownUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Taxas Transparentes</h3>
                <p className="text-sm text-muted-foreground">
                  Sem surpresas. Taxa única e clara em todas as operações
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}