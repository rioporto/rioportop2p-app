import { NextResponse } from 'next/server'

export async function GET() {
  // Apenas para debug - remover em produção
  const config = {
    hasPixKey: !!process.env.NEXT_PUBLIC_COMPANY_PIX_ALEATORIA,
    pixKeyLength: process.env.NEXT_PUBLIC_COMPANY_PIX_ALEATORIA?.length || 0,
    hasBTGConfig: !!process.env.BTG_CLIENT_ID,
    nodeEnv: process.env.NODE_ENV,
    // Mostra apenas os primeiros 8 caracteres por segurança
    pixKeyPreview: process.env.NEXT_PUBLIC_COMPANY_PIX_ALEATORIA?.substring(0, 8) + '...',
  }

  return NextResponse.json(config)
}