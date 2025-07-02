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
        className="w-full p-4 border-2 border-gray-700 rounded-xl bg-gray-800 text-left flex items-center justify-between hover:border-orange-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Bitcoin className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="font-semibold text-white">
              {selectedCrypto.symbol}
            </p>
            <p className="text-sm text-gray-400">
              {selectedCrypto.name}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
          {/* Campo de busca */}
          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar criptomoeda..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-gray-700"
                autoFocus
              />
            </div>
          </div>

          {/* Lista de opções */}
          <div className="max-h-64 overflow-y-auto bg-gray-850">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                Carregando...
              </div>
            ) : filteredCryptos.length > 0 ? (
              <>
                {filteredCryptos.map((crypto) => (
                  <button
                    key={crypto.symbol}
                    type="button"
                    onClick={() => handleSelect(crypto.symbol)}
                    className={`w-full p-3 flex items-center justify-between transition-all duration-200 ${
                      value === crypto.symbol 
                        ? 'bg-orange-500/10 border-l-4 border-orange-500' 
                        : 'hover:bg-gray-800 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Bitcoin className="w-4 h-4 text-orange-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">
                          {crypto.symbol}
                        </p>
                        <p className="text-sm text-gray-400">
                          {crypto.name}
                        </p>
                      </div>
                    </div>
                    {crypto.price_brl && (
                      <span className="text-sm font-medium text-gray-300">
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
              <div className="p-4 text-center text-gray-400">
                Nenhuma criptomoeda encontrada
              </div>
            )}

            {/* Opção para adicionar crypto personalizada */}
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full p-3 flex items-center gap-3 border-t border-gray-800 text-orange-400 font-medium hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <span className="text-lg text-orange-400">$</span>
              </div>
              Outra Criptomoeda
            </button>
          </div>

          {/* Input para crypto personalizada */}
          {showCustomInput && (
            <div className="p-3 border-t border-gray-800 bg-gray-850">
              <p className="text-sm text-gray-400 mb-2">
                Digite o ticker da criptomoeda:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTicker}
                  onChange={(e) => setCustomTicker(e.target.value.toUpperCase())}
                  placeholder="Ex: SHIB"
                  className="flex-1 px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCustom}
                  disabled={!customTicker}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomTicker('');
                  }}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
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