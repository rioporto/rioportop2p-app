import { Metadata } from 'next';
import { generateSEOMetadata, breadcrumbSchema } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = generateSEOMetadata({
  title: 'OTC Bitcoin - Negociações de Alto Volume',
  description: 'Serviço OTC (Over-The-Counter) para grandes volumes de Bitcoin. Atendimento personalizado, melhores taxas e transações seguras para investidores institucionais.',
  keywords: ['otc bitcoin', 'bitcoin alto volume', 'mesa otc', 'bitcoin institucional', 'grandes transações', 'otc brasil'],
  canonicalUrl: 'https://rioporto.com/otc',
  ogType: 'website',
});

const otcBreadcrumb = breadcrumbSchema([
  { name: 'Home', url: 'https://rioporto.com' },
  { name: 'OTC', url: 'https://rioporto.com/otc' },
]);

const otcServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Serviço OTC Bitcoin - Rio Porto P2P',
  provider: {
    '@type': 'Organization',
    name: 'Rio Porto P2P',
  },
  description: 'Serviço especializado para transações de Bitcoin de alto volume com atendimento personalizado e as melhores taxas do mercado.',
  areaServed: {
    '@type': 'Country',
    name: 'Brasil',
  },
  serviceType: 'OTC Bitcoin Trading',
  offers: {
    '@type': 'Offer',
    description: 'Negociações de Bitcoin acima de R$ 100.000 com taxas especiais',
    eligibleRegion: {
      '@type': 'Country',
      name: 'BR',
    },
  },
};

export default function OTCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[otcBreadcrumb, otcServiceSchema]} />
      {children}
    </>
  );
}