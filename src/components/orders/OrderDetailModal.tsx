'use client';

import { useState } from 'react';
import { X, Shield, Clock, CreditCard, User, AlertCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface OrderDetailModalProps {
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
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const paymentMethodLabels: Record<string, string> = {
  PIX: 'PIX',
  TED: 'TED',
  bank_transfer: 'Transferência Bancária',
  cash: 'Dinheiro'
};

export default function OrderDetailModal({ order, isOpen, onClose, onConfirm }: OrderDetailModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(order.payment_methods[0]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
      setError(null);
    }
  };

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Por favor, insira um valor válido');
      return false;
    }

    if (order.limits.min && numAmount < order.limits.min) {
      setError(`O valor mínimo é R$ ${order.limits.min.toLocaleString('pt-BR')}`);
      return false;
    }

    if (order.limits.max && numAmount > order.limits.max) {
      setError(`O valor máximo é R$ ${order.limits.max.toLocaleString('pt-BR')}`);
      return false;
    }

    const maxFiatAmount = order.fiat_amount;
    if (numAmount > maxFiatAmount) {
      setError(`O valor máximo disponível é R$ ${maxFiatAmount.toLocaleString('pt-BR')}`);
      return false;
    }

    return true;
  };

  const handleConfirm = () => {
    if (validateAmount()) {
      onConfirm(parseFloat(amount));
    }
  };

  const cryptoAmount = amount ? (parseFloat(amount) / order.price_per_unit).toFixed(8) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-800">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {order.type === 'buy' ? 'Vender' : 'Comprar'} {order.crypto.symbol}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
            <div className="relative">
              {order.user.avatar ? (
                <Image
                  src={order.user.avatar}
                  alt={order.user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
              )}
              {order.user.is_online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">{order.user.name}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-400">{order.user.trades} negócios</span>
                <span className="text-yellow-500">★ {order.user.reputation.toFixed(1)}</span>
                <span className="text-green-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  KYC {order.user.kyc_level}
                </span>
              </div>
            </div>
          </div>

          {/* Price Info */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-slate-400">Preço:</span>
              <span className="text-2xl font-bold text-white">
                R$ {order.price_per_unit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-slate-400">Disponível:</span>
              <span className="text-white">
                {order.crypto_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {order.crypto.symbol}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Quanto você quer {order.type === 'buy' ? 'vender' : 'comprar'}? (R$)
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                BRL
              </div>
            </div>
            {amount && (
              <p className="mt-2 text-sm text-slate-400">
                ≈ {cryptoAmount} {order.crypto.symbol}
              </p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Método de pagamento
            </label>
            <div className="space-y-2">
              {order.payment_methods.map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={`w-full p-3 rounded-lg border transition-all flex items-center gap-3 ${
                    selectedPaymentMethod === method
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span className="text-white">{paymentMethodLabels[method] || method}</span>
                  {selectedPaymentMethod === method && (
                    <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Time Limit */}
          <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg text-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">
              Tempo limite para pagamento: {order.payment_time_limit} minutos
            </span>
          </div>

          {/* Terms */}
          {order.terms && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-sm font-medium text-slate-400 mb-1">Termos do negociador:</p>
              <p className="text-sm text-white">{order.terms}</p>
            </div>
          )}

          {/* Warning */}
          <div className="p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
            <p className="text-sm text-yellow-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Ao confirmar, você concorda em {order.type === 'buy' ? 'vender' : 'comprar'} a quantidade especificada
                e seguir os termos da negociação. Certifique-se de ter lido e compreendido todas as condições.
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 p-6 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!amount || !!error}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              order.type === 'buy'
                ? 'bg-green-600 hover:bg-green-500 text-white disabled:bg-green-900 disabled:text-green-400'
                : 'bg-red-600 hover:bg-red-500 text-white disabled:bg-red-900 disabled:text-red-400'
            } disabled:cursor-not-allowed`}
          >
            Confirmar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}