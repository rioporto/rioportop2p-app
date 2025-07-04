import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Criar Conta - Comece a negociar Bitcoin hoje',
  description: 'Crie sua conta gratuita na Rio Porto P2P e comece a comprar e vender Bitcoin com segurança. Cadastro rápido, verificação KYC simplificada.',
  keywords: ['criar conta', 'cadastro', 'registro', 'bitcoin', 'p2p', 'rio porto', 'kyc'],
  canonicalUrl: 'https://rioporto.com/signup',
  ogType: 'website',
});

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}