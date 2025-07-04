import { Metadata } from 'next';
import { generateSEOMetadata, faqSchema, breadcrumbSchema } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Perguntas Frequentes - Tire suas dúvidas sobre Bitcoin P2P',
  description: 'Encontre respostas para as perguntas mais comuns sobre compra e venda de Bitcoin, segurança, taxas, KYC e funcionamento da plataforma Rio Porto P2P.',
  keywords: ['faq', 'perguntas frequentes', 'dúvidas bitcoin', 'como funciona p2p', 'segurança bitcoin', 'kyc', 'taxas'],
  canonicalUrl: 'https://rioporto.com/faq',
  ogType: 'website',
});

// FAQ Schema será adicionado dinamicamente pela página
const faqBreadcrumb = breadcrumbSchema([
  { name: 'Home', url: 'https://rioporto.com' },
  { name: 'FAQ', url: 'https://rioporto.com/faq' },
]);

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={faqBreadcrumb} />
      {children}
    </>
  );
}