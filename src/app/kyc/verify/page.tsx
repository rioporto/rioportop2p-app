'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  User,
  FileText,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Shield,
  Eye,
  Download
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface VerificationStep {
  id: number
  title: string
  description: string
  completed: boolean
}

interface UploadedFile {
  name: string
  size: number
  type: string
  url?: string
  status: 'uploading' | 'success' | 'error'
}

export default function KYCVerifyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [targetLevel, setTargetLevel] = useState(2)
  const [currentStep, setCurrentStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    birthDate: '',
    phone: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    monthlyIncome: '',
    occupation: '',
    pep: false // Pessoa Exposta Politicamente
  })

  // Documents
  const [documents, setDocuments] = useState({
    identity: null as UploadedFile | null,
    selfie: null as UploadedFile | null,
    addressProof: null as UploadedFile | null,
    incomeProof: null as UploadedFile | null
  })

  const steps: VerificationStep[] = [
    {
      id: 1,
      title: 'Informações Pessoais',
      description: 'Complete seus dados pessoais',
      completed: false
    },
    {
      id: 2,
      title: 'Documento de Identidade',
      description: 'Envie seu RG ou CNH',
      completed: false
    },
    {
      id: 3,
      title: 'Selfie com Documento',
      description: 'Tire uma foto segurando seu documento',
      completed: false
    },
    {
      id: 4,
      title: 'Comprovante de Endereço',
      description: 'Envie uma conta recente',
      completed: false
    },
    ...(targetLevel === 3 ? [{
      id: 5,
      title: 'Comprovante de Renda',
      description: 'Envie comprovante dos últimos 3 meses',
      completed: false
    }] : [])
  ]

  useEffect(() => {
    checkAuth()
    loadUserData()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }
  }

  const loadUserData = async () => {
    try {
      // Carregar dados do usuário e nível atual
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: keyof typeof documents) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 10MB.')
      return
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não permitido. Use JPG, PNG ou PDF.')
      return
    }

    setError('')
    const uploadedFile: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading'
    }

    setDocuments(prev => ({ ...prev, [type]: uploadedFile }))

    try {
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setDocuments(prev => ({
        ...prev,
        [type]: { ...uploadedFile, status: 'success', url: URL.createObjectURL(file) }
      }))
    } catch (error) {
      setDocuments(prev => ({
        ...prev,
        [type]: { ...uploadedFile, status: 'error' }
      }))
      setError('Erro ao enviar arquivo. Tente novamente.')
    }
  }

  const removeFile = (type: keyof typeof documents) => {
    setDocuments(prev => ({ ...prev, [type]: null }))
  }

  const validatePersonalInfo = () => {
    if (!formData.fullName || !formData.cpf || !formData.birthDate || !formData.phone) {
      setError('Preencha todos os campos obrigatórios')
      return false
    }

    // Validar CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    if (!cpfRegex.test(formData.cpf)) {
      setError('CPF inválido. Use o formato: 000.000.000-00')
      return false
    }

    // Validar idade (maior de 18)
    const birthDate = new Date(formData.birthDate)
    const age = new Date().getFullYear() - birthDate.getFullYear()
    if (age < 18) {
      setError('Você deve ter pelo menos 18 anos')
      return false
    }

    return true
  }

  const handleNextStep = () => {
    setError('')

    if (currentStep === 1 && !validatePersonalInfo()) {
      return
    }

    if (currentStep === 2 && !documents.identity) {
      setError('Envie seu documento de identidade')
      return
    }

    if (currentStep === 3 && !documents.selfie) {
      setError('Envie sua selfie com o documento')
      return
    }

    if (currentStep === 4 && !documents.addressProof) {
      setError('Envie seu comprovante de endereço')
      return
    }

    if (currentStep === 5 && targetLevel === 3 && !documents.incomeProof) {
      setError('Envie seu comprovante de renda')
      return
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setUploading(true)
    setError('')

    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (error) {
      setError('Erro ao enviar verificação. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verificação Enviada!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Analisaremos seus documentos em até 24 horas
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Redirecionando para o dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/kyc" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Verificação KYC - Nível {targetLevel}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Complete todos os passos para aumentar seus limites
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Dados protegidos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep > step.id
                    ? 'bg-green-600 border-green-600 text-white'
                    : currentStep === step.id
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`h-1 w-full mx-2 ${
                    currentStep > step.id
                      ? 'bg-green-600'
                      : 'bg-gray-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="João da Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                </div>
              </div>

              {targetLevel >= 2 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                    Endereço Residencial
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CEP
                      </label>
                      <input
                        type="text"
                        value={formData.address.zipCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, zipCode: formatZipCode(e.target.value) }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rua
                      </label>
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, street: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Rua das Flores"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        value={formData.address.number}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, number: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={formData.address.complement}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, complement: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Apto 101"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={formData.address.neighborhood}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, neighborhood: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Centro"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="São Paulo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Estado
                      </label>
                      <select
                        value={formData.address.state}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Selecione</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        {/* Adicionar outros estados */}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {targetLevel === 3 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                    Informações Financeiras
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Renda Mensal
                      </label>
                      <select
                        value={formData.monthlyIncome}
                        onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Selecione</option>
                        <option value="0-3000">Até R$ 3.000</option>
                        <option value="3000-6000">R$ 3.000 - R$ 6.000</option>
                        <option value="6000-10000">R$ 6.000 - R$ 10.000</option>
                        <option value="10000-20000">R$ 10.000 - R$ 20.000</option>
                        <option value="20000+">Acima de R$ 20.000</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profissão
                      </label>
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Ex: Engenheiro de Software"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.pep}
                        onChange={(e) => setFormData({ ...formData, pep: e.target.checked })}
                        className="rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Sou uma Pessoa Exposta Politicamente (PEP)
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                      PEP são pessoas que desempenham ou desempenharam funções públicas relevantes
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Identity Document */}
        {currentStep === 2 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Instruções para o documento
                </h3>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                  <li>• Use RG ou CNH (frente e verso)</li>
                  <li>• Documento deve estar válido e legível</li>
                  <li>• Foto colorida e sem cortes</li>
                  <li>• Tamanho máximo: 10MB</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8">
                {documents.identity ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {documents.identity.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(documents.identity.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {documents.identity.status === 'uploading' && (
                          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                        )}
                        {documents.identity.status === 'success' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <button
                          onClick={() => removeFile('identity')}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {documents.identity.url && (
                      <div className="flex justify-center">
                        <img
                          src={documents.identity.url}
                          alt="Documento"
                          className="max-h-64 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, 'identity')}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Clique para enviar ou arraste o arquivo aqui
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        JPG, PNG ou PDF até 10MB
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Selfie with Document */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                  Como tirar a selfie
                </h3>
                <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                  <li>• Segure seu documento ao lado do rosto</li>
                  <li>• Certifique-se que o documento esteja legível</li>
                  <li>• Boa iluminação, sem reflexos</li>
                  <li>• Rosto e documento visíveis na mesma foto</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8">
                {documents.selfie ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Camera className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {documents.selfie.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(documents.selfie.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {documents.selfie.status === 'uploading' && (
                          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                        )}
                        {documents.selfie.status === 'success' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <button
                          onClick={() => removeFile('selfie')}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {documents.selfie.url && (
                      <div className="flex justify-center">
                        <img
                          src={documents.selfie.url}
                          alt="Selfie"
                          className="max-h-64 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'selfie')}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Clique para tirar ou enviar foto
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        JPG ou PNG até 10MB
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Address Proof */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                  Comprovantes aceitos
                </h3>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-400">
                  <li>• Conta de luz, água, gás ou telefone</li>
                  <li>• Fatura de cartão de crédito</li>
                  <li>• Contrato de aluguel</li>
                  <li>• Máximo 3 meses de emissão</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8">
                {documents.addressProof ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {documents.addressProof.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(documents.addressProof.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {documents.addressProof.status === 'uploading' && (
                          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                        )}
                        {documents.addressProof.status === 'success' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <button
                          onClick={() => removeFile('addressProof')}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, 'addressProof')}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Clique para enviar ou arraste o arquivo aqui
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        JPG, PNG ou PDF até 10MB
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Income Proof (Level 3) */}
        {currentStep === 5 && targetLevel === 3 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  Comprovantes de renda aceitos
                </h3>
                <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-400">
                  <li>• Holerite ou contracheque</li>
                  <li>• Extrato bancário dos últimos 3 meses</li>
                  <li>• Declaração de Imposto de Renda</li>
                  <li>• Pró-labore ou contrato social (empresários)</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8">
                {documents.incomeProof ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {documents.incomeProof.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(documents.incomeProof.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {documents.incomeProof.status === 'uploading' && (
                          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                        )}
                        {documents.incomeProof.status === 'success' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <button
                          onClick={() => removeFile('incomeProof')}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, 'incomeProof')}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Clique para enviar ou arraste o arquivo aqui
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        JPG, PNG ou PDF até 10MB
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Voltar
          </button>

          <button
            onClick={handleNextStep}
            disabled={uploading}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : currentStep === steps.length ? (
              <span>Finalizar Verificação</span>
            ) : (
              <span>Próximo</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}