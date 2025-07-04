'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  title: string;
  path: string;
  description: string;
  category: string;
}

const popularPages: SearchResult[] = [
  { 
    title: 'Cotação P2P', 
    path: '/cotacao-p2p', 
    description: 'Veja as melhores taxas de câmbio P2P em tempo real',
    category: 'Serviços'
  },
  { 
    title: 'Mesa OTC', 
    path: '/otc', 
    description: 'Negocie grandes volumes com segurança e privacidade',
    category: 'Serviços'
  },
  { 
    title: 'Cursos', 
    path: '/cursos', 
    description: 'Aprenda sobre criptomoedas e trading P2P',
    category: 'Educação'
  },
  { 
    title: 'FAQ', 
    path: '/faq', 
    description: 'Perguntas frequentes sobre nossos serviços',
    category: 'Suporte'
  },
  { 
    title: 'Blog', 
    path: '/blog', 
    description: 'Notícias e análises do mercado cripto',
    category: 'Conteúdo'
  },
  { 
    title: 'Verificação KYC', 
    path: '/kyc', 
    description: 'Complete sua verificação de identidade',
    category: 'Conta'
  },
  { 
    title: 'Dashboard', 
    path: '/dashboard', 
    description: 'Gerencie suas transações e configurações',
    category: 'Conta'
  },
  { 
    title: 'Contato', 
    path: '/contato', 
    description: 'Entre em contato com nossa equipe',
    category: 'Suporte'
  },
  { 
    title: 'Transações', 
    path: '/transactions', 
    description: 'Histórico de suas transações P2P',
    category: 'Conta'
  },
  { 
    title: 'Notificações', 
    path: '/notifications', 
    description: 'Suas notificações e alertas',
    category: 'Conta'
  }
];

export default function SearchAssistant({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [showAI, setShowAI] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true);
      // Simular busca
      const searchTimeout = setTimeout(() => {
        const filtered = popularPages.filter(page => 
          page.title.toLowerCase().includes(query.toLowerCase()) ||
          page.description.toLowerCase().includes(query.toLowerCase()) ||
          page.category.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsSearching(false);
        
        // Simular sugestão IA
        if (filtered.length === 0) {
          setShowAI(true);
          setAiSuggestion(generateAISuggestion(query));
        } else {
          setShowAI(false);
        }
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setResults([]);
      setShowAI(false);
    }
  }, [query]);

  const generateAISuggestion = (searchQuery: string): string => {
    const suggestions = [
      'Parece que você está procurando por informações sobre trading. Que tal visitar nossa página de Cotação P2P?',
      'Se você precisa de ajuda, nossa página de FAQ tem respostas para as perguntas mais comuns.',
      'Para transações seguras, visite nossa Mesa OTC. Lá você encontra as melhores condições.',
      'Novo no mundo cripto? Confira nossos Cursos gratuitos!'
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const handleResultClick = (path: string) => {
    // Track 404 search event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', '404_search_click', {
        event_category: 'engagement',
        event_label: path,
        search_query: query
      });
    }
    router.push(path);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* Search Input */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite o que você está procurando..."
            className="w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results Dropdown */}
        {(results.length > 0 || isSearching || showAI) && (
          <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
            {isSearching ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-2" />
                <p className="text-gray-400">Procurando...</p>
              </div>
            ) : (
              <>
                {results.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs text-gray-400 px-3 py-2">Resultados encontrados</p>
                    {results.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleResultClick(result.path)}
                        className="w-full text-left px-3 py-3 hover:bg-gray-700 rounded-lg transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                              {result.title}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">{result.description}</p>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded ml-3">
                            {result.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showAI && (
                  <div className="p-4 border-t border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-400 mb-1">Assistente IA</p>
                        <p className="text-sm text-gray-300">{aiSuggestion}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Quick Links */}
      {!query && (
        <div className="mt-6">
          <p className="text-sm text-gray-400 mb-3">Mais procurados:</p>
          <div className="flex flex-wrap gap-2">
            {popularPages.slice(0, 6).map((page, index) => (
              <button
                key={index}
                onClick={() => handleResultClick(page.path)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200"
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}