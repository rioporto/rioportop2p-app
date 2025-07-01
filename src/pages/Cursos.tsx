import { Button } from '@/components/ui/button'
import { Play, Clock, Users, Star, BookOpen, Award, Lock, Bitcoin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Cursos() {
  const cursos = [
    {
      id: 1,
      titulo: 'Bitcoin para Iniciantes',
      descricao: 'Aprenda os conceitos fundamentais do Bitcoin e como começar a investir com segurança.',
      instrutor: 'João Silva',
      duracao: '4 horas',
      aulas: 24,
      alunos: 1842,
      rating: 4.9,
      preco: 197,
      precoComDesconto: 147.75,
      nivel: 'Iniciante',
      gratuito: false,
      emBreve: false,
      tags: ['Bitcoin', 'Investimento', 'Segurança']
    },
    {
      id: 2,
      titulo: 'P2P Trading: Do Zero ao Profissional',
      descricao: 'Curso completo sobre como operar no mercado P2P de forma segura e lucrativa. GRÁTIS por tempo limitado!',
      instrutor: 'Maria Santos',
      duracao: '6 horas',
      aulas: 32,
      alunos: 3256,
      rating: 4.8,
      preco: 0,
      precoComDesconto: 0,
      nivel: 'Todos os níveis',
      gratuito: true,
      emBreve: false,
      tags: ['P2P', 'Trading', 'Estratégias']
    },
    {
      id: 3,
      titulo: 'Análise Técnica para Bitcoin',
      descricao: 'Domine os principais indicadores e estratégias de análise técnica aplicadas ao Bitcoin.',
      instrutor: 'Pedro Costa',
      duracao: '8 horas',
      aulas: 45,
      alunos: 892,
      rating: 4.7,
      preco: 397,
      precoComDesconto: 297.75,
      nivel: 'Intermediário',
      gratuito: false,
      emBreve: false,
      tags: ['Análise Técnica', 'Trading', 'Gráficos']
    },
    {
      id: 4,
      titulo: 'Segurança em Criptomoedas',
      descricao: 'Proteja seus bitcoins: carteiras, senhas, autenticação e as melhores práticas de segurança.',
      instrutor: 'Ana Oliveira',
      duracao: '3 horas',
      aulas: 18,
      alunos: 2108,
      rating: 5.0,
      preco: 147,
      precoComDesconto: 110.25,
      nivel: 'Todos os níveis',
      gratuito: false,
      emBreve: false,
      tags: ['Segurança', 'Carteiras', 'Proteção']
    },
    {
      id: 5,
      titulo: 'Lightning Network na Prática',
      descricao: 'Aprenda a usar a Lightning Network para pagamentos instantâneos com Bitcoin.',
      instrutor: 'Carlos Mendes',
      duracao: '5 horas',
      aulas: 28,
      alunos: 0,
      rating: 0,
      preco: 247,
      precoComDesconto: 185.25,
      nivel: 'Avançado',
      gratuito: false,
      emBreve: true,
      tags: ['Lightning', 'Pagamentos', 'Avançado']
    },
    {
      id: 6,
      titulo: 'Tributação de Criptomoedas no Brasil',
      descricao: 'Entenda como declarar seus bitcoins e outras criptomoedas para a Receita Federal.',
      instrutor: 'Roberto Lima',
      duracao: '2 horas',
      aulas: 12,
      alunos: 1456,
      rating: 4.6,
      preco: 97,
      precoComDesconto: 72.75,
      nivel: 'Todos os níveis',
      gratuito: false,
      emBreve: false,
      tags: ['Impostos', 'Declaração', 'Legal']
    }
  ]

  const categorias = [
    'Todos os cursos',
    'Bitcoin Básico',
    'Trading',
    'Segurança',
    'Avançado',
    'Gratuitos'
  ]

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Educação em Bitcoin e Criptomoedas
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Aprenda com especialistas do mercado. Cursos práticos e objetivos 
              para todos os níveis de conhecimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="#gratuito">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Começar Curso Gratuito
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Ver Todos os Cursos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-3xl font-bold text-primary">12.5K+</p>
              <p className="text-sm text-muted-foreground">Alunos ativos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">98%</p>
              <p className="text-sm text-muted-foreground">Taxa de satisfação</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">186</p>
              <p className="text-sm text-muted-foreground">Horas de conteúdo</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Suporte ao aluno</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 border-b sticky top-16 bg-background z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categorias.map((cat) => (
              <Button
                key={cat}
                variant={cat === 'Todos os cursos' ? 'default' : 'outline'}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Cursos */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {cursos.map((curso) => (
              <div key={curso.id} className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                {/* Banner do Curso */}
                <div className="aspect-video bg-muted relative">
                  {curso.gratuito && (
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      GRÁTIS
                    </div>
                  )}
                  {curso.emBreve && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock className="h-12 w-12 mx-auto mb-2" />
                        <p className="font-semibold">Em Breve</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    {curso.nivel}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{curso.titulo}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {curso.descricao}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {curso.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-muted rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Instrutor</span>
                      <span className="font-medium">{curso.instrutor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Duração
                      </span>
                      <span>{curso.duracao} • {curso.aulas} aulas</span>
                    </div>
                    {!curso.emBreve && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" /> Alunos
                        </span>
                        <div className="flex items-center gap-2">
                          <span>{curso.alunos.toLocaleString()}</span>
                          {curso.rating > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                <span>{curso.rating}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preço e CTA */}
                  <div className="pt-4 border-t">
                    {curso.gratuito ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-600">Grátis</p>
                          <p className="text-xs text-muted-foreground">Por tempo limitado</p>
                        </div>
                        <Button asChild>
                          <Link to={`/cursos/${curso.id}`}>
                            Começar Agora
                          </Link>
                        </Button>
                      </div>
                    ) : curso.emBreve ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold">Em breve</p>
                          <p className="text-xs text-muted-foreground">Seja avisado do lançamento</p>
                        </div>
                        <Button variant="outline">
                          Me Avise
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold">R$ {curso.precoComDesconto}</p>
                            <p className="text-sm line-through text-muted-foreground">R$ {curso.preco}</p>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Bitcoin className="h-3 w-3" />
                            25% desconto pagando em Bitcoin
                          </p>
                        </div>
                        <Button asChild>
                          <Link to={`/cursos/${curso.id}`}>
                            <Play className="mr-2 h-4 w-4" />
                            Assistir
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bitcoin */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Bitcoin className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Pague com Bitcoin e ganhe 25% de desconto
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Incentivamos o uso de Bitcoin! Pague qualquer curso com BTC e 
            ganhe automaticamente 25% de desconto no valor total.
          </p>
          <Button size="lg" variant="secondary">
            Ver Como Funciona
          </Button>
        </div>
      </section>
    </div>
  )
}