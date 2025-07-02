import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to } = await request.json();
    
    if (!to) {
      return NextResponse.json(
        { error: 'Email destinatário é obrigatório' },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@rioporto.com';

    if (!resendKey) {
      return NextResponse.json(
        { error: 'Resend não configurado' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`
      },
      body: JSON.stringify({
        from: `Rio Porto P2P <${fromEmail}>`,
        to: [to],
        subject: 'Teste de Email - Rio Porto P2P',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f97316; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Rio Porto P2P</h1>
            </div>
            <div style="padding: 30px; background-color: #f5f5f5;">
              <h2 style="color: #333;">Email de Teste</h2>
              <p style="color: #666; line-height: 1.6;">
                Este é um email de teste enviado pela plataforma Rio Porto P2P.
              </p>
              <p style="color: #666; line-height: 1.6;">
                Se você recebeu este email, significa que nosso sistema de envio está funcionando corretamente.
              </p>
              <div style="margin: 30px 0; padding: 20px; background-color: white; border-radius: 8px;">
                <h3 style="color: #f97316; margin-top: 0;">Informações do Teste</h3>
                <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                <p><strong>Destinatário:</strong> ${to}</p>
                <p><strong>Remetente:</strong> ${fromEmail}</p>
              </div>
              <p style="color: #666; line-height: 1.6;">
                Em breve você receberá emails importantes como:
              </p>
              <ul style="color: #666; line-height: 1.8;">
                <li>Confirmação de cadastro</li>
                <li>Códigos de verificação</li>
                <li>Notificações de transações</li>
                <li>Atualizações de KYC</li>
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
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao enviar email', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email enviado com sucesso',
      id: data.id
    });

  } catch (error: any) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json(
      { error: 'Erro interno ao enviar email', details: error.message },
      { status: 500 }
    );
  }
}