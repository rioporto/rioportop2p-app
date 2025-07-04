'use client'

import { useState } from 'react'
import { 
  Settings,
  DollarSign,
  Percent,
  TrendingUp,
  AlertCircle,
  Save,
  Edit2,
  Plus,
  Trash2,
  Clock,
  Users
} from 'lucide-react'

interface FeeConfiguration {
  id: number
  name: string
  type: 'percentage' | 'fixed'
  value: number
  minValue?: number
  maxValue?: number
  appliesTo: string[]
  active: boolean
  lastModified: string
  modifiedBy: string
}

const mockFees: FeeConfiguration[] = [
  {
    id: 1,
    name: 'Taxa de Transação P2P',
    type: 'percentage',
    value: 2.0,
    minValue: 5.00,
    maxValue: 100.00,
    appliesTo: ['BTC', 'ETH', 'USDT', 'USDC'],
    active: true,
    lastModified: '2024-03-10 14:30',
    modifiedBy: 'Admin João'
  },
  {
    id: 2,
    name: 'Taxa de Saque PIX',
    type: 'fixed',
    value: 3.50,
    appliesTo: ['PIX'],
    active: true,
    lastModified: '2024-03-08 10:15',
    modifiedBy: 'Admin Maria'
  },
  {
    id: 3,
    name: 'Taxa Premium - Usuários VIP',
    type: 'percentage',
    value: 1.5,
    minValue: 5.00,
    appliesTo: ['BTC', 'ETH', 'USDT', 'USDC'],
    active: true,
    lastModified: '2024-03-05 16:45',
    modifiedBy: 'Admin Carlos'
  },
  {
    id: 4,
    name: 'Taxa de Depósito',
    type: 'percentage',
    value: 0,
    appliesTo: ['PIX', 'TED'],
    active: true,
    lastModified: '2024-02-20 09:00',
    modifiedBy: 'Admin Ana'
  },
  {
    id: 5,
    name: 'Taxa de Conversão Cripto',
    type: 'percentage',
    value: 0.5,
    appliesTo: ['SWAP'],
    active: false,
    lastModified: '2024-02-15 11:30',
    modifiedBy: 'Admin Pedro'
  }
]

interface FeeTier {
  minVolume: number
  maxVolume: number
  feePercentage: number
}

const mockTiers: FeeTier[] = [
  { minVolume: 0, maxVolume: 10000, feePercentage: 2.0 },
  { minVolume: 10001, maxVolume: 50000, feePercentage: 1.8 },
  { minVolume: 50001, maxVolume: 100000, feePercentage: 1.5 },
  { minVolume: 100001, maxVolume: 999999999, feePercentage: 1.2 }
]

export default function FeesPage() {
  const [selectedFee, setSelectedFee] = useState<FeeConfiguration | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuração de Taxas</h1>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Taxa
        </button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receita Hoje</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 4,523.80</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600 opacity-20" />
          </div>
          <p className="text-xs text-green-600 mt-2">+12.5% vs ontem</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receita Mensal</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 125,342.50</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
          <p className="text-xs text-blue-600 mt-2">+8.3% vs mês anterior</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Taxa Média</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1.85%</p>
            </div>
            <Percent className="w-8 h-8 text-purple-600 opacity-20" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Últimos 30 dias</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Usuários VIP</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
            </div>
            <Users className="w-8 h-8 text-orange-600 opacity-20" />
          </div>
          <p className="text-xs text-orange-600 mt-2">Taxa reduzida</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fees List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Taxas Configuradas</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockFees.map((fee) => (
                <div
                  key={fee.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setSelectedFee(fee)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">{fee.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          fee.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {fee.active ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {fee.type === 'percentage' ? (
                            <span className="font-medium">{fee.value}%</span>
                          ) : (
                            <span className="font-medium">R$ {fee.value.toFixed(2)}</span>
                          )}
                        </span>
                        {fee.minValue && (
                          <span className="text-gray-500 dark:text-gray-400">
                            Mín: R$ {fee.minValue.toFixed(2)}
                          </span>
                        )}
                        {fee.maxValue && (
                          <span className="text-gray-500 dark:text-gray-400">
                            Máx: R$ {fee.maxValue.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {fee.appliesTo.map((item, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Modificado: {fee.lastModified} por {fee.modifiedBy}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedFee(fee)
                          setIsEditing(true)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle delete
                        }}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Volume Tiers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Taxas por Volume</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {mockTiers.map((tier, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {tier.minVolume === 0 ? 'Até' : `R$ ${tier.minVolume.toLocaleString('pt-BR')} -`} 
                        {tier.maxVolume === 999999999 ? ' Acima' : ` R$ ${tier.maxVolume.toLocaleString('pt-BR')}`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Volume mensal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">{tier.feePercentage}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Taxa aplicada</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Editar Níveis de Volume
              </button>
            </div>
          </div>
        </div>

        {/* Fee Details/Edit Panel */}
        <div className="space-y-4">
          {selectedFee ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isEditing ? 'Editar Taxa' : 'Detalhes da Taxa'}
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="p-4 space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome da Taxa
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedFee.name}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo
                      </label>
                      <select
                        defaultValue={selectedFee.type}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                      >
                        <option value="percentage">Porcentagem</option>
                        <option value="fixed">Valor Fixo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Valor
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={selectedFee.value}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Salvar
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedFee.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Valor</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedFee.type === 'percentage' 
                          ? `${selectedFee.value}%` 
                          : `R$ ${selectedFee.value.toFixed(2)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Aplica-se a</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedFee.appliesTo.map((item, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedFee.active ? 'Ativa' : 'Inativa'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Última modificação</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedFee.lastModified}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        por {selectedFee.modifiedBy}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Selecione uma taxa para ver os detalhes
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Importante
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Alterações nas taxas afetam imediatamente todas as novas transações. 
                  Transações em andamento mantêm as taxas originais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}