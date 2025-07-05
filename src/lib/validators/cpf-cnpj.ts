/**
 * Validador de CPF e CNPJ
 * Implementação local sem dependências externas
 */

/**
 * Remove caracteres não numéricos
 */
function cleanDocument(doc: string): string {
  return doc.replace(/\D/g, '')
}

/**
 * Valida CPF
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cleanDocument(cpf)
  
  // Verifica se tem 11 dígitos
  if (cleaned.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (parseInt(cleaned.charAt(9)) !== digit) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (parseInt(cleaned.charAt(10)) !== digit) return false
  
  return true
}

/**
 * Valida CNPJ
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cleanDocument(cnpj)
  
  // Verifica se tem 14 dígitos
  if (cleaned.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleaned)) return false
  
  // Validação do primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights1[i]
  }
  let digit = sum % 11
  if (digit < 2) digit = 0
  else digit = 11 - digit
  if (parseInt(cleaned.charAt(12)) !== digit) return false
  
  // Validação do segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights2[i]
  }
  digit = sum % 11
  if (digit < 2) digit = 0
  else digit = 11 - digit
  if (parseInt(cleaned.charAt(13)) !== digit) return false
  
  return true
}

/**
 * Valida CPF ou CNPJ
 */
export function validateDocument(doc: string): {
  valid: boolean
  type: 'cpf' | 'cnpj' | null
  formatted: string | null
} {
  const cleaned = cleanDocument(doc)
  
  if (cleaned.length === 11 && validateCPF(cleaned)) {
    return {
      valid: true,
      type: 'cpf',
      formatted: formatCPF(cleaned)
    }
  }
  
  if (cleaned.length === 14 && validateCNPJ(cleaned)) {
    return {
      valid: true,
      type: 'cnpj',
      formatted: formatCNPJ(cleaned)
    }
  }
  
  return {
    valid: false,
    type: null,
    formatted: null
  }
}

/**
 * Formata CPF
 */
export function formatCPF(cpf: string): string {
  const cleaned = cleanDocument(cpf)
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata CNPJ
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cleanDocument(cnpj)
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Gera CPF válido (apenas para testes)
 */
export function generateCPF(): string {
  const random = () => Math.floor(Math.random() * 9)
  const numbers = Array(9).fill(0).map(random)
  
  // Primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += numbers[i] * (10 - i)
  }
  let digit1 = 11 - (sum % 11)
  if (digit1 > 9) digit1 = 0
  numbers.push(digit1)
  
  // Segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += numbers[i] * (11 - i)
  }
  let digit2 = 11 - (sum % 11)
  if (digit2 > 9) digit2 = 0
  numbers.push(digit2)
  
  return numbers.join('')
}