'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, CheckCircle, XCircle, AlertCircle, Key } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type PixKey = Database['public']['Tables']['pix_keys']['Row']
type PixKeyInsert = Database['public']['Tables']['pix_keys']['Insert']

export default function PixKeyManager() {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingKey, setEditingKey] = useState<PixKey | null>(null)
  const [formData, setFormData] = useState<Partial<PixKeyInsert>>({
    key_type: 'cpf',
    key_value: '',
    bank_name: '',
    account_holder_name: '',
    account_holder_document: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadPixKeys()
  }, [])

  const loadPixKeys = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('pix_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPixKeys(data || [])
    } catch (error) {
      console.error('Error loading PIX keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.key_value) {
      errors.key_value = 'Chave PIX é obrigatória'
    } else {
      // Validate based on key type
      switch (formData.key_type) {
        case 'cpf':
          if (!/^\d{11}$/.test(formData.key_value.replace(/\D/g, ''))) {
            errors.key_value = 'CPF inválido'
          }
          break
        case 'cnpj':
          if (!/^\d{14}$/.test(formData.key_value.replace(/\D/g, ''))) {
            errors.key_value = 'CNPJ inválido'
          }
          break
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.key_value)) {
            errors.key_value = 'E-mail inválido'
          }
          break
        case 'phone':
          if (!/^\d{10,11}$/.test(formData.key_value.replace(/\D/g, ''))) {
            errors.key_value = 'Telefone inválido'
          }
          break
      }
    }

    if (!formData.account_holder_name) {
      errors.account_holder_name = 'Nome do titular é obrigatório'
    }

    if (!formData.account_holder_document) {
      errors.account_holder_document = 'CPF/CNPJ do titular é obrigatório'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Clean the key value based on type
      let cleanedKeyValue = formData.key_value!
      if (formData.key_type === 'cpf' || formData.key_type === 'cnpj' || formData.key_type === 'phone') {
        cleanedKeyValue = cleanedKeyValue.replace(/\D/g, '')
      }

      const keyData = {
        ...formData,
        key_value: cleanedKeyValue,
        user_id: user.id
      }

      if (editingKey) {
        const { error } = await supabase
          .from('pix_keys')
          .update(keyData)
          .eq('id', editingKey.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('pix_keys')
          .insert(keyData)

        if (error) throw error
      }

      await loadPixKeys()
      resetForm()
    } catch (error) {
      console.error('Error saving PIX key:', error)
      // TODO: Show error notification
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta chave PIX?')) return

    try {
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadPixKeys()
    } catch (error) {
      console.error('Error deleting PIX key:', error)
    }
  }

  const handleEdit = (key: PixKey) => {
    setEditingKey(key)
    setFormData({
      key_type: key.key_type as any,
      key_value: key.key_value,
      bank_name: key.bank_name,
      account_holder_name: key.account_holder_name,
      account_holder_document: key.account_holder_document
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      key_type: 'cpf',
      key_value: '',
      bank_name: '',
      account_holder_name: '',
      account_holder_document: ''
    })
    setFormErrors({})
    setEditingKey(null)
    setShowForm(false)
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
      random: 'Chave Aleatória'
    }
    return labels[type] || type
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chaves PIX
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gerencie suas chaves PIX para receber pagamentos
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Chave
          </button>
        </div>
      </div>

      {/* PIX Keys List */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : pixKeys.length === 0 ? (
          <div className="text-center py-8">
            <Key className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma chave PIX cadastrada
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Adicione uma chave PIX para começar a receber pagamentos
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pixKeys.map((key) => (
              <div
                key={key.id}
                className="border border-gray-200 dark:border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {getKeyTypeLabel(key.key_type)}
                      </span>
                      {key.is_verified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      {!key.is_active && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                          Inativa
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatKeyValue(key.key_value, key.key_type)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {key.account_holder_name} • {key.bank_name || 'Banco não informado'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(key)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(key.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingKey ? 'Editar Chave PIX' : 'Adicionar Chave PIX'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Chave
                </label>
                <select
                  value={formData.key_type}
                  onChange={(e) => setFormData({ ...formData, key_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  disabled={!!editingKey}
                >
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="email">E-mail</option>
                  <option value="phone">Telefone</option>
                  <option value="random">Chave Aleatória</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Chave PIX
                </label>
                <input
                  type="text"
                  value={formData.key_value}
                  onChange={(e) => setFormData({ ...formData, key_value: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                    formErrors.key_value
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={
                    formData.key_type === 'cpf' ? '000.000.000-00' :
                    formData.key_type === 'cnpj' ? '00.000.000/0000-00' :
                    formData.key_type === 'email' ? 'seu@email.com' :
                    formData.key_type === 'phone' ? '(00) 00000-0000' :
                    'Chave aleatória'
                  }
                />
                {formErrors.key_value && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {formErrors.key_value}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Titular
                </label>
                <input
                  type="text"
                  value={formData.account_holder_name}
                  onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                    formErrors.account_holder_name
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {formErrors.account_holder_name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {formErrors.account_holder_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CPF/CNPJ do Titular
                </label>
                <input
                  type="text"
                  value={formData.account_holder_document}
                  onChange={(e) => setFormData({ ...formData, account_holder_document: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                    formErrors.account_holder_document
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {formErrors.account_holder_document && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {formErrors.account_holder_document}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Banco (opcional)
                </label>
                <input
                  type="text"
                  value={formData.bank_name || ''}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Banco do Brasil"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  {editingKey ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}