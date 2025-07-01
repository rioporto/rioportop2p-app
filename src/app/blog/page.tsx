'use client';

import { useState } from 'react';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  author: string;
  date: string;
  category: 'Educação' | 'Análise' | 'Segurança';
  imageUrl: string;
  readTime: string;
}

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Como Começar com Bitcoin: Guia Completo para Iniciantes',
    summary: 'Aprenda os conceitos básicos do Bitcoin, como criar sua primeira carteira e fazer suas primeiras transações com segurança.',
    author: 'João Silva',
    date: '2024-01-15',
    category: 'Educação',
    imageUrl: '/api/placeholder/400/250',
    readTime: '5 min'
  },
  {
    id: 2,
    title: 'Análise Técnica: Bitcoin Rumo aos $100.000?',
    summary: 'Uma análise detalhada dos indicadores técnicos e fundamentais que apontam para a valorização do Bitcoin no longo prazo.',
    author: 'Maria Santos',
    date: '2024-01-14',
    category: 'Análise',
    imageUrl: '/api/placeholder/400/250',
    readTime: '8 min'
  },
  {
    id: 3,
    title: 'Segurança em Transações P2P: Melhores Práticas',
    summary: 'Descubra como proteger suas transações P2P de Bitcoin contra fraudes e golpes comuns no mercado.',
    author: 'Pedro Costa',
    date: '2024-01-13',
    category: 'Segurança',
    imageUrl: '/api/placeholder/400/250',
    readTime: '6 min'
  },
  {
    id: 4,
    title: 'Lightning Network: O Futuro dos Pagamentos com Bitcoin',
    summary: 'Entenda como a Lightning Network está revolucionando as transações de Bitcoin com pagamentos instantâneos e taxas mínimas.',
    author: 'Ana Oliveira',
    date: '2024-01-12',
    category: 'Educação',
    imageUrl: '/api/placeholder/400/250',
    readTime: '7 min'
  },
  {
    id: 5,
    title: 'DCA: A Estratégia Inteligente para Acumular Bitcoin',
    summary: 'Dollar Cost Averaging (DCA) é uma das estratégias mais eficazes para investir em Bitcoin. Saiba como implementar.',
    author: 'Carlos Mendes',
    date: '2024-01-11',
    category: 'Análise',
    imageUrl: '/api/placeholder/400/250',
    readTime: '4 min'
  },
  {
    id: 6,
    title: 'Hardware Wallets: Proteção Máxima para seus Bitcoins',
    summary: 'Comparativo completo das principais hardware wallets do mercado e como escolher a melhor para suas necessidades.',
    author: 'Luisa Ferreira',
    date: '2024-01-10',
    category: 'Segurança',
    imageUrl: '/api/placeholder/400/250',
    readTime: '9 min'
  },
  {
    id: 7,
    title: 'Bitcoin vs. Inflação: Por que BTC é o Melhor Ativo',
    summary: 'Análise comparativa entre Bitcoin e ativos tradicionais como proteção contra a inflação e desvalorização monetária.',
    author: 'Roberto Lima',
    date: '2024-01-09',
    category: 'Análise',
    imageUrl: '/api/placeholder/400/250',
    readTime: '6 min'
  },
  {
    id: 8,
    title: 'Mineração de Bitcoin: Vale a Pena em 2024?',
    summary: 'Análise detalhada sobre a rentabilidade da mineração de Bitcoin no Brasil, custos e equipamentos necessários.',
    author: 'Felipe Andrade',
    date: '2024-01-08',
    category: 'Educação',
    imageUrl: '/api/placeholder/400/250',
    readTime: '10 min'
  },
  {
    id: 9,
    title: 'Phishing e Golpes: Como se Proteger no Mundo Crypto',
    summary: 'Identifique e evite os golpes mais comuns no ecossistema Bitcoin e mantenha seus fundos seguros.',
    author: 'Sandra Reis',
    date: '2024-01-07',
    category: 'Segurança',
    imageUrl: '/api/placeholder/400/250',
    readTime: '5 min'
  }
];

const categories = ['Todos', 'Educação', 'Análise', 'Segurança'] as const;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = selectedCategory === 'Todos' 
    ? mockPosts 
    : mockPosts.filter(post => post.category === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog Bitcoin</h1>
        <p className="text-gray-600 text-lg">
          Fique por dentro das últimas novidades, análises e educação sobre Bitcoin e o mercado P2P.
        </p>
      </div>

      {/* Filtros de Categoria */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {currentPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
}