'use client';

import { ShoppingBag } from 'lucide-react';

interface EmptyOrdersStateProps {
  type: 'buy' | 'sell' | 'all';
  crypto?: string;
}

export default function EmptyOrdersState({ type, crypto }: EmptyOrdersStateProps) {
  const getMessage = () => {
    if (type === 'all') {
      return crypto 
        ? `Não há ordens disponíveis para ${crypto} no momento.`
        : 'Não há ordens disponíveis no momento.';
    }
    
    const orderType = type === 'buy' ? 'compra' : 'venda';
    return crypto
      ? `Não há ordens de ${orderType} para ${crypto} no momento.`
      : `Não há ordens de ${orderType} disponíveis no momento.`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
        <ShoppingBag className="w-8 h-8 text-slate-600" />
      </div>
      <p className="text-slate-400 text-center">{getMessage()}</p>
      <p className="text-slate-500 text-sm mt-2 text-center">
        Volte mais tarde ou tente com outra criptomoeda.
      </p>
    </div>
  );
}