import { Metadata } from 'next';
import { generateSEOMetadata, breadcrumbSchema } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Contato - Fale com a Rio Porto P2P',
  description: 'Entre em contato com nossa equipe de suporte. Atendimento 24/7 para ajudar você com suas transações de Bitcoin. WhatsApp, email e formulário de contato.',
  keywords: ['contato', 'suporte', 'atendimento', 'whatsapp', 'fale conosco', 'ajuda bitcoin'],
  canonicalUrl: 'https://rioporto.com/contato',
  ogType: 'website',
});

const contactBreadcrumb = breadcrumbSchema([
  { name: 'Home', url: 'https://rioporto.com' },
  { name: 'Contato', url: 'https://rioporto.com/contato' },
]);

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contato - Rio Porto P2P',
  description: 'Entre em contato com a equipe Rio Porto P2P',
  url: 'https://rioporto.com/contato',
  mainEntity: {
    '@type': 'Organization',
    name: 'Rio Porto P2P',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-21-99999-9999',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
      areaServed: 'BR',
    },
  },
};

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[contactBreadcrumb, contactPageSchema]} />
      {children}
    </>
  );
}