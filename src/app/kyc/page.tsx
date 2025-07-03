'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  Check, 
  X,
  Upload,
  Phone,
  MapPin,
  CreditCard,
  Camera,
  FileText,
  AlertCircle,
  ChevronRight,
  Loader2
} from 'lucide-react'

interface KYCLevel {
  level: 'basic' | 'intermediate' | 'complete'
  name: string
  description: string
  limits: {
    daily: string
    monthly: string
    perTransaction: string
  }
  requirements: string[]
  features: string[]
}

const kycLevels: KYCLevel[] = [
  {
    level: 'basic',
    name: 'Básico',
    description: 'Verificação inicial para começar a usar a plataforma',
    limits: {
      daily: 'R$ 1.000',
      monthly: 'R$ 5.000',
      perTransaction: 'R$ 1.000'
    },
    requirements: ['Email verificado'],
    features: ['Comprar crypto', 'Vender crypto']
  },
  {
    level: 'intermediate',
    name: 'Intermediário',
    description: 'Aumenta seus limites e desbloqueia mais recursos',
    limits: {
      daily: 'R$ 10.000',
      monthly: 'R$ 50.000',
      perTransaction: 'R$ 5.000'
    },
    requirements: ['Email verificado', 'CPF validado', 'Telefone verificado'],
    features: ['Comprar crypto', 'Vender crypto', 'Sacar para conta bancária']
  },
  {
    level: 'complete',
    name: 'Completo',
    description: 'Acesso total a todos os recursos da plataforma',
    limits: {
      daily: 'R$ 100.000',
      monthly: 'R$ 500.000',
      perTransaction: 'R$ 50.000'
    },
    requirements: [
      'Email verificado',
      'CPF validado',
      'Telefone verificado',
      'Documento com foto',
      'Comprovante de residência',
      'Selfie de verificação'
    ],
    features: [
      'Comprar crypto',
      'Vender crypto',
      'Sacar para conta bancária',
      'Transações OTC',
      'Conta merchant'
    ]
  }
]

interface VerificationStep {
  id: string
  name: string
  description: string
  icon: any
  status: 'pending' | 'verified' | 'failed'
  requiredFor: ('basic' | 'intermediate' | 'complete')[]
}

export default function KYCPage() {
  const router = useRouter()
  const [currentLevel, setCurrentLevel] = useState<'basic' | 'intermediate' | 'complete'>('basic')
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [activeStep, setActiveStep] = useState<string | null>(null)
  
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
      id: 'email',
      name: 'Email',
      description: 'Email verificado',
      icon: FileText,
      status: 'verified',
      requiredFor: ['basic', 'intermediate', 'complete']
    },
    {
      id: 'cpf',
      name: 'CPF',
      description: 'Validação do CPF',
      icon: CreditCard,
      status: 'pending',
      requiredFor: ['intermediate', 'complete']
    },
    {
      id: 'phone',
      name: 'Telefone',
      description: 'Verificação por SMS',
      icon: Phone,
      status: 'pending',
      requiredFor: ['intermediate', 'complete']
    },
    {
      id: 'document',
      name: 'Documento',
      description: 'RG, CNH ou Passaporte',
      icon: FileText,
      status: 'pending',
      requiredFor: ['complete']
    },
    {
      id: 'address',
      name: 'Endereço',
      description: 'Comprovante de residência',
      icon: MapPin,
      status: 'pending',
      requiredFor: ['complete']
    },
    {
      id: 'selfie',
      name: 'Selfie',
      description: 'Foto de verificação',
      icon: Camera,
      status: 'pending',
      requiredFor: ['complete']
    }
  ])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleVerification = async (stepId: string) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setVerificationSteps(steps =>
        steps.map(step =>
          step.id === stepId ? { ...step, status: 'verified' } : step
        )
      )
      setLoading(false)
      setActiveStep(null)
    }, 2000)
  }

  const getNextLevel = () => {
    if (currentLevel === 'basic') return 'intermediate'
    if (currentLevel === 'intermediate') return 'complete'
    return 'complete'
  }

  const canUpgradeToLevel = (level: 'basic' | 'intermediate' | 'complete') => {
    const requiredSteps = verificationSteps.filter(step => step.requiredFor.includes(level))
    return requiredSteps.every(step => step.status === 'verified')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verificação KYC</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Complete sua verificação para aumentar seus limites e desbloquear novos recursos
          </p>
        </div>

        {/* Current Level */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Seu Nível Atual</h2>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {kycLevels.find(l => l.level === currentLevel)?.name}
              </p>
            </div>
            <div className="h-20 w-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* KYC Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {kycLevels.map((level) => {
            const isCurrentLevel = level.level === currentLevel
            const isCompleted = currentLevel === 'complete' || 
              (currentLevel === 'intermediate' && level.level === 'basic')
            
            return (
              <div
                key={level.level}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 p-6 ${
                  isCurrentLevel
                    ? 'border-orange-500'
                    : isCompleted
                    ? 'border-green-500'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {level.name}
                  </h3>
                  {isCompleted && (
                    <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {level.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Limites</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Diário: {level.limits.daily}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Mensal: {level.limits.monthly}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Requisitos</p>
                  {level.requirements.map((req, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Check className="h-4 w-4 text-gray-400 mr-2" />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Verification Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Etapas de Verificação
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {verificationSteps.map((step) => {
              const Icon = step.icon
              const isActive = activeStep === step.id
              
              return (
                <div key={step.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        step.status === 'verified'
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : step.status === 'failed'
                          ? 'bg-red-100 dark:bg-red-900/20'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {step.status === 'verified' ? (
                          <Check className="h-6 w-6 text-green-600" />
                        ) : step.status === 'failed' ? (
                          <X className="h-6 w-6 text-red-600" />
                        ) : (
                          <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {step.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    {step.status === 'pending' && (
                      <button
                        onClick={() => setActiveStep(isActive ? null : step.id)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                      >
                        <span>Verificar</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {isActive && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      {step.id === 'cpf' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              CPF
                            </label>
                            <input
                              type="text"
                              placeholder="000.000.000-00"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                            />
                          </div>
                          <button
                            onClick={() => handleVerification(step.id)}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            {loading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              'Validar CPF'
                            )}
                          </button>
                        </div>
                      )}
                      
                      {step.id === 'phone' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Telefone
                            </label>
                            <input
                              type="tel"
                              placeholder="(00) 00000-0000"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                            />
                          </div>
                          <button
                            onClick={() => handleVerification(step.id)}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            {loading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              'Enviar SMS'
                            )}
                          </button>
                        </div>
                      )}
                      
                      {(step.id === 'document' || step.id === 'address' || step.id === 'selfie') && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Fazer upload do documento
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                              <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                  <label htmlFor={`file-upload-${step.id}`} className="relative cursor-pointer rounded-md font-medium text-orange-600 hover:text-orange-500">
                                    <span>Enviar arquivo</span>
                                    <input
                                      id={`file-upload-${step.id}`}
                                      name={`file-upload-${step.id}`}
                                      type="file"
                                      className="sr-only"
                                      onChange={handleFileUpload}
                                      accept="image/*,.pdf"
                                    />
                                  </label>
                                  <p className="pl-1">ou arraste e solte</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PNG, JPG, PDF até 10MB
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {selectedFile && (
                            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {selectedFile.name}
                              </span>
                              <button
                                onClick={() => setSelectedFile(null)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          
                          <button
                            onClick={() => handleVerification(step.id)}
                            disabled={loading || !selectedFile}
                            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            {loading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              'Enviar Documento'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Info Alert */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Informações importantes
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                <ul className="list-disc list-inside space-y-1">
                  <li>Seus documentos são protegidos com criptografia de ponta a ponta</li>
                  <li>A verificação pode levar até 24 horas úteis</li>
                  <li>Você será notificado por email sobre o status da verificação</li>
                  <li>Em caso de dúvidas, entre em contato com nosso suporte</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}