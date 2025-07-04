import { NextResponse } from 'next/server';

export async function GET() {
  // Security headers for better SEO and security
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://api.coinmarketcap.com https://supabase.co wss://supabase.co https://www.google-analytics.com;",
  };

  // SEO configuration response
  const seoConfig = {
    site: {
      name: 'Rio Porto P2P',
      url: 'https://rioporto.com',
      description: 'A melhor plataforma P2P do Brasil para comprar e vender Bitcoin',
      logo: 'https://rioporto.com/logo.png',
      favicon: 'https://rioporto.com/favicon.ico',
    },
    social: {
      twitter: '@rioportop2p',
      facebook: 'rioportop2p',
      instagram: 'rioportop2p',
      linkedin: 'company/rioportop2p',
      youtube: '@rioportop2p',
      whatsapp: '+5521999999999',
    },
    contact: {
      email: 'contato@rioporto.com',
      phone: '+55 21 99999-9999',
      address: 'Rio de Janeiro, RJ, Brasil',
    },
    features: {
      pwa: true,
      amp: false,
      instantArticles: false,
    },
    languages: ['pt-BR'],
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
  };

  return NextResponse.json(seoConfig, { headers });
}