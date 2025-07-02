import { formatWhatsAppNumber, createWhatsAppLink } from '../whatsapp'

// Mock window.open
global.window.open = jest.fn()

describe('WhatsApp utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('formatWhatsAppNumber', () => {
    it('formats Brazilian phone numbers correctly', () => {
      expect(formatWhatsAppNumber('(21) 98765-4321')).toBe('5521987654321')
      expect(formatWhatsAppNumber('21987654321')).toBe('5521987654321')
      expect(formatWhatsAppNumber('987654321')).toBe('55987654321')
      expect(formatWhatsAppNumber('+55 21 98765-4321')).toBe('5521987654321')
    })

    it('handles numbers with country code', () => {
      expect(formatWhatsAppNumber('+5521987654321')).toBe('5521987654321')
      expect(formatWhatsAppNumber('5521987654321')).toBe('5521987654321')
    })

    it('removes special characters', () => {
      expect(formatWhatsAppNumber('(21) 9.8765-4321')).toBe('5521987654321')
      expect(formatWhatsAppNumber('21-98765-4321')).toBe('5521987654321')
      expect(formatWhatsAppNumber('21 98765 4321')).toBe('5521987654321')
    })
  })

  describe('createWhatsAppLink', () => {
    it('creates correct WhatsApp link with message', () => {
      const link = createWhatsAppLink('21987654321', 'Hello World')
      expect(link).toBe('https://wa.me/5521987654321?text=Hello%20World')
    })

    it('creates correct WhatsApp link without message', () => {
      const link = createWhatsAppLink('21987654321')
      expect(link).toBe('https://wa.me/5521987654321')
    })

    it('encodes special characters in message', () => {
      const link = createWhatsAppLink('21987654321', 'Olá! Como está?')
      expect(link).toBe('https://wa.me/5521987654321?text=Ol%C3%A1!%20Como%20est%C3%A1%3F')
    })

    it('handles emojis in message', () => {
      const link = createWhatsAppLink('21987654321', 'Hello 👋 World 🌍')
      expect(link).toContain('text=Hello%20%F0%9F%91%8B%20World%20%F0%9F%8C%8D')
    })
  })

  describe('WhatsApp message templates', () => {
    it('formats buy quote message correctly', () => {
      const templates = {
        quoteBuy: (data: any) => `
🔄 *NOVA COTAÇÃO - COMPRA*

👤 Cliente: ${data.name}
📱 CPF: ${data.cpf}
💰 Valor: R$ ${data.amount.toFixed(2)}
🪙 Crypto: ${data.crypto}
📊 Quantidade: ${data.cryptoAmount} ${data.crypto}
💱 Cotação: R$ ${data.price.toFixed(2)}
💳 Forma de Pagamento: ${data.paymentMethod}

📈 Total: R$ ${data.total.toFixed(2)}
        `.trim()
      }

      const message = templates.quoteBuy({
        name: 'João Silva',
        cpf: '123.456.789-00',
        amount: 1000,
        crypto: 'BTC',
        cryptoAmount: 0.00159,
        price: 628930.50,
        paymentMethod: 'PIX',
        total: 1035.00
      })

      expect(message).toContain('NOVA COTAÇÃO - COMPRA')
      expect(message).toContain('João Silva')
      expect(message).toContain('R$ 1000.00')
      expect(message).toContain('0.00159 BTC')
    })

    it('formats sell quote message correctly', () => {
      const templates = {
        quoteSell: (data: any) => `
🔄 *NOVA COTAÇÃO - VENDA*

👤 Cliente: ${data.name}
📱 CPF: ${data.cpf}
🪙 Crypto: ${data.crypto}
📊 Quantidade: ${data.cryptoAmount} ${data.crypto}
💱 Cotação: R$ ${data.price.toFixed(2)}
💰 Valor Bruto: R$ ${data.amount.toFixed(2)}
💳 Forma de Recebimento: ${data.receivingMethod}

📉 Total a Receber: R$ ${data.total.toFixed(2)}
        `.trim()
      }

      const message = templates.quoteSell({
        name: 'Maria Santos',
        cpf: '987.654.321-00',
        crypto: 'ETH',
        cryptoAmount: 0.5,
        price: 12450.00,
        amount: 6225.00,
        receivingMethod: 'TED',
        total: 6038.25
      })

      expect(message).toContain('NOVA COTAÇÃO - VENDA')
      expect(message).toContain('Maria Santos')
      expect(message).toContain('0.5 ETH')
      expect(message).toContain('R$ 6038.25')
    })
  })

  describe('sendMessage function behavior', () => {
    it('opens WhatsApp link in new window', () => {
      const sendMessage = (number: string, message: string) => {
        const link = createWhatsAppLink(number, message)
        window.open(link, '_blank')
      }

      sendMessage('21987654321', 'Test message')

      expect(window.open).toHaveBeenCalledWith(
        'https://wa.me/5521987654321?text=Test%20message',
        '_blank'
      )
    })

    it('handles empty message', () => {
      const sendMessage = (number: string, message?: string) => {
        const link = createWhatsAppLink(number, message)
        window.open(link, '_blank')
      }

      sendMessage('21987654321')

      expect(window.open).toHaveBeenCalledWith(
        'https://wa.me/5521987654321',
        '_blank'
      )
    })
  })
})