'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  User,
  FileText,
  Image,
  Calendar,
  Clock,
  Shield,
  AlertTriangle
} from 'lucide-react'

interface Verification {
  id: number
  userId: number
  userName: string
  userEmail: string
  type: 'identity' | 'address' | 'selfie' | 'financial'
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  documents: string[]
  notes?: string
  kycLevel: number
}

const mockVerifications: Verification[] = [
  {
    id: 1,
    userId: 101,
    userName: 'João Silva',
    userEmail: 'joao.silva@email.com',
    type: 'identity',
    status: 'pending',
    submittedAt: '2024-03-15 14:30',
    documents: ['rg_frente.jpg', 'rg_verso.jpg'],
    kycLevel: 1,
  },
  {
    id: 2,
    userId: 102,
    userName: 'Maria Santos',
    userEmail: 'maria.santos@email.com',
    type: 'address',
    status: 'approved',
    submittedAt: '2024-03-14 10:15',
    reviewedAt: '2024-03-14 11:30',
    reviewedBy: 'Admin Carlos',
    documents: ['comprovante_residencia.pdf'],
    kycLevel: 2,
  },
  {
    id: 3,
    userId: 103,
    userName: 'Pedro Costa',
    userEmail: 'pedro.costa@email.com',
    type: 'selfie',
    status: 'rejected',
    submittedAt: '2024-03-13 16:45',
    reviewedAt: '2024-03-13 17:20',
    reviewedBy: 'Admin Ana',
    documents: ['selfie_documento.jpg'],
    notes: 'Foto fora de foco, documento ilegível',
    kycLevel: 2,
  },
  {
    id: 4,
    userId: 104,
    userName: 'Ana Oliveira',
    userEmail: 'ana.oliveira@email.com',
    type: 'financial',
    status: 'pending',
    submittedAt: '2024-03-15 09:00',
    documents: ['declaracao_ir.pdf', 'extrato_bancario.pdf'],
    kycLevel: 3,
  },
  {
    id: 5,
    userId: 105,
    userName: 'Carlos Mendes',
    userEmail: 'carlos.mendes@email.com',
    type: 'identity',
    status: 'expired',
    submittedAt: '2023-03-15 14:30',
    reviewedAt: '2023-03-16 10:00',
    reviewedBy: 'Admin João',
    documents: ['cnh.jpg'],
    notes: 'Documento vencido',
    kycLevel: 1,
  },
]

const typeConfig = {
  identity: { label: 'Identidade', icon: User, color: 'text-blue-600' },
  address: { label: 'Endereço', icon: FileText, color: 'text-green-600' },
  selfie: { label: 'Selfie', icon: Image, color: 'text-purple-600' },
  financial: { label: 'Financeiro', icon: Shield, color: 'text-orange-600' },
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente', icon: Clock },
  approved: { color: 'bg-green-100 text-green-800', label: 'Aprovado', icon: CheckCircle },
  rejected: { color: 'bg-red-100 text-red-800', label: 'Rejeitado', icon: XCircle },
  expired: { color: 'bg-gray-100 text-gray-800', label: 'Expirado', icon: AlertTriangle },
}

export default function VerificationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredVerifications = mockVerifications.filter(verification => {
    const matchesSearch = 
      verification.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === null || verification.type === selectedType
    const matchesStatus = selectedStatus === null || verification.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const pendingCount = mockVerifications.filter(v => v.status === 'pending').length
  const approvedCount = mockVerifications.filter(v => v.status === 'approved').length
  const rejectedCount = mockVerifications.filter(v => v.status === 'rejected').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verificações KYC</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600">
            Configurações KYC
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rejeitadas</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5h</p>
            </div>
            <AlertCircle className="w-8 h-8 text-gray-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os Tipos</option>
              <option value="identity">Identidade</option>
              <option value="address">Endereço</option>
              <option value="selfie">Selfie</option>
              <option value="financial">Financeiro</option>
            </select>
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos Status</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovadas</option>
              <option value="rejected">Rejeitadas</option>
              <option value="expired">Expiradas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Verifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredVerifications.map((verification) => {
            const TypeIcon = typeConfig[verification.type].icon
            const StatusIcon = statusConfig[verification.status].icon
            
            return (
              <div key={verification.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon className={`w-5 h-5 ${typeConfig[verification.type].color}`} />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {typeConfig[verification.type].label}
                        </span>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[verification.status].color}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {statusConfig[verification.status].label}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        KYC Nível {verification.kycLevel}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {verification.userName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {verification.userEmail}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Enviado: {verification.submittedAt}</span>
                      </div>
                      {verification.reviewedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Revisado: {verification.reviewedAt}</span>
                        </div>
                      )}
                      {verification.reviewedBy && (
                        <span>Por: {verification.reviewedBy}</span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      {verification.documents.map((doc, index) => (
                        <span key={index} className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                          {doc}
                        </span>
                      ))}
                    </div>

                    {verification.notes && (
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Observações:</span> {verification.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {verification.status === 'pending' && (
                      <>
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                          Aprovar
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                          Rejeitar
                        </button>
                      </>
                    )}
                    <button className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}