'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  duration: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  modules: number;
  students: number;
  rating: number;
  isFree?: boolean;
  isHighlighted?: boolean;
  bitcoinDiscount?: number;
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Bitcoin P2P: Do Zero ao Profissional',
    description: 'Aprenda tudo sobre negociação P2P de Bitcoin, desde os conceitos básicos até estratégias avançadas de trading.',
    instructor: 'Rafael Oliveira',
    price: 0,
    duration: '8 horas',
    level: 'Iniciante',
    modules: 12,
    students: 3547,
    rating: 4.9,
    isFree: true,
    isHighlighted: true
  },
  {
    id: 2,
    title: 'Fundamentos do Bitcoin e Blockchain',
    description: 'Entenda profundamente como funciona o Bitcoin, a tecnologia blockchain e os princípios da criptoeconomia.',
    instructor: 'Ana Carolina Silva',
    price: 197,
    originalPrice: 297,
    duration: '12 horas',
    level: 'Iniciante',
    modules: 15,
    students: 2189,
    rating: 4.8,
    bitcoinDiscount: 10
  },
  {
    id: 3,
    title: 'Trading Avançado de Criptomoedas',
    description: 'Domine análise técnica, gestão de risco e estratégias profissionais para operar no mercado de criptomoedas.',
    instructor: 'Carlos Eduardo',
    price: 497,
    originalPrice: 697,
    duration: '20 horas',
    level: 'Avançado',
    modules: 25,
    students: 892,
    rating: 4.7,
    bitcoinDiscount: 15
  },
  {
    id: 4,
    title: 'Segurança e Custódia de Bitcoin',
    description: 'Aprenda as melhores práticas de segurança para proteger seus bitcoins, incluindo cold storage e multi-sig.',
    instructor: 'Marina Santos',
    price: 147,
    duration: '6 horas',
    level: 'Intermediário',
    modules: 8,
    students: 1456,
    rating: 4.9,
    bitcoinDiscount: 10
  },
  {
    id: 5,
    title: 'Lightning Network na Prática',
    description: 'Implemente e opere nodes Lightning Network, criando soluções de pagamento instantâneo com Bitcoin.',
    instructor: 'João Pedro Lima',
    price: 297,
    duration: '10 horas',
    level: 'Avançado',
    modules: 12,
    students: 567,
    rating: 4.6,
    bitcoinDiscount: 12
  },
  {
    id: 6,
    title: 'DeFi e Bitcoin: Oportunidades e Riscos',
    description: 'Explore o mundo das finanças descentralizadas, yield farming e protocolos DeFi no ecossistema Bitcoin.',
    instructor: 'Paula Rodrigues',
    price: 247,
    originalPrice: 397,
    duration: '14 horas',
    level: 'Intermediário',
    modules: 18,
    students: 1023,
    rating: 4.5,
    bitcoinDiscount: 10
  },
  {
    id: 7,
    title: 'Mineração de Bitcoin: Setup Completo',
    description: 'Configure sua operação de mineração desde a escolha do hardware até a otimização de rentabilidade.',
    instructor: 'Roberto Almeida',
    price: 347,
    duration: '16 horas',
    level: 'Avançado',
    modules: 20,
    students: 412,
    rating: 4.7,
    bitcoinDiscount: 20
  },
  {
    id: 8,
    title: 'Bitcoin para Empresas',
    description: 'Implemente Bitcoin como meio de pagamento em sua empresa e aproveite os benefícios da economia digital.',
    instructor: 'Fernanda Costa',
    price: 197,
    duration: '8 horas',
    level: 'Intermediário',
    modules: 10,
    students: 789,
    rating: 4.8,
    bitcoinDiscount: 10
  },
  {
    id: 9,
    title: 'Programação Bitcoin: Criando Aplicações',
    description: 'Desenvolva aplicações que interagem com a blockchain do Bitcoin usando Python e JavaScript.',
    instructor: 'Lucas Mendes',
    price: 597,
    duration: '24 horas',
    level: 'Avançado',
    modules: 30,
    students: 234,
    rating: 4.9,
    bitcoinDiscount: 15
  }
];

const levels = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'] as const;

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  const filteredCourses = mockCourses.filter(course => {
    const levelMatch = selectedLevel === 'Todos' || course.level === selectedLevel;
    const freeMatch = !showOnlyFree || course.isFree;
    return levelMatch && freeMatch;
  });

  const highlightedCourse = mockCourses.find(course => course.isHighlighted);
  const regularCourses = filteredCourses.filter(course => !course.isHighlighted);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Cursos de Bitcoin e Criptomoedas</h1>
        <p className="text-gray-600 text-lg">
          Aprenda com os melhores especialistas do mercado e domine o universo das criptomoedas.
        </p>
      </div>

      {/* Curso Destacado */}
      {highlightedCourse && (
        <div className="mb-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white text-orange-600 px-4 py-1 rounded-full text-sm font-bold">
                  GRATUITO
                </span>
                <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                  Curso em Destaque
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-3">{highlightedCourse.title}</h2>
              <p className="text-lg mb-4 opacity-90">{highlightedCourse.description}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {highlightedCourse.duration}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {highlightedCourse.modules} módulos
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {highlightedCourse.students.toLocaleString('pt-BR')} alunos
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 text-center">
              <button 
                onClick={() => alert('Inscrição realizada! Você será redirecionado para o curso.')}
                className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-3">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedLevel === level
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyFree}
            onChange={(e) => setShowOnlyFree(e.target.checked)}
            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
          />
          <span className="text-gray-700">Mostrar apenas cursos gratuitos</span>
        </label>
      </div>

      {/* Grid de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  course.level === 'Iniciante' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
                {course.bitcoinDiscount && (
                  <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.5 2v2.5h-1.5v-2.5h-2v2.5h-3.5v2h1.5v11h-1.5v2h3.5v2.5h2v-2.5h1.5v2.5h2v-2.5h1c2.5 0 4.5-2 4.5-4.5 0-1.4-.6-2.6-1.6-3.4.6-.8 1.1-1.8 1.1-3.1 0-2.5-2-4.5-4.5-4.5h-1v-2.5h-2zm2 6.5h1c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-1v-3zm0 5h1.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-1.5v-3z"/>
                    </svg>
                    -{course.bitcoinDiscount}%
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              
              <div className="text-sm text-gray-500 mb-4">
                Por {course.instructor}
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  {renderStars(course.rating)}
                  <span className="ml-1 font-semibold">{course.rating}</span>
                </div>
                <span className="text-gray-500">({course.students.toLocaleString('pt-BR')})</span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {course.modules} módulos
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    {course.originalPrice && (
                      <span className="text-sm text-gray-500 line-through mr-2">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                    <span className="text-2xl font-bold">
                      {course.price === 0 ? 'Grátis' : formatPrice(course.price)}
                    </span>
                  </div>
                </div>
                {course.bitcoinDiscount && (
                  <p className="text-xs text-orange-600 mb-3">
                    Pague com Bitcoin e ganhe {course.bitcoinDiscount}% de desconto!
                  </p>
                )}
                <button 
                  onClick={() => alert(`Inscrição no curso "${course.title}" realizada com sucesso!`)}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  {course.price === 0 ? 'Acessar Grátis' : 'Matricular-se'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Informação adicional */}
      <div className="mt-12 bg-gray-100 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Pague com Bitcoin e Economize!</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Todos os nossos cursos pagos oferecem desconto especial para pagamentos em Bitcoin. 
          Além de economizar, você pratica o uso da moeda e contribui para a adoção do Bitcoin no Brasil.
        </p>
        <button 
          onClick={() => alert('Em breve: mais informações sobre pagamentos com Bitcoin!')}
          className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Saiba Mais
        </button>
      </div>
    </main>
  );
}