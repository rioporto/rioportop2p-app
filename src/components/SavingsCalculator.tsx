"use client";

import { useState } from 'react';
import { Calculator, TrendingUp, Percent } from 'lucide-react';

interface SavingsCalculatorProps {
  className?: string;
  defaultAmount?: string;
  onCalculate?: (result: CalculationResult) => void;
}

interface CalculationResult {
  amount: number;
  plan: string;
  fee: number;
  savings: number;
  percentage: number;
}

export default function SavingsCalculator({ 
  className = "",
  defaultAmount = "10000",
  onCalculate
}: SavingsCalculatorProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const calculateSavings = () => {
    const numAmount = parseFloat(amount) || 0;
    let fee = 0;
    const standardFee = numAmount * 0.025; // 2.5% taxa padrão

    switch (selectedPlan) {
      case 'basic':
        fee = numAmount * 0.025;
        break;
      case 'pro':
        fee = numAmount * 0.015;
        break;
      case 'enterprise':
        fee = numAmount * 0.008;
        break;
    }

    const savings = standardFee - fee;
    const percentage = standardFee > 0 ? (savings / standardFee) * 100 : 0;

    const result: CalculationResult = {
      amount: numAmount,
      plan: selectedPlan,
      fee,
      savings,
      percentage
    };

    if (onCalculate) {
      onCalculate(result);
    }

    return result;
  };

  const result = calculateSavings();

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white shadow-xl ${className}`}>
      <h3 className="text-2xl font-bold mb-6 text-center">
        Calculadora de Economia
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-orange-100 mb-2">
            Volume mensal estimado (R$)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg bg-white/20 backdrop-blur border border-white/30 px-4 py-3 text-white placeholder-orange-100 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Ex: 10000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-orange-100 mb-2">
            Plano escolhido
          </label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full rounded-lg bg-white/20 backdrop-blur border border-white/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 [&>option]:text-gray-900"
          >
            <option value="basic">Básico (2.5%)</option>
            <option value="pro">Pro (1.5%)</option>
            <option value="enterprise">Enterprise (0.8%)</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white/20 backdrop-blur p-4 text-center">
          <Calculator className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm text-orange-100">Taxa estimada</p>
          <p className="text-2xl font-bold">
            R$ {result.fee.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="rounded-lg bg-white/20 backdrop-blur p-4 text-center">
          <TrendingUp className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm text-orange-100">Economia mensal</p>
          <p className="text-2xl font-bold">
            R$ {result.savings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="rounded-lg bg-white/20 backdrop-blur p-4 text-center">
          <Percent className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm text-orange-100">Percentual economizado</p>
          <p className="text-2xl font-bold">{result.percentage.toFixed(0)}%</p>
        </div>
      </div>

      {result.savings > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-orange-100">
            Com o plano {selectedPlan === 'basic' ? 'Básico' : selectedPlan === 'pro' ? 'Pro' : 'Enterprise'}, 
            você economizaria <span className="font-bold">R$ {(result.savings * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> por ano!
          </p>
        </div>
      )}
    </div>
  );
}