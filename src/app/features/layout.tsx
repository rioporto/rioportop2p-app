import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recursos e Funcionalidades | Rio Porto P2P',
  description: 'Conheça todos os recursos que fazem da Rio Porto P2P a plataforma mais completa e segura para negociar Bitcoin no Brasil. Sistema de escrow, suporte 24/7, taxas competitivas e muito mais.',
  keywords: 'recursos bitcoin p2p, funcionalidades exchange, segurança bitcoin, escrow bitcoin, trading p2p brasil',
  openGraph: {
    title: 'Recursos e Funcionalidades | Rio Porto P2P',
    description: 'Descubra todos os recursos exclusivos da plataforma P2P mais segura do Brasil',
    url: 'https://rioportop2p.com/features',
    siteName: 'Rio Porto P2P',
    images: [
      {
        url: 'https://rioportop2p.com/og-features.png',
        width: 1200,
        height: 630,
        alt: 'Recursos Rio Porto P2P',
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recursos e Funcionalidades | Rio Porto P2P',
    description: 'Descubra todos os recursos exclusivos da plataforma P2P mais segura do Brasil',
    images: ['https://rioportop2p.com/og-features.png'],
  },
  alternates: {
    canonical: 'https://rioportop2p.com/features',
  }
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}