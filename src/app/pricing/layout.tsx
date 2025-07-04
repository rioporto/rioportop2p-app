import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preços e Planos | Rio Porto P2P - Taxas Transparentes para Bitcoin',
  description: 'Conheça nossos planos e taxas transparentes. Plano Básico grátis, Pro a partir de R$ 79/mês e Enterprise personalizado. Economize até 68% em taxas de transação.',
  keywords: 'preços bitcoin, taxas p2p, planos bitcoin, custo transação bitcoin, taxa cambio bitcoin, preços cripto brasil',
  openGraph: {
    title: 'Preços Transparentes e Justos | Rio Porto P2P',
    description: 'Escolha o plano ideal para negociar Bitcoin. Taxas a partir de 0.8%, sem custos escondidos.',
    type: 'website',
    images: [
      {
        url: '/og-pricing.jpg',
        width: 1200,
        height: 630,
        alt: 'Tabela de Preços Rio Porto P2P'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preços e Planos | Rio Porto P2P',
    description: 'Taxas transparentes a partir de 0.8%. Plano grátis disponível.',
    images: ['/og-pricing.jpg']
  },
  alternates: {
    canonical: 'https://rioportop2p.com/pricing'
  }
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      
      {/* Schema.org structured data for pricing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Rio Porto P2P",
            "description": "Plataforma de negociação P2P de Bitcoin no Brasil",
            "brand": {
              "@type": "Brand",
              "name": "Rio Porto P2P"
            },
            "offers": [
              {
                "@type": "Offer",
                "name": "Plano Básico",
                "price": "0",
                "priceCurrency": "BRL",
                "description": "Até R$ 10.000 em transações mensais com taxa de 2.5%"
              },
              {
                "@type": "Offer",
                "name": "Plano Pro",
                "price": "79",
                "priceCurrency": "BRL",
                "description": "Até R$ 100.000 em transações mensais com taxa de 1.5%",
                "priceValidUntil": "2025-12-31"
              },
              {
                "@type": "Offer",
                "name": "Plano Enterprise",
                "price": "Sob consulta",
                "priceCurrency": "BRL",
                "description": "Volume ilimitado com taxas a partir de 0.8%"
              }
            ]
          })
        }}
      />
    </>
  );
}