'use client'

import { useState, useEffect } from 'react'
import { Check, X, AlertCircle } from 'lucide-react'
import { validateDocument, formatCPF, formatCNPJ } from '@/lib/validators/cpf-cnpj'

interface DocumentInputProps {
  value: string
  onChange: (value: string, isValid: boolean, type: 'cpf' | 'cnpj' | null) => void
  label?: string
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  className?: string
}

export function DocumentInput({
  value,
  onChange,
  label = 'CPF/CNPJ',
  placeholder = 'Digite seu CPF ou CNPJ',
  required = false,
  error,
  disabled = false,
  className = ''
}: DocumentInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)
  const [validation, setValidation] = useState<ReturnType<typeof validateDocument> | null>(null)

  useEffect(() => {
    if (!isFocused && value) {
      const result = validateDocument(value)
      setValidation(result)
      if (result.formatted) {
        setDisplayValue(result.formatted)
      }
    }
  }, [value, isFocused])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setDisplayValue(newValue)
    
    // Remove formatação para validar
    const cleaned = newValue.replace(/\D/g, '')
    
    // Valida em tempo real após digitar CPF ou CNPJ completo
    if (cleaned.length === 11 || cleaned.length === 14) {
      const result = validateDocument(cleaned)
      setValidation(result)
      onChange(cleaned, result.valid, result.type)
    } else {
      setValidation(null)
      onChange(cleaned, false, null)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (displayValue) {
      const result = validateDocument(displayValue)
      setValidation(result)
      if (result.formatted) {
        setDisplayValue(result.formatted)
      }
      onChange(displayValue.replace(/\D/g, ''), result.valid, result.type)
    }
  }

  const getStatusIcon = () => {
    if (!displayValue) return null
    
    if (validation?.valid) {
      return <Check className="h-5 w-5 text-green-500" />
    }
    
    if (validation !== null && !validation.valid && displayValue.replace(/\D/g, '').length >= 11) {
      return <X className="h-5 w-5 text-red-500" />
    }
    
    return null
  }

  const getHelperText = () => {
    if (error) return error
    
    if (validation?.valid && validation.type) {
      return `${validation.type.toUpperCase()} válido`
    }
    
    if (validation !== null && !validation.valid && displayValue.replace(/\D/g, '').length >= 11) {
      return 'Documento inválido'
    }
    
    const cleaned = displayValue.replace(/\D/g, '')
    if (cleaned.length > 0 && cleaned.length < 11) {
      return `Digite mais ${11 - cleaned.length} dígitos`
    }
    
    return null
  }

  const inputClasses = `
    w-full px-4 py-2 pr-10 rounded-lg border transition-all duration-200
    ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'}
    ${validation?.valid 
      ? 'border-green-500 focus:border-green-500 focus:ring-green-500' 
      : validation !== null && !validation.valid && displayValue.replace(/\D/g, '').length >= 11
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500'
    }
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    ${className}
  `

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          maxLength={18} // CPF: 14 chars, CNPJ: 18 chars com formatação
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {getStatusIcon()}
        </div>
      </div>
      
      {getHelperText() && (
        <p className={`text-sm ${
          error || (validation !== null && !validation.valid && displayValue.replace(/\D/g, '').length >= 11)
            ? 'text-red-600 dark:text-red-400' 
            : validation?.valid
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {getHelperText()}
        </p>
      )}
    </div>
  )
}