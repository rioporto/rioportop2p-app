import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Tag, TrendingUp, BookOpen, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Blog() {
  const posts = [
    {
      id: 1,
      titulo: 'O que é Bitcoin e como funciona a criptomoeda mais famosa do mundo',
      resumo: 'Entenda de forma simples e direta o que é Bitcoin, como funciona a tecnologia blockchain e por que esta criptomoeda revolucionou o sistema financeiro global.',
      autor: 'João Silva',
      data: '15 de dezembro de 2024',
      tempo: '8 min',
      categoria: 'Educacional',
      imagem: '/api/placeholder/800/400',
      tags: ['Bitcoin', 'Blockchain', 'Iniciantes']
    },
    {
      id: 2,
      titulo: 'Halving do Bitcoin 2024: O que esperar e como se preparar',
      resumo: 'O próximo halving do Bitcoin está se aproximando. Saiba o que é este evento, como ele afeta o preço e por que é tão importante para o ecossistema.',
      autor: 'Maria Santos',
      data: '12 de dezembro de 2024',
      tempo: '6 min',
      categoria: 'Análise',
      imagem: '/api/placeholder/800/400',
      tags: ['Halving', 'Preço', 'Análise']
    },
    {
      id: 3,
      titulo: 'Como guardar Bitcoin com segurança: Carteiras quentes vs frias',
      resumo: 'A segurança é fundamental no mundo das criptomoedas. Aprenda as diferenças entre carteiras quentes e frias e como proteger seus bitcoins.',
      autor: 'Pedro Costa',
      data: '10 de dezembro de 2024',
      tempo: '10 min',
      categoria: 'Segurança',
      imagem: '/api/placeholder/800/400',
      tags: ['Segurança', 'Carteiras', 'Tutorial']
    },
    {
      id: 4,
      titulo: 'Bitcoin vs Inflação: Por que BTC é considerado ouro digital',
      resumo: 'Descubra como o Bitcoin se tornou uma proteção contra a inflação e por que muitos investidores o consideram o "ouro digital" do século 21.',
      autor: 'Ana Oliveira',
      data: '8 de dezembro de 2024',
      tempo: '7 min',
      categoria: 'Economia',
      imagem: '/api/placeholder/800/400',
      tags: ['Inflação', 'Investimento', 'Ouro Digital']
    },
    {
      id: 5,
      titulo: 'Lightning Network: O futuro dos pagamentos com Bitcoin',
      resumo: 'Conheça a Lightning Network, a solução de segunda camada que promete tornar as transações de Bitcoin instantâneas e praticamente gratuitas.',
      autor: 'Carlos Mendes',
      data: '5 de dezembro de 2024',
      tempo: '9 min',
      categoria: 'Tecnologia',
      imagem: '/api/placeholder/800/400',
      tags: ['Lightning', 'Pagamentos', 'Escalabilidade']
    },
    {
      id: 6,
      titulo: 'DCA: A estratégia mais segura para investir em Bitcoin',
      resumo: 'Dollar Cost Averaging (DCA) é uma das estratégias mais utilizadas para investir em Bitcoin. Entenda como funciona e por que é tão eficaz.',
      autor: 'Roberto Lima',
      data: '2 de dezembro de 2024',
      tempo: '5 min',
      categoria: 'Investimento',
      imagem: '/api/placeholder/800/400',
      tags: ['DCA', 'Estratégia', 'Investimento']
    }
  ]

  const categorias = [
    { nome: 'Todos', count: 48, icon: BookOpen },
    { nome: 'Educacional', count: 18, icon: BookOpen },
    { nome: 'Análise', count: 12, icon: TrendingUp },
    { nome: 'Segurança', count: 8, icon: Shield },
    { nome: 'Tecnologia', count: 10, icon: Tag }
  ]

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog Rio Porto P2P
            </h1>
            <p className="text-xl text-muted-foreground">
              Educação e análises sobre Bitcoin, blockchain e o mercado de criptomoedas. 
              98% do nosso conteúdo é focado em Bitcoin.
            </p>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categorias.map((cat) => (
              <button
                key={cat.nome}
                className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-muted transition-colors"
              >
                <cat.icon className="h-4 w-4" />
                <span>{cat.nome}</span>
                <span className="text-sm text-muted-foreground">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post) => (
              <article key={post.id} className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted" />
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="text-primary font-medium">{post.categoria}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.tempo}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 line-clamp-2">
                    {post.titulo}
                  </h2>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.resumo}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">{post.autor}</p>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.data}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/blog/${post.id}`}>
                        Ler mais
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Carregar mais posts
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Receba nosso conteúdo em primeira mão
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Análises exclusivas sobre Bitcoin e o mercado de criptomoedas 
              direto no seu e-mail, toda semana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-2 rounded-md bg-primary-foreground text-primary placeholder:text-muted-foreground"
              />
              <Button variant="secondary">
                Inscrever-se
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              Respeitamos sua privacidade. Cancele quando quiser.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}