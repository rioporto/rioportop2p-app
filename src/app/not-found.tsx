'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft, Sparkles, TrendingUp, Clock, MessageCircle, BookOpen, Shield } from 'lucide-react';
import SearchAssistant from '@/components/404/SearchAssistant';
import AnimatedBackground from '@/components/404/AnimatedBackground';
import ThemeToggle from '@/components/404/ThemeToggle';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface PopularLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

const popularLinks: PopularLink[] = [
  { 
    title: 'Cotação P2P', 
    href: '/cotacao-p2p', 
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Melhores taxas em tempo real',
    category: 'trending'
  },
  { 
    title: 'Mesa OTC', 
    href: '/otc', 
    icon: <Shield className="w-5 h-5" />,
    description: 'Grandes volumes com segurança',
    category: 'premium'
  },
  { 
    title: 'Cursos', 
    href: '/cursos', 
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Aprenda sobre cripto',
    category: 'education'
  },
  { 
    title: 'FAQ', 
    href: '/faq', 
    icon: <MessageCircle className="w-5 h-5" />,
    description: 'Tire suas dúvidas',
    category: 'support'
  }
];

export default function NotFound() {
  const [showSearch, setShowSearch] = useState(false);
  const [visitedLinks, setVisitedLinks] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Get current URL for analytics
    setCurrentUrl(window.location.pathname);
    
    // Track 404 error
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_not_found', {
        event_category: 'error',
        event_label: window.location.pathname,
        page_path: window.location.pathname
      });
    }

    // Load visited links from localStorage
    const saved = localStorage.getItem('visited_links_404');
    if (saved) {
      setVisitedLinks(JSON.parse(saved));
    }
  }, []);

  const handleLinkClick = (href: string, title: string) => {
    // Track link click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', '404_link_click', {
        event_category: 'engagement',
        event_label: title,
        destination_url: href
      });
    }

    // Save to visited links
    const newVisited = [...visitedLinks, href].slice(-5); // Keep last 5
    setVisitedLinks(newVisited);
    localStorage.setItem('visited_links_404', JSON.stringify(newVisited));
  };

  return (
    <>
      <AnimatedBackground />
      <ThemeToggle />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black dark:from-gray-900 dark:to-black light:from-gray-50 light:to-white text-white dark:text-white light:text-gray-900 flex items-center justify-center px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated 404 */}
          <div className="relative mb-8 animate-fade-in">
            <h1 className="text-[120px] sm:text-[150px] md:text-[200px] font-bold text-gray-800 dark:text-gray-800 light:text-gray-200 select-none leading-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
                404
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-8 -left-8 animate-float">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full blur-xl"></div>
            </div>
            <div className="absolute -bottom-8 -right-8 animate-float-delayed">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Error message with animation */}
          <div className="mb-12 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 dark:text-white light:text-gray-900">
              Oops! Página não encontrada
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2 max-w-lg mx-auto">
              A página que você está procurando pode ter sido movida ou não existe mais.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 light:text-gray-500">
              URL solicitada: <code className="px-2 py-1 bg-gray-800 dark:bg-gray-800 light:bg-gray-200 rounded text-orange-400 dark:text-orange-400 light:text-orange-600">{currentUrl}</code>
            </p>
          </div>

          {/* Smart Search */}
          <div className="mb-12 animate-slide-up-delayed">
            {!showSearch ? (
              <button
                onClick={() => setShowSearch(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Usar busca inteligente</span>
              </button>
            ) : (
              <SearchAssistant onClose={() => setShowSearch(false)} />
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-delayed">
            <Link
              href="/"
              onClick={() => handleLinkClick('/', 'Home')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 text-white dark:text-white light:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-200 transition-all duration-200 group"
            >
              <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Ir para Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              Voltar
            </button>
          </div>

          {/* Popular Pages Grid */}
          <div className="border-t border-gray-800 dark:border-gray-800 light:border-gray-200 pt-12">
            <h3 className="text-xl font-semibold mb-6 text-gray-300 dark:text-gray-300 light:text-gray-700 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Páginas mais procuradas
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {popularLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => handleLinkClick(link.href, link.title)}
                  className="group relative p-4 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100 backdrop-blur-sm border border-gray-700 dark:border-gray-700 light:border-gray-200 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                      {link.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-white dark:text-white light:text-gray-900 group-hover:text-orange-400 transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mt-1">
                        {link.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 rounded-xl transition-all duration-300"></div>
                </Link>
              ))}
            </div>

            {/* Recently visited */}
            {visitedLinks.length > 0 && (
              <div className="mt-8 p-4 bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-100 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Visitados recentemente:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {visitedLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link}
                      className="text-sm text-orange-400 dark:text-orange-400 light:text-orange-600 hover:text-orange-300 transition-colors"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Assistant tip */}
          <div className="mt-12 p-6 bg-gradient-to-r from-gray-800 to-gray-800/50 dark:from-gray-800 dark:to-gray-800/50 light:from-gray-100 light:to-gray-100/50 rounded-xl border border-gray-700 dark:border-gray-700 light:border-gray-200 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-orange-400 mb-1">Assistente IA disponível</h4>
                <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600">
                  Use nossa busca inteligente para encontrar rapidamente o que precisa. 
                  O assistente pode sugerir páginas relevantes baseado no que você está procurando.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.6s ease-out 0.4s both;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out infinite 3s;
        }

        /* Light mode styles */
        :global(.light) {
          --bg-primary: #ffffff;
          --bg-secondary: #f9fafb;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
        }
      `}</style>
    </>
  );
}