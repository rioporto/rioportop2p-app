import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { createClient } from '@/lib/supabase/client';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'general' | 'support' | 'partnership' | 'complaint';
}

// Rate limiting store (em produção, use Redis ou similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Limpar entradas antigas do rate limit a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((value, key) => {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);

// Função para obter IP do cliente
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  return 'unknown';
}

// Função de rate limiting
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const limit = 5; // 5 requisições
  const window = 60 * 60 * 1000; // por hora
  
  const record = rateLimitStore.get(ip);
  
  if (!record || record.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + window });
    return { allowed: true };
  }
  
  if (record.count >= limit) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  record.count++;
  return { allowed: true };
}

// Validação básica de email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de telefone brasileiro
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Template de email para a equipe
const teamEmailTemplate = (data: ContactFormData) => ({
  subject: `[${data.type.toUpperCase()}] Nova mensagem de contato: ${data.subject}`,
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
          }
          .card {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            border-bottom: 2px solid #f97316;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .type-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          .type-general { background: #e3f2fd; color: #1976d2; }
          .type-support { background: #fff3e0; color: #f57c00; }
          .type-partnership { background: #e8f5e9; color: #388e3c; }
          .type-complaint { background: #ffebee; color: #d32f2f; }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: bold;
            color: #666;
            margin-bottom: 5px;
          }
          .value {
            color: #333;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
          }
          .message {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <div class="type-badge type-${data.type}">${data.type}</div>
              <h1 style="margin: 0; font-size: 24px;">Nova Mensagem de Contato</h1>
            </div>
            
            <div class="field">
              <div class="label">Nome:</div>
              <div class="value">${data.name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            
            ${data.phone ? `
            <div class="field">
              <div class="label">Telefone:</div>
              <div class="value">${data.phone}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Assunto:</div>
              <div class="value">${data.subject}</div>
            </div>
            
            <div class="field">
              <div class="label">Mensagem:</div>
              <div class="value message">${data.message}</div>
            </div>
            
            <div class="footer">
              <p>Mensagem recebida em ${new Date().toLocaleString('pt-BR', { 
                timeZone: 'America/Sao_Paulo',
                dateStyle: 'full',
                timeStyle: 'short'
              })}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,
  text: `
Nova Mensagem de Contato [${data.type.toUpperCase()}]

Nome: ${data.name}
Email: ${data.email}
${data.phone ? `Telefone: ${data.phone}` : ''}
Assunto: ${data.subject}

Mensagem:
${data.message}

---
Recebida em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
  `
});

// Template de email de confirmação para o usuário
const userConfirmationTemplate = (data: ContactFormData) => ({
  subject: 'Recebemos sua mensagem - Rio Porto P2P',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
          }
          .card {
            background: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #f97316;
          }
          .checkmark {
            width: 60px;
            height: 60px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
            font-size: 30px;
          }
          .message-box {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #f97316;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background: #f97316;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <div class="logo">Rio Porto P2P</div>
              <div class="checkmark">✓</div>
              <h1 style="margin: 0; font-size: 24px; color: #1f2937;">Mensagem Recebida!</h1>
            </div>
            
            <p>Olá ${data.name},</p>
            
            <p>Recebemos sua mensagem e agradecemos por entrar em contato conosco.</p>
            
            <div class="message-box">
              <p style="margin: 0;"><strong>Assunto:</strong> ${data.subject}</p>
              <p style="margin: 10px 0 0;"><strong>Tipo:</strong> ${
                data.type === 'general' ? 'Informações Gerais' :
                data.type === 'support' ? 'Suporte Técnico' :
                data.type === 'partnership' ? 'Parceria' :
                'Reclamação'
              }</p>
            </div>
            
            <p>Nossa equipe analisará sua mensagem e responderá o mais breve possível.</p>
            
            <p><strong>Tempo estimado de resposta:</strong> ${
              data.type === 'support' || data.type === 'complaint' ? '24 horas' : '48 horas'
            }</p>
            
            <p>Enquanto isso, você pode:</p>
            <ul>
              <li>Visitar nosso <a href="https://rioportop2p.com/faq">FAQ</a> para respostas rápidas</li>
              <li>Entrar em contato via WhatsApp para atendimento imediato: +55 21 2018-7776</li>
            </ul>
            
            <div class="footer">
              <p>Esta é uma mensagem automática. Por favor, não responda a este email.</p>
              <p>© ${new Date().getFullYear()} Rio Porto P2P. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,
  text: `
Olá ${data.name},

Recebemos sua mensagem e agradecemos por entrar em contato conosco.

Assunto: ${data.subject}
Tipo: ${
  data.type === 'general' ? 'Informações Gerais' :
  data.type === 'support' ? 'Suporte Técnico' :
  data.type === 'partnership' ? 'Parceria' :
  'Reclamação'
}

Nossa equipe analisará sua mensagem e responderá o mais breve possível.

Tempo estimado de resposta: ${data.type === 'support' || data.type === 'complaint' ? '24 horas' : '48 horas'}

Enquanto isso, você pode:
- Visitar nosso FAQ: https://rioportop2p.com/faq
- Entrar em contato via WhatsApp: +55 21 2018-7776

Esta é uma mensagem automática. Por favor, não responda a este email.

© ${new Date().getFullYear()} Rio Porto P2P. Todos os direitos reservados.
  `
});

export async function POST(request: NextRequest) {
  try {
    // Verificar rate limiting
    const clientIp = getClientIp(request);
    const rateLimitCheck = checkRateLimit(clientIp);
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Muitas requisições. Tente novamente mais tarde.',
          retryAfter: rateLimitCheck.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimitCheck.retryAfter || 3600)
          }
        }
      );
    }

    const body = await request.json();
    
    // Validação dos campos obrigatórios
    const requiredFields = ['name', 'email', 'subject', 'message', 'type'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campos obrigatórios faltando',
          missingFields
        },
        { status: 400 }
      );
    }
    
    // Validação de email
    if (!validateEmail(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email inválido'
        },
        { status: 400 }
      );
    }
    
    // Validação de telefone (se fornecido)
    if (body.phone && !validatePhone(body.phone)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Telefone inválido. Use o formato: (11) 98765-4321'
        },
        { status: 400 }
      );
    }
    
    // Validação de comprimento
    if (body.message.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Mensagem deve ter pelo menos 10 caracteres'
        },
        { status: 400 }
      );
    }
    
    if (body.message.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Mensagem não pode exceder 1000 caracteres'
        },
        { status: 400 }
      );
    }
    
    // Validação de tipo
    const validTypes = ['general', 'support', 'partnership', 'complaint'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tipo de contato inválido'
        },
        { status: 400 }
      );
    }
    
    // Processar o formulário
    const formData: ContactFormData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      type: body.type
    };
    
    // Salvar no banco de dados Supabase
    const supabase = createClient();
    const { data: dbData, error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        type: formData.type,
        ip_address: clientIp,
        user_agent: request.headers.get('user-agent') || 'unknown',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('Database error:', dbError);
      // Continuar mesmo se houver erro no banco
    }
    
    // Enviar emails
    if (resend) {
      try {
        // Email para a equipe
        const teamEmail = teamEmailTemplate(formData);
        const teamEmailResult = await resend.emails.send({
          from: 'Rio Porto P2P <noreply@rioportop2p.com>',
          to: process.env.CONTACT_EMAIL || 'contato@rioportop2p.com',
          reply_to: formData.email,
          subject: teamEmail.subject,
          html: teamEmail.html,
          text: teamEmail.text,
        });
        
        // Email de confirmação para o usuário
        const userEmail = userConfirmationTemplate(formData);
        await resend.emails.send({
          from: 'Rio Porto P2P <noreply@rioportop2p.com>',
          to: formData.email,
          subject: userEmail.subject,
          html: userEmail.html,
          text: userEmail.text,
        });
        
        console.log('Emails sent successfully:', teamEmailResult);
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Continuar mesmo se houver erro no email
      }
    } else {
      console.warn('Resend not configured - emails not sent');
    }
    
    // Resposta de sucesso
    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      data: {
        id: dbData?.id || `contact_${Date.now()}`,
        estimatedResponseTime: formData.type === 'support' || formData.type === 'complaint' ? '24 horas' : '48 horas'
      },
      timestamp: Date.now()
    }, {
      status: 201
    });
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Erro genérico
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar formulário. Tente novamente.',
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
}

// GET endpoint para verificar status do serviço
export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'Contact Form API',
    status: 'operational',
    features: {
      emailService: resend ? 'configured' : 'not configured',
      rateLimit: '5 requests per hour per IP',
      honeypot: 'enabled',
      validation: 'enabled'
    },
    acceptedTypes: ['general', 'support', 'partnership', 'complaint'],
    limits: {
      messageMinLength: 10,
      messageMaxLength: 1000,
      rateLimit: '5 requests per hour per IP'
    },
    timestamp: Date.now()
  });
}