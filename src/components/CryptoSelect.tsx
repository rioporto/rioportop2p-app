'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Bitcoin } from 'lucide-react';

interface CryptoOption {
  symbol: string;
  name: string;
  price_brl?: number;
}

interface CryptoSelectProps {
  value: string;
  onChange: (value: string) => void;
  cryptos: CryptoOption[];
  loading?: boolean;
  onAddCustom?: (ticker: string) => void;
}

export default function CryptoSelect({ 
  value, 
  onChange, 
  cryptos, 
  loading = false,
  onAddCustom 
}: CryptoSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTicker, setCustomTicker] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar criptos baseado na busca
  const filteredCryptos = cryptos.filter(crypto => 
    crypto.symbol.toLowerCase().includes(search.toLowerCase()) ||
    crypto.name.toLowerCase().includes(search.toLowerCase())
  );

  // Crypto selecionada
  const selectedCrypto = cryptos.find(c => c.symbol === value) || {
    symbol: value,
    name: value
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomInput(false);
        setCustomTicker('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (crypto: string) => {
    onChange(crypto);
    setIsOpen(false);
    setSearch('');
  };

  const handleAddCustom = () => {
    if (customTicker && onAddCustom) {
      const ticker = customTicker.toUpperCase();
      onAddCustom(ticker);
      handleSelect(ticker);
      setShowCustomInput(false);
      setCustomTicker('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 border border-slate-700 rounded-xl bg-slate-800/50 backdrop-blur-sm text-left flex items-center justify-between hover:border-orange-500/50 hover:bg-slate-800/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
            <Bitcoin className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="font-semibold text-white">
              {selectedCrypto.symbol}
            </p>
            <p className="text-sm text-slate-400">
              {selectedCrypto.name}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
          {/* Campo de busca */}
          <div className="p-3 border-b border-slate-700/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar criptomoeda..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-slate-800/70 transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Lista de opções */}
          <div className="max-h-64 overflow-y-auto bg-slate-900/95">
            {loading ? (
              <div className="p-4 text-center text-slate-400">
                <div className="animate-pulse">Carregando...</div>
              </div>
            ) : filteredCryptos.length > 0 ? (
              <>
                {filteredCryptos.map((crypto) => (
                  <button
                    key={crypto.symbol}
                    type="button"
                    onClick={() => handleSelect(crypto.symbol)}
                    className={`w-full p-3 flex items-center justify-between transition-all duration-150 ${
                      value === crypto.symbol 
                        ? 'bg-slate-800/70 border-l-2 border-orange-500' 
                        : 'hover:bg-slate-800/40 border-l-2 border-transparent'
                    }`}
                    style={{
                      backgroundColor: value === crypto.symbol ? 'rgba(30, 41, 59, 0.7)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (value !== crypto.symbol) {
                        e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value !== crypto.symbol) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        value === crypto.symbol
                          ? 'bg-gradient-to-br from-orange-500/30 to-orange-600/30'
                          : 'bg-slate-800/50'
                      }`}>
                        <Bitcoin className={`w-4 h-4 ${
                          value === crypto.symbol ? 'text-orange-400' : 'text-slate-400'
                        }`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">
                          {crypto.symbol}
                        </p>
                        <p className="text-sm text-slate-400">
                          {crypto.name}
                        </p>
                      </div>
                    </div>
                    {crypto.price_brl && (
                      <span className="text-sm font-medium text-slate-300">
                        {crypto.price_brl.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </span>
                    )}
                  </button>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-slate-400">
                Nenhuma criptomoeda encontrada
              </div>
            )}

            {/* Opção para adicionar crypto personalizada */}
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full p-3 flex items-center gap-3 border-t border-slate-700/30 text-orange-400 font-medium hover:bg-slate-800/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                <span className="text-lg text-orange-400">$</span>
              </div>
              Outra Criptomoeda
            </button>
          </div>

          {/* Input para crypto personalizada */}
          {showCustomInput && (
            <div className="p-3 border-t border-slate-700/30 bg-slate-800/30">
              <p className="text-sm text-slate-400 mb-2">
                Digite o ticker da criptomoeda:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTicker}
                  onChange={(e) => setCustomTicker(e.target.value.toUpperCase())}
                  placeholder="Ex: SHIB"
                  className="flex-1 px-3 py-2 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCustom}
                  disabled={!customTicker}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/25"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomTicker('');
                  }}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}