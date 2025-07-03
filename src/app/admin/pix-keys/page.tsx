'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Key, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Edit2,
  ToggleLeft,
  ToggleRight,
  User,
  Calendar,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type PixKey = Database['public']['Tables']['pix_keys']['Row'] & {
  user: {
    email: string
    full_name: string | null
  }
}

export default function AdminPixKeysPage() {
  const router = useRouter()
  const [pixKeys, setPixKeys] = useState<PixKey[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'verified' | 'unverified'>('all')
  const [selectedKey, setSelectedKey] = useState<PixKey | null>(null)

  useEffect(() => {
    checkAdminAuth()
    loadPixKeys()
  }, [])

  const checkAdminAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users_profile')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/dashboard')
    }
  }

  const loadPixKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .select(`
          *,
          user:users_profile!user_id (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPixKeys(data || [])
    } catch (error) {
      console.error('Error loading PIX keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleKeyStatus = async (keyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('pix_keys')
        .update({ is_active: !currentStatus })
        .eq('id', keyId)

      if (error) throw error
      await loadPixKeys()
    } catch (error) {
      console.error('Error updating key status:', error)
    }
  }

  const verifyKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('pix_keys')
        .update({ 
          is_verified: true,
          verified_at: new Date().toISOString()
        })
        .eq('id', keyId)

      if (error) throw error
      await loadPixKeys()
    } catch (error) {
      console.error('Error verifying key:', error)
    }
  }

  const formatKeyValue = (value: string, type: string) => {
    switch (type) {
      case 'cpf':
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      case 'cnpj':
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      case 'phone':
        return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      default:
        return value
    }
  }

  const getKeyTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      cpf: 'CPF',
      cnpj: 'CNPJ',
      email: 'E-mail',
      phone: 'Telefone',
      random: 'Aleatória'
    }
    return labels[type] || type
  }

  const filteredKeys = pixKeys.filter(key => {
    // Search filter
    const searchMatch = 
      key.key_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.account_holder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (key.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    // Status filter
    let statusMatch = true
    switch (filterStatus) {
      case 'active':
        statusMatch = key.is_active
        break
      case 'inactive':
        statusMatch = !key.is_active
        break
      case 'verified':
        statusMatch = key.is_verified
        break
      case 'unverified':
        statusMatch = !key.is_verified
        break
    }

    return searchMatch && statusMatch
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/admin" className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gerenciar Chaves PIX
              </h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredKeys.length} chaves encontradas
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por chave, titular ou usuário..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="all">Todas</option>
                <option value="active">Ativas</option>
                <option value="inactive">Inativas</option>
                <option value="verified">Verificadas</option>
                <option value="unverified">Não Verificadas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* PIX Keys Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="p-8 text-center">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma chave PIX encontrada
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Chave PIX
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Titular
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Criada em
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {key.user.full_name || 'Sem nome'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {key.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {getKeyTypeLabel(key.key_type)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatKeyValue(key.key_value, key.key_type)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {key.account_holder_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {key.bank_name || 'Banco não informado'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {key.is_active ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Ativa
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inativa
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {key.is_verified ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verificada
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Não verificada
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(key.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleKeyStatus(key.id, key.is_active)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title={key.is_active ? 'Desativar' : 'Ativar'}
                          >
                            {key.is_active ? (
                              <ToggleRight className="h-5 w-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                          {!key.is_verified && (
                            <button
                              onClick={() => verifyKey(key.id)}
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Verificar chave"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedKey(key)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Ver detalhes"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Key Details Modal */}
      {selectedKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Detalhes da Chave PIX
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de Chave</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {getKeyTypeLabel(selectedKey.key_type)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chave</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatKeyValue(selectedKey.key_value, selectedKey.key_type)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Titular</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedKey.account_holder_name}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">CPF/CNPJ</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedKey.account_holder_document}
                </p>
              </div>
              
              {selectedKey.bank_name && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Banco</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedKey.bank_name}
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Criada em</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedKey.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              
              {selectedKey.verified_at && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Verificada em</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedKey.verified_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setSelectedKey(null)}
              className="mt-6 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}