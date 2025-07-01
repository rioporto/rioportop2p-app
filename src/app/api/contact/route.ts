import { NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type: 'general' | 'support' | 'partnership' | 'complaint'
}

// Validação básica de email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validação de telefone brasileiro
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Simular envio de email
const sendEmail = async (data: ContactFormData) => {
  // Em produção, aqui você integraria com um serviço de email como:
  // - SendGrid
  // - AWS SES
  // - Resend
  // - Nodemailer com SMTP
  
  console.log('Sending email with data:', data)
  
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simular sucesso/falha aleatória para demonstração
  // Em produção, remova isso e implemente o envio real
  if (Math.random() > 0.9) {
    throw new Error('Email service temporarily unavailable')
  }
  
  return {
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'sent'
  }
}

// Salvar no banco de dados (simulado)
const saveToDatabase = async (data: ContactFormData & { messageId: string }) => {
  // Em produção, salve no Supabase ou outro banco de dados
  console.log('Saving to database:', data)
  
  // Retornar ID do registro
  return {
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validação dos campos obrigatórios
    const requiredFields = ['name', 'email', 'subject', 'message', 'type']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campos obrigatórios faltando',
          missingFields
        },
        { status: 400 }
      )
    }
    
    // Validação de email
    if (!validateEmail(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email inválido'
        },
        { status: 400 }
      )
    }
    
    // Validação de telefone (se fornecido)
    if (body.phone && !validatePhone(body.phone)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Telefone inválido. Use o formato: (11) 98765-4321'
        },
        { status: 400 }
      )
    }
    
    // Validação de comprimento
    if (body.message.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Mensagem deve ter pelo menos 10 caracteres'
        },
        { status: 400 }
      )
    }
    
    if (body.message.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Mensagem não pode exceder 1000 caracteres'
        },
        { status: 400 }
      )
    }
    
    // Validação de tipo
    const validTypes = ['general', 'support', 'partnership', 'complaint']
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tipo de contato inválido'
        },
        { status: 400 }
      )
    }
    
    // Processar o formulário
    const formData: ContactFormData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      type: body.type
    }
    
    // Enviar email
    const emailResult = await sendEmail(formData)
    
    // Salvar no banco de dados
    const dbResult = await saveToDatabase({
      ...formData,
      messageId: emailResult.messageId
    })
    
    // Resposta de sucesso
    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      data: {
        id: dbResult.id,
        messageId: emailResult.messageId,
        estimatedResponseTime: body.type === 'support' ? '24 horas' : '48 horas'
      },
      timestamp: Date.now()
    }, {
      status: 201
    })
    
  } catch (error) {
    console.error('Error processing contact form:', error)
    
    // Verificar se é um erro conhecido
    if (error instanceof Error && error.message.includes('Email service')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Serviço de email temporariamente indisponível. Tente novamente mais tarde.',
          timestamp: Date.now()
        },
        { status: 503 }
      )
    }
    
    // Erro genérico
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar formulário. Tente novamente.',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
}

// GET endpoint para verificar status do serviço
export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'Contact Form API',
    status: 'operational',
    acceptedTypes: ['general', 'support', 'partnership', 'complaint'],
    limits: {
      messageMinLength: 10,
      messageMaxLength: 1000,
      rateLimit: '10 requests per minute per IP'
    },
    timestamp: Date.now()
  })
}