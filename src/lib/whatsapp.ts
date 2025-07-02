// Funções para integração com WhatsApp sem necessidade de API Business

// Números de WhatsApp da empresa
export const WHATSAPP_NUMBERS = {
  main: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '552120187776',
  support: process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT || '552120187776',
  sales: process.env.NEXT_PUBLIC_WHATSAPP_SALES || '552120187776',
  kyc: process.env.NEXT_PUBLIC_WHATSAPP_KYC || '552120187776',
};

// Formatar número para WhatsApp (remover caracteres especiais)
export function formatWhatsAppNumber(phone: string): string {
  // Remove tudo que não for número
  const cleaned = phone.replace(/\D/g, '');
  
  // Se não tem código do país, adiciona 55 (Brasil)
  if (cleaned.length === 11 || cleaned.length === 10 || cleaned.length === 9) {
    return '55' + cleaned;
  }
  
  return cleaned;
}

// Gerar link do WhatsApp
export function getWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatWhatsAppNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

// Alias for backward compatibility
export function createWhatsAppLink(phone: string, message?: string): string {
  const formattedPhone = formatWhatsAppNumber(phone);
  if (!message) {
    return `https://wa.me/${formattedPhone}`;
  }
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

// Templates de mensagens
export const whatsappTemplates = {
  // Mensagem completa de cotação para compra
  quoteBuy: (data: {
    name: string;
    cpf?: string;
    amount: number;
    crypto: string;
    cryptoAmount: number;
    price: number;
    total: number;
    paymentMethod?: string;
  }) => 
    `🔥 *SOLICITAÇÃO DE COMPRA - RIO PORTO P2P*\n\n` +
    `👤 *Cliente:* ${data.name}\n` +
    (data.cpf ? `📄 *CPF:* ${data.cpf}\n` : '') +
    `📅 *Data:* ${new Date().toLocaleString('pt-BR')}\n\n` +
    `💰 *DETALHES DA OPERAÇÃO:*\n` +
    `• Cripto: ${data.crypto}\n` +
    `• Quantidade: ${data.cryptoAmount.toFixed(8)} ${data.crypto}\n` +
    `• Valor em R$: ${data.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` +
    `• Cotação: ${data.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` +
    `• Total: ${data.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` +
    (data.paymentMethod ? `• Pagamento: ${data.paymentMethod}\n` : '') +
    `\n📱 Mensagem enviada via rioportop2p-app.vercel.app`,
  
  // Mensagem completa de cotação para venda
  quoteSell: (data: {
    name: string;
    cpf?: string;
    amount: number;
    crypto: string;
    cryptoAmount: number;
    price: number;
    total: number;
    receivingMethod?: string;
  }) => 
    `🔥 *SOLICITAÇÃO DE VENDA - RIO PORTO P2P*\n\n` +
    `👤 *Cliente:* ${data.name}\n` +
    (data.cpf ? `📄 *CPF:* ${data.cpf}\n` : '') +
    `📅 *Data:* ${new Date().toLocaleString('pt-BR')}\n\n` +
    `💰 *DETALHES DA OPERAÇÃO:*\n` +
    `• Cripto: ${data.crypto}\n` +
    `• Quantidade: ${data.cryptoAmount.toFixed(8)} ${data.crypto}\n` +
    `• Valor em R$: ${data.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` +
    `• Cotação: ${data.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` +
    `• Total a Receber: ${data.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` +
    (data.receivingMethod ? `• Recebimento: ${data.receivingMethod}\n` : '') +
    `\n📱 Mensagem enviada via rioportop2p-app.vercel.app`,
  
  // Mensagem simples de compra
  buyBitcoin: (amount: number, price: number) => 
    `Olá! 👋\n\nGostaria de comprar Bitcoin:\n\n💰 Quantidade: R$ ${amount.toLocaleString('pt-BR')}\n📊 Cotação vista: R$ ${price.toLocaleString('pt-BR')}\n\nPor favor, me informe as opções de pagamento disponíveis.`,
  
  // Mensagem simples de venda
  sellBitcoin: (amount: number, price: number) => 
    `Olá! 👋\n\nGostaria de vender Bitcoin:\n\n💰 Quantidade: R$ ${amount.toLocaleString('pt-BR')}\n📊 Cotação vista: R$ ${price.toLocaleString('pt-BR')}\n\nPor favor, me informe como podemos proceder.`,
  
  // Suporte geral
  generalSupport: () => 
    `Olá! 👋\n\nPreciso de ajuda com a plataforma Rio Porto P2P.\n\nMeu nome é: [seu nome]\nAssunto: [descreva sua dúvida]`,
  
  // Suporte KYC
  kycSupport: (level: number) => 
    `Olá! 👋\n\nPreciso de ajuda com o processo de KYC.\n\nNível atual: ${level}\nDúvida: [descreva sua dúvida sobre documentação]`,
  
  // Agendamento OTC
  otcSchedule: (volume: string) => 
    `Olá! 👋\n\nGostaria de agendar uma operação OTC.\n\n💼 Volume estimado: ${volume}\n📅 Disponibilidade: [informe seus horários]\n\nAguardo retorno para agendarmos.`,
};

// Hook para usar WhatsApp
export function useWhatsApp() {
  const sendMessage = (phone: string, message: string) => {
    const link = getWhatsAppLink(phone, message);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const sendToSupport = (message: string) => {
    sendMessage(WHATSAPP_NUMBERS.support, message);
  };

  const sendToSales = (message: string) => {
    sendMessage(WHATSAPP_NUMBERS.sales, message);
  };

  const sendToKYC = (message: string) => {
    sendMessage(WHATSAPP_NUMBERS.kyc, message);
  };

  return {
    sendMessage,
    sendToSupport,
    sendToSales,
    sendToKYC,
    numbers: WHATSAPP_NUMBERS,
    templates: whatsappTemplates,
    getWhatsAppLink,
  };
}