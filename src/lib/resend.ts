import { Resend } from 'resend'

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY || ''

export const resend = resendApiKey ? new Resend(resendApiKey) : null

// OTP email template
export const otpEmailTemplate = (otp: string, userName?: string) => ({
  subject: 'Seu código de verificação - Rio Porto P2P',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de Verificação</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
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
            font-size: 24px;
            font-weight: bold;
            color: #f97316;
          }
          .otp-box {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #1f2937;
          }
          .message {
            text-align: center;
            color: #6b7280;
            margin: 20px 0;
          }
          .warning {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #92400e;
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
            </div>
            
            <h1 style="font-size: 24px; margin-bottom: 10px;">Código de Verificação</h1>
            ${userName ? `<p>Olá ${userName},</p>` : ''}
            <p>Use o código abaixo para verificar sua identidade:</p>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            
            <p class="message">Este código expira em 10 minutos.</p>
            
            <div class="warning">
              <strong>⚠️ Atenção:</strong> Nunca compartilhe este código com ninguém. Nossa equipe jamais solicitará este código por telefone ou mensagem.
            </div>
            
            <div class="footer">
              <p>Se você não solicitou este código, ignore este email.</p>
              <p>© ${new Date().getFullYear()} Rio Porto P2P. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,
  text: `
    Rio Porto P2P - Código de Verificação
    
    ${userName ? `Olá ${userName},` : ''}
    
    Use o código abaixo para verificar sua identidade:
    
    ${otp}
    
    Este código expira em 10 minutos.
    
    ATENÇÃO: Nunca compartilhe este código com ninguém. Nossa equipe jamais solicitará este código por telefone ou mensagem.
    
    Se você não solicitou este código, ignore este email.
    
    © ${new Date().getFullYear()} Rio Porto P2P. Todos os direitos reservados.
  `
})

// Generate random OTP
export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length))
  }
  return otp
}

// Send OTP email
export const sendOTPEmail = async (email: string, userName?: string) => {
  if (!resend) {
    console.error('Resend not configured')
    return { success: false, error: 'Email service not configured' }
  }

  const otp = generateOTP()
  const emailContent = otpEmailTemplate(otp, userName)

  try {
    const { data, error } = await resend.emails.send({
      from: 'Rio Porto P2P <noreply@rioportop2p.com>',
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, otp, messageId: data?.id }
  } catch (error) {
    console.error('Send OTP error:', error)
    return { success: false, error: 'Failed to send OTP' }
  }
}