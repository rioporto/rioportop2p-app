'use client';

import { useState } from 'react';
import { User, Shield, Clock, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface OrderCardProps {
  order: {
    id: string;
    type: 'buy' | 'sell';
    crypto: {
      symbol: string;
      name: string;
      logo_url?: string;
    };
    user: {
      id: string;
      name: string;
      avatar?: string;
      reputation: number;
      trades: number;
      is_online: boolean;
      kyc_level: string;
    };
    crypto_amount: number;
    fiat_amount: number;
    price_per_unit: number;
    limits: {
      min: number | null;
      max: number | null;
    };
    payment_methods: string[];
    payment_time_limit: number;
    terms?: string;
  };
  onSelect: (order: any) => void;
}

const paymentMethodLabels: Record<string, string> = {
  PIX: 'PIX',
  TED: 'TED',
  bank_transfer: 'Transferência',
  cash: 'Dinheiro'
};

const kycLevelLabels: Record<string, { label: string; color: string }> = {
  basic: { label: 'Básico', color: 'text-slate-400' },
  intermediate: { label: 'Intermediário', color: 'text-blue-400' },
  complete: { label: 'Completo', color: 'text-green-400' }
};

export default function OrderCard({ order, onSelect }: OrderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const isGreenTheme = order.type === 'buy';
  const themeColor = isGreenTheme ? 'green' : 'red';
  
  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
        isGreenTheme 
          ? 'border-green-900/50 bg-green-950/20 hover:border-green-700/50 hover:bg-green-950/30' 
          : 'border-red-900/50 bg-red-950/20 hover:border-red-700/50 hover:bg-red-950/30'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(order)}
    >
      {/* User Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {order.user.avatar ? (
              <Image
                src={order.user.avatar}
                alt={order.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            )}
            {order.user.is_online && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
            )}
          </div>
          <div>
            <p className="font-medium text-white">{order.user.name}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">{order.user.trades} negócios</span>
              <span className="text-yellow-500">★ {order.user.reputation.toFixed(1)}</span>
              <span className={kycLevelLabels[order.user.kyc_level]?.color || 'text-slate-400'}>
                <Shield className="w-3 h-3 inline mr-1" />
                {kycLevelLabels[order.user.kyc_level]?.label || 'Básico'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Price and Amount */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className={`text-2xl font-bold ${isGreenTheme ? 'text-green-400' : 'text-red-400'}`}>
            R$ {order.price_per_unit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-sm text-slate-400">por {order.crypto.symbol}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-slate-500">Quantidade:</span>
            <p className="text-white font-medium">
              {order.crypto_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {order.crypto.symbol}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Total:</span>
            <p className="text-white font-medium">
              R$ {order.fiat_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Limits */}
      {(order.limits.min || order.limits.max) && (
        <div className="mb-4 p-3 bg-slate-800/30 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Limites de negociação:</p>
          <p className="text-sm text-white">
            {order.limits.min && `R$ ${order.limits.min.toLocaleString('pt-BR')}`}
            {order.limits.min && order.limits.max && ' - '}
            {order.limits.max && `R$ ${order.limits.max.toLocaleString('pt-BR')}`}
          </p>
        </div>
      )}

      {/* Payment Methods */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">Formas de pagamento:</p>
        <div className="flex flex-wrap gap-2">
          {order.payment_methods.map((method) => (
            <span
              key={method}
              className="px-2 py-1 bg-slate-800/50 rounded text-xs text-white"
            >
              <CreditCard className="w-3 h-3 inline mr-1" />
              {paymentMethodLabels[method] || method}
            </span>
          ))}
        </div>
      </div>

      {/* Time Limit */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
        <Clock className="w-3 h-3" />
        <span>Tempo limite: {order.payment_time_limit} minutos</span>
      </div>

      {/* Terms */}
      {order.terms && (
        <div className="mb-4 p-3 bg-slate-800/20 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Termos:</p>
          <p className="text-xs text-white line-clamp-2">{order.terms}</p>
        </div>
      )}

      {/* Action Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
          isGreenTheme
            ? 'bg-green-600 hover:bg-green-500 text-white'
            : 'bg-red-600 hover:bg-red-500 text-white'
        }`}
      >
        <TrendingUp className="w-4 h-4" />
        {order.type === 'buy' ? 'Vender' : 'Comprar'} {order.crypto.symbol}
        <ArrowRight className={`w-4 h-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
      </button>
    </div>
  );
}