import { logger } from '@/lib/logger'

interface BTGConfig {
  clientId: string
  clientSecret: string
  environment: 'sandbox' | 'production'
}

interface BTGPixPayment {
  id: string
  status: 'pending' | 'completed' | 'cancelled'
  amount: number
  description: string
  pixKey?: string
  qrCode?: string
  qrCodeText?: string
  createdAt: Date
  expiresAt: Date
}

interface BTGAuthToken {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

export class BTGPixProvider {
  private config: BTGConfig
  private baseUrl: string
  private token: BTGAuthToken | null = null
  private tokenExpiresAt: Date | null = null

  constructor(config: BTGConfig) {
    this.config = config
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.empresas.btgpactual.com'
      : 'https://api-sandbox.empresas.btgpactual.com'
  }

  /**
   * Obtém token de acesso OAuth2
   */
  private async getAccessToken(): Promise<string> {
    // Verifica se o token ainda é válido
    if (this.token && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return this.token.access_token
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/oauth/v2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'pagamentos cobranças'
        })
      })

      if (!response.ok) {
        throw new Error(`BTG Auth Error: ${response.status}`)
      }

      const data: BTGAuthToken = await response.json()
      this.token = data
      this.tokenExpiresAt = new Date(Date.now() + (data.expires_in * 1000))
      
      return data.access_token
    } catch (error) {
      logger.error('BTG Auth Error:', error)
      throw new Error('Falha na autenticação com BTG')
    }
  }

  /**
   * Cria uma cobrança PIX
   */
  async createPixPayment(params: {
    amount: number
    description: string
    customerName: string
    customerDocument: string
    expirationMinutes?: number
  }): Promise<BTGPixPayment> {
    const token = await this.getAccessToken()
    
    try {
      const expiration = params.expirationMinutes || 60 // 60 minutos padrão
      const expiresAt = new Date(Date.now() + (expiration * 60 * 1000))

      const response = await fetch(`${this.baseUrl}/v1/pix/cobranças`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `${Date.now()}-${Math.random()}`
        },
        body: JSON.stringify({
          valor: {
            original: params.amount.toFixed(2)
          },
          chave: process.env.BTG_PIX_KEY, // Chave PIX da empresa
          solicitacaoPagador: params.description,
          pagador: {
            nome: params.customerName,
            cpf: params.customerDocument.replace(/\D/g, '')
          },
          expiracao: expiration * 60, // em segundos
          infoAdicionais: [
            {
              nome: 'origem',
              valor: 'rioportop2p'
            }
          ]
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao criar cobrança PIX')
      }

      const data = await response.json()

      return {
        id: data.txid,
        status: 'pending',
        amount: params.amount,
        description: params.description,
        qrCode: data.qrcode,
        qrCodeText: data.pixCopiaECola,
        createdAt: new Date(),
        expiresAt: expiresAt
      }
    } catch (error) {
      logger.error('BTG Create PIX Error:', error)
      throw new Error('Falha ao criar cobrança PIX')
    }
  }

  /**
   * Consulta status de uma cobrança PIX
   */
  async getPixPaymentStatus(txid: string): Promise<BTGPixPayment> {
    const token = await this.getAccessToken()
    
    try {
      const response = await fetch(`${this.baseUrl}/v1/pix/cobranças/${txid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ao consultar cobrança: ${response.status}`)
      }

      const data = await response.json()

      return {
        id: data.txid,
        status: data.status === 'CONCLUIDA' ? 'completed' : 
                data.status === 'REMOVIDA' ? 'cancelled' : 'pending',
        amount: parseFloat(data.valor.original),
        description: data.solicitacaoPagador,
        qrCode: data.qrcode,
        qrCodeText: data.pixCopiaECola,
        createdAt: new Date(data.calendario.criacao),
        expiresAt: new Date(data.calendario.expiracao * 1000)
      }
    } catch (error) {
      logger.error('BTG Get PIX Status Error:', error)
      throw new Error('Falha ao consultar status da cobrança')
    }
  }

  /**
   * Cria um pagamento PIX (envio)
   */
  async sendPixPayment(params: {
    amount: number
    pixKey: string
    description: string
  }): Promise<{ id: string; status: string }> {
    const token = await this.getAccessToken()
    
    try {
      const response = await fetch(`${this.baseUrl}/v1/pagamentos/pix`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `${Date.now()}-${Math.random()}`
        },
        body: JSON.stringify({
          valor: params.amount.toFixed(2),
          chavePix: params.pixKey,
          descricao: params.description,
          tipoChave: this.detectPixKeyType(params.pixKey)
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao enviar pagamento PIX')
      }

      const data = await response.json()

      return {
        id: data.endToEndId,
        status: data.status
      }
    } catch (error) {
      logger.error('BTG Send PIX Error:', error)
      throw new Error('Falha ao enviar pagamento PIX')
    }
  }

  /**
   * Detecta o tipo de chave PIX
   */
  private detectPixKeyType(key: string): string {
    // Remove formatação
    const cleanKey = key.replace(/\D/g, '')
    
    // CPF
    if (cleanKey.length === 11) return 'CPF'
    
    // CNPJ
    if (cleanKey.length === 14) return 'CNPJ'
    
    // Telefone
    if (cleanKey.length >= 10 && cleanKey.length <= 11 && cleanKey.startsWith('5')) return 'TELEFONE'
    
    // Email
    if (key.includes('@')) return 'EMAIL'
    
    // Chave aleatória (UUID)
    if (key.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) return 'ALEATORIA'
    
    return 'EMAIL' // fallback
  }

  /**
   * Processa webhook do BTG
   */
  async processWebhook(headers: any, body: any): Promise<{
    txid: string
    status: 'completed' | 'cancelled'
  }> {
    // Validar assinatura do webhook (implementar conforme documentação BTG)
    // const signature = headers['x-btg-signature']
    // if (!this.validateWebhookSignature(signature, body)) {
    //   throw new Error('Invalid webhook signature')
    // }

    const { pix } = body

    if (!pix || !pix.txid) {
      throw new Error('Invalid webhook payload')
    }

    return {
      txid: pix.txid,
      status: pix.status === 'CONCLUIDA' ? 'completed' : 'cancelled'
    }
  }
}

// Singleton instance
export const btgPixProvider = new BTGPixProvider({
  clientId: process.env.BTG_CLIENT_ID!,
  clientSecret: process.env.BTG_CLIENT_SECRET!,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
})