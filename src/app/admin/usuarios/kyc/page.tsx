'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  AlertCircle,
  FileText,
  Camera,
  MapPin,
  Phone,
  CreditCard,
  X
} from 'lucide-react'

interface KYCVerification {
  id: string
  userId: string
  userName: string
  userEmail: string
  cpf: string
  level: 'basic' | 'intermediate' | 'complete'
  status: 'pending' | 'approved' | 'rejected' | 'manual_review'
  submittedAt: string
  documents: {
    type: string
    status: 'pending' | 'approved' | 'rejected'
    url?: string
  }[]
  verifications: {
    cpf: boolean
    phone: boolean
    address: boolean
    document: boolean
    facial: boolean
  }
}

const mockKYCData: KYCVerification[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'João Silva',
    userEmail: 'joao.silva@email.com',
    cpf: '123.456.789-00',
    level: 'intermediate',
    status: 'pending',
    submittedAt: '2024-01-10T10:30:00',
    documents: [
      { type: 'RG Frente', status: 'approved' },
      { type: 'RG Verso', status: 'approved' },
      { type: 'Selfie', status: 'pending' },
      { type: 'Comprovante Residência', status: 'pending' }
    ],
    verifications: {
      cpf: true,
      phone: true,
      address: false,
      document: false,
      facial: false
    }
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Maria Santos',
    userEmail: 'maria.santos@email.com',
    cpf: '987.654.321-00',
    level: 'complete',
    status: 'manual_review',
    submittedAt: '2024-01-10T09:15:00',
    documents: [
      { type: 'CNH', status: 'approved' },
      { type: 'Selfie', status: 'approved' },
      { type: 'Comprovante Residência', status: 'rejected' }
    ],
    verifications: {
      cpf: true,
      phone: true,
      address: false,
      document: true,
      facial: true
    }
  }
]

export default function KYCManagement() {
  const [verifications, setVerifications] = useState(mockKYCData)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedVerification, setSelectedVerification] = useState<KYCVerification | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleApprove = (id: string) => {
    setVerifications(prev =>
      prev.map(v => v.id === id ? { ...v, status: 'approved' as const } : v)
    )
    setSelectedVerification(null)
  }

  const handleReject = (id: string) => {
    setVerifications(prev =>
      prev.map(v => v.id === id ? { ...v, status: 'rejected' as const } : v)
    )
    setSelectedVerification(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'manual_review':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      manual_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    }

    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
      manual_review: 'Revisão Manual'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getVerificationIcon = (type: keyof KYCVerification['verifications']) => {
    const icons = {
      cpf: <CreditCard className="w-4 h-4" />,
      phone: <Phone className="w-4 h-4" />,
      address: <MapPin className="w-4 h-4" />,
      document: <FileText className="w-4 h-4" />,
      facial: <Camera className="w-4 h-4" />
    }
    return icons[type]
  }

  const filteredVerifications = verifications.filter(v => {
    const matchesStatus = selectedStatus === 'all' || v.status === selectedStatus
    const matchesSearch = v.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.cpf.includes(searchQuery)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">KYC - Verificações Pendentes</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredVerifications.filter(v => v.status === 'pending').length} pendentes
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou CPF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="manual_review">Revisão Manual</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Rejeitados</option>
            </select>
          </div>
        </div>
      </div>

      {/* KYC List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nível KYC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Verificações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredVerifications.map((verification) => (
                <tr key={verification.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {verification.userName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {verification.userEmail}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        CPF: {verification.cpf}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {verification.level}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {Object.entries(verification.verifications).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-1 rounded ${
                            value 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                          }`}
                          title={key}
                        >
                          {getVerificationIcon(key as keyof KYCVerification['verifications'])}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(verification.status)}
                      {getStatusBadge(verification.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(verification.submittedAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedVerification(verification)}
                      className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Verificação KYC - {selectedVerification.userName}
              </h3>
              <button
                onClick={() => setSelectedVerification(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Info */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Informações do Usuário</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nome:</span> {selectedVerification.userName}</p>
                  <p><span className="font-medium">Email:</span> {selectedVerification.userEmail}</p>
                  <p><span className="font-medium">CPF:</span> {selectedVerification.cpf}</p>
                  <p><span className="font-medium">Nível Solicitado:</span> {selectedVerification.level}</p>
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Status das Verificações</h4>
                <div className="space-y-2">
                  {Object.entries(selectedVerification.verifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getVerificationIcon(key as keyof KYCVerification['verifications'])}
                        <span className="text-sm capitalize">{key}</span>
                      </div>
                      {value ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Documentos Enviados</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedVerification.documents.map((doc, index) => (
                  <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{doc.type}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Status: {getStatusBadge(doc.status)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {selectedVerification.status === 'pending' || selectedVerification.status === 'manual_review' ? (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => handleReject(selectedVerification.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Rejeitar
                </button>
                <button
                  onClick={() => handleApprove(selectedVerification.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Aprovar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}