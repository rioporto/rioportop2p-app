// Funções para integração com WhatsApp sem necessidade de API Business

// Números de WhatsApp da empresa
export const WHATSAPP_NUMBERS = {
  support: process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT || '5521999999999',
  sales: process.env.NEXT_PUBLIC_WHATSAPP_SALES || '5521999999999',
  kyc: process.env.NEXT_PUBLIC_WHATSAPP_KYC || '5521999999999',
};

// Formatar número para WhatsApp (remover caracteres especiais)
export function formatWhatsAppNumber(phone: string): string {
  // Remove tudo que não for número
  const cleaned = phone.replace(/\D/g, '');
  
  // Se não tem código do país, adiciona 55 (Brasil)
  if (cleaned.length === 11 || cleaned.length === 10) {
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

// Templates de mensagens
export const whatsappTemplates = {
  // Mensagem inicial de compra
  buyBitcoin: (amount: number, price: number) => 
    `Olá! 👋\n\nGostaria de comprar Bitcoin:\n\n💰 Quantidade: R$ ${amount.toLocaleString('pt-BR')}\n📊 Cotação vista: R$ ${price.toLocaleString('pt-BR')}\n\nPor favor, me informe as opções de pagamento disponíveis.`,
  
  // Mensagem inicial de venda
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

// Componente React para botão do WhatsApp
export function WhatsAppButton({ 
  phone, 
  message, 
  className = '', 
  children 
}: { 
  phone: string; 
  message: string; 
  className?: string; 
  children: React.ReactNode;
}) {
  const link = getWhatsAppLink(phone, message);
  
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {children}
    </a>
  );
}

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
  };
}