import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Login - Acesse sua conta Rio Porto P2P',
  description: 'Faça login em sua conta Rio Porto P2P para comprar e vender Bitcoin com segurança. Acesso rápido e protegido com autenticação de dois fatores.',
  keywords: ['login', 'entrar', 'acessar conta', 'bitcoin', 'p2p', 'rio porto'],
  canonicalUrl: 'https://rioporto.com/login',
  ogType: 'website',
  noindex: true, // Não indexar páginas de login
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}