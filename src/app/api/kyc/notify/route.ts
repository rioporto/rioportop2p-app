import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface EmailTemplate {
  subject: string;
  html: string;
}

function getEmailTemplate(type: string, userData: any): EmailTemplate {
  const templates: Record<string, EmailTemplate> = {
    submission_received: {
      subject: 'KYC Recebido - Rio Porto P2P',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Rio Porto P2P</h1>
          </div>
          <div style="padding: 30px; background-color: #f5f5f5;">
            <h2 style="color: #333;">Documentos KYC Recebidos</h2>
            <p style="color: #666; line-height: 1.6;">
              Olá ${userData.name || 'Cliente'},
            </p>
            <p style="color: #666; line-height: 1.6;">
              Recebemos seus documentos para verificação KYC. Nossa equipe analisará sua documentação
              e você receberá uma resposta em até 24 horas úteis.
            </p>
            <div style="margin: 30px 0; padding: 20px; background-color: white; border-radius: 8px;">
              <h3 style="color: #f97316; margin-top: 0;">Status da Verificação</h3>
              <p><strong>Status:</strong> Em análise</p>
              <p><strong>Data de envio:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              <p><strong>Tempo estimado:</strong> 24 horas úteis</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Enquanto isso, você pode:
            </p>
            <ul style="color: #666; line-height: 1.8;">
              <li>Explorar nossa plataforma</li>
              <li>Verificar as cotações de criptomoedas</li>
              <li>Ler nosso FAQ</li>
            </ul>
          </div>
          <div style="background-color: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              © ${new Date().getFullYear()} Rio Porto P2P. Todos os direitos reservados.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">
              WhatsApp: +55 21 2018-7776
            </p>
          </div>
        </div>
      `
    },
    approved: {
      subject: 'KYC Aprovado - Rio Porto P2P',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #10b981; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Parabéns! KYC Aprovado</h1>
          </div>
          <div style="padding: 30px; background-color: #f5f5f5;">
            <h2 style="color: #333;">Verificação Concluída</h2>
            <p style="color: #666; line-height: 1.6;">
              Olá ${userData.name || 'Cliente'},
            </p>
            <p style="color: #666; line-height: 1.6;">
              Temos o prazer de informar que sua verificação KYC foi aprovada com sucesso!
            </p>
            <div style="margin: 30px 0; padding: 20px; background-color: white; border-radius: 8px;">
              <h3 style="color: #10b981; margin-top: 0;">Detalhes da Aprovação</h3>
              <p><strong>Status:</strong> Aprovado ✓</p>
              <p><strong>Nível de verificação:</strong> ${userData.level || 1}</p>
              <p><strong>Data de aprovação:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              <p><strong>Limites liberados:</strong></p>
              <ul>
                <li>Nível 1: até R$ 10.000/mês</li>
                <li>Nível 2: até R$ 50.000/mês</li>
                <li>Nível 3: sem limites</li>
              </ul>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Agora você pode:
            </p>
            <ul style="color: #666; line-height: 1.8;">
              <li>Comprar e vender criptomoedas</li>
              <li>Realizar transações P2P</li>
              <li>Acessar todos os recursos da plataforma</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/cotacao-p2p" 
                 style="background-color: #f97316; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Fazer Primeira Transação
              </a>
            </div>
          </div>
          <div style="background-color: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              © ${new Date().getFullYear()} Rio Porto P2P. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `
    },
    rejected: {
      subject: 'KYC - Ação Necessária - Rio Porto P2P',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #ef4444; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Ação Necessária - KYC</h1>
          </div>
          <div style="padding: 30px; background-color: #f5f5f5;">
            <h2 style="color: #333;">Documentação Requer Atenção</h2>
            <p style="color: #666; line-height: 1.6;">
              Olá ${userData.name || 'Cliente'},
            </p>
            <p style="color: #666; line-height: 1.6;">
              Identificamos alguns problemas com os documentos enviados que precisam ser corrigidos
              para prosseguir com sua verificação.
            </p>
            <div style="margin: 30px 0; padding: 20px; background-color: white; border-radius: 8px;">
              <h3 style="color: #ef4444; margin-top: 0;">Motivo da Rejeição</h3>
              <p style="color: #666;">${userData.reason || 'Documentos ilegíveis ou incorretos'}</p>
              <h4 style="color: #333; margin-top: 20px;">Ações necessárias:</h4>
              <ul style="color: #666;">
                <li>Verifique se os documentos estão legíveis</li>
                <li>Certifique-se de que não há cortes nas imagens</li>
                <li>Use documentos válidos e dentro da validade</li>
                <li>A selfie deve mostrar claramente seu rosto e documento</li>
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/kyc" 
                 style="background-color: #f97316; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Reenviar Documentos
              </a>
            </div>
            <p style="color: #666; line-height: 1.6; text-align: center;">
              Precisa de ajuda? Entre em contato pelo WhatsApp: +55 21 2018-7776
            </p>
          </div>
          <div style="background-color: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              © ${new Date().getFullYear()} Rio Porto P2P. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `
    }
  };

  return templates[type] || templates.submission_received;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, additionalData } = await request.json();

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'userId e type são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('Erro ao buscar usuário:', userError);
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const emailData = {
      name: userData.full_name,
      ...additionalData
    };

    const template = getEmailTemplate(type, emailData);

    // Enviar email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: `Rio Porto P2P <${process.env.RESEND_FROM_EMAIL}>`,
        to: [userData.email],
        subject: template.subject,
        html: template.html
      })
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.json();
      console.error('Erro ao enviar email:', error);
      return NextResponse.json(
        { error: 'Erro ao enviar notificação' },
        { status: 500 }
      );
    }

    const result = await resendResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Notificação enviada com sucesso',
      emailId: result.id
    });

  } catch (error: any) {
    console.error('Erro ao enviar notificação KYC:', error);
    return NextResponse.json(
      { error: 'Erro interno ao enviar notificação', details: error.message },
      { status: 500 }
    );
  }
}