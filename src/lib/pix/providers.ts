// PIX Payment Provider Integrations
// This file contains the base structure for integrating with various PIX payment providers

export interface PixPaymentProvider {
  name: string
  createPayment(params: CreatePixPaymentParams): Promise<PixPaymentResponse>
  getPaymentStatus(paymentId: string): Promise<PixPaymentStatus>
  generateQRCode(params: GenerateQRCodeParams): Promise<QRCodeResponse>
  validateWebhook(payload: any, signature: string): boolean
}

export interface CreatePixPaymentParams {
  amount: number
  description?: string
  externalReference: string
  payerEmail?: string
  payerName?: string
  expirationMinutes?: number
}

export interface PixPaymentResponse {
  id: string
  status: 'pending' | 'paid' | 'failed' | 'expired'
  qrCode: string
  qrCodeImage?: string
  pixKey: string
  expiresAt: Date
  provider: string
}

export interface PixPaymentStatus {
  id: string
  status: 'pending' | 'paid' | 'failed' | 'expired'
  paidAt?: Date
  endToEndId?: string
  payerName?: string
  payerDocument?: string
}

export interface GenerateQRCodeParams {
  pixKey: string
  amount: number
  merchantName: string
  merchantCity: string
  transactionId: string
}

export interface QRCodeResponse {
  qrCodeString: string
  qrCodeImage?: string
}

// MercadoPago Provider
export class MercadoPagoProvider implements PixPaymentProvider {
  name = 'mercadopago'
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async createPayment(params: CreatePixPaymentParams): Promise<PixPaymentResponse> {
    // In production, this would call MercadoPago's API
    // For now, return mock data
    return {
      id: `mp_${Date.now()}`,
      status: 'pending',
      qrCode: `00020126330014BR.GOV.BCB.PIX0111${params.externalReference}`,
      pixKey: 'mercadopago@rioportop2p.com',
      expiresAt: new Date(Date.now() + (params.expirationMinutes || 30) * 60 * 1000),
      provider: this.name
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PixPaymentStatus> {
    // Mock implementation
    return {
      id: paymentId,
      status: 'pending'
    }
  }

  async generateQRCode(params: GenerateQRCodeParams): Promise<QRCodeResponse> {
    // Mock implementation
    const qrCodeString = this.generatePixString(params)
    return {
      qrCodeString,
      qrCodeImage: `data:image/png;base64,mockQRCodeImage`
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    // In production, validate using HMAC-SHA256 with webhook secret
    return true
  }

  private generatePixString(params: GenerateQRCodeParams): string {
    // Simplified PIX EMV format generation
    const merchantAccount = `0014BR.GOV.BCB.PIX01${params.pixKey.length.toString().padStart(2, '0')}${params.pixKey}`
    const merchantInfo = `26${merchantAccount.length.toString().padStart(2, '0')}${merchantAccount}`
    const transactionAmount = params.amount.toFixed(2)
    const amountField = `54${transactionAmount.length.toString().padStart(2, '0')}${transactionAmount}`
    
    return `00020101021${merchantInfo}52040000530398${amountField}5802BR`
  }
}

// PagSeguro Provider
export class PagSeguroProvider implements PixPaymentProvider {
  name = 'pagseguro'
  private email: string
  private token: string

  constructor(email: string, token: string) {
    this.email = email
    this.token = token
  }

  async createPayment(params: CreatePixPaymentParams): Promise<PixPaymentResponse> {
    // Mock implementation
    return {
      id: `ps_${Date.now()}`,
      status: 'pending',
      qrCode: `00020126330014BR.GOV.BCB.PIX0111${params.externalReference}`,
      pixKey: 'pagseguro@rioportop2p.com',
      expiresAt: new Date(Date.now() + (params.expirationMinutes || 30) * 60 * 1000),
      provider: this.name
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PixPaymentStatus> {
    // Mock implementation
    return {
      id: paymentId,
      status: 'pending'
    }
  }

  async generateQRCode(params: GenerateQRCodeParams): Promise<QRCodeResponse> {
    // Mock implementation
    return {
      qrCodeString: 'mock_qr_code_string',
      qrCodeImage: 'mock_qr_code_image'
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    // Mock validation
    return true
  }
}

// Gerencianet/Efí Provider
export class GerencianetProvider implements PixPaymentProvider {
  name = 'gerencianet'
  private clientId: string
  private clientSecret: string

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  async createPayment(params: CreatePixPaymentParams): Promise<PixPaymentResponse> {
    // Mock implementation
    return {
      id: `gn_${Date.now()}`,
      status: 'pending',
      qrCode: `00020126330014BR.GOV.BCB.PIX0111${params.externalReference}`,
      pixKey: 'gerencianet@rioportop2p.com',
      expiresAt: new Date(Date.now() + (params.expirationMinutes || 30) * 60 * 1000),
      provider: this.name
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PixPaymentStatus> {
    // Mock implementation
    return {
      id: paymentId,
      status: 'pending'
    }
  }

  async generateQRCode(params: GenerateQRCodeParams): Promise<QRCodeResponse> {
    // Mock implementation
    return {
      qrCodeString: 'mock_qr_code_string',
      qrCodeImage: 'mock_qr_code_image'
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    // Mock validation
    return true
  }
}

// Manual Provider (for direct PIX without payment gateway)
export class ManualPixProvider implements PixPaymentProvider {
  name = 'manual'

  async createPayment(params: CreatePixPaymentParams): Promise<PixPaymentResponse> {
    // For manual PIX, we don't create a payment in an external system
    return {
      id: `manual_${Date.now()}`,
      status: 'pending',
      qrCode: 'manual_pix_key',
      pixKey: 'manual_pix_key',
      expiresAt: new Date(Date.now() + (params.expirationMinutes || 30) * 60 * 1000),
      provider: this.name
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PixPaymentStatus> {
    // Manual payments are confirmed by the user
    return {
      id: paymentId,
      status: 'pending'
    }
  }

  async generateQRCode(params: GenerateQRCodeParams): Promise<QRCodeResponse> {
    const qrCodeString = this.generatePixString(params)
    return {
      qrCodeString
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    // No webhook validation for manual payments
    return true
  }

  private generatePixString(params: GenerateQRCodeParams): string {
    // Generate a proper PIX EMV string
    let pixString = '000201' // Payload Format Indicator
    pixString += '010211' // Point of Initiation Method (11 = static)
    
    // Merchant Account Information
    const gui = '0014BR.GOV.BCB.PIX'
    const key = `01${params.pixKey.length.toString().padStart(2, '0')}${params.pixKey}`
    const merchantAccount = gui + key
    pixString += `26${merchantAccount.length.toString().padStart(2, '0')}${merchantAccount}`
    
    // Merchant Category Code
    pixString += '52040000'
    
    // Transaction Currency (986 = BRL)
    pixString += '5303986'
    
    // Transaction Amount
    if (params.amount > 0) {
      const amountStr = params.amount.toFixed(2)
      pixString += `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`
    }
    
    // Country Code
    pixString += '5802BR'
    
    // Merchant Name
    const merchantName = params.merchantName.substring(0, 25)
    pixString += `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`
    
    // Merchant City
    const merchantCity = params.merchantCity.substring(0, 15)
    pixString += `60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`
    
    // Additional Data Field Template
    const txid = `05${params.transactionId.length.toString().padStart(2, '0')}${params.transactionId}`
    pixString += `62${txid.length.toString().padStart(2, '0')}${txid}`
    
    // CRC16 (placeholder - in production, calculate actual CRC16)
    pixString += '6304ABCD'
    
    return pixString
  }
}

// Factory function to create provider instances
export function createPixProvider(providerName: string, config: any): PixPaymentProvider {
  switch (providerName) {
    case 'mercadopago':
      return new MercadoPagoProvider(config.accessToken)
    case 'pagseguro':
      return new PagSeguroProvider(config.email, config.token)
    case 'gerencianet':
      return new GerencianetProvider(config.clientId, config.clientSecret)
    case 'manual':
    default:
      return new ManualPixProvider()
  }
}

// Utility function to validate PIX keys
export function validatePixKey(key: string, type: string): boolean {
  switch (type) {
    case 'cpf':
      return /^\d{11}$/.test(key.replace(/\D/g, ''))
    case 'cnpj':
      return /^\d{14}$/.test(key.replace(/\D/g, ''))
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)
    case 'phone':
      return /^\d{10,11}$/.test(key.replace(/\D/g, ''))
    case 'random':
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)
    default:
      return false
  }
}

// Utility function to format PIX keys for display
export function formatPixKey(key: string, type: string): string {
  const cleanKey = key.replace(/\D/g, '')
  
  switch (type) {
    case 'cpf':
      return cleanKey.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    case 'cnpj':
      return cleanKey.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    case 'phone':
      if (cleanKey.length === 11) {
        return cleanKey.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      } else {
        return cleanKey.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
      }
    default:
      return key
  }
}