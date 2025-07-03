'use client';

import { useState, useEffect } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import CryptoSelect from '@/components/CryptoSelect';

interface OrdersFilterProps {
  selectedCrypto: string;
  onCryptoChange: (crypto: string) => void;
  onRefresh: () => void;
  cryptos: Array<{
    symbol: string;
    name: string;
    price_brl?: number;
  }>;
  loading?: boolean;
}

export default function OrdersFilter({
  selectedCrypto,
  onCryptoChange,
  onRefresh,
  cryptos,
  loading = false
}: OrdersFilterProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold text-white">Filtrar Ordens</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <CryptoSelect
              value={selectedCrypto}
              onChange={onCryptoChange}
              cryptos={cryptos}
              loading={loading}
              onAddCustom={(ticker) => {
                // Handle custom crypto addition if needed
                console.log('Custom crypto:', ticker);
              }}
            />
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
}