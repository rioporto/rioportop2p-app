import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Rio Porto P2P
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Compre e venda Bitcoin com praticidade e segurança
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg">
            Solicitar Cotação
          </Button>
          <Button variant="outline" size="lg">
            Criar Conta
          </Button>
        </div>
      </div>
    </div>
  )
}