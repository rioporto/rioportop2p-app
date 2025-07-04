import { Metadata } from 'next';
import { generateSEOMetadata, breadcrumbSchema } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Termos de Uso - Rio Porto P2P',
  description: 'Leia os termos de uso da plataforma Rio Porto P2P. Conheça seus direitos e responsabilidades ao usar nossos serviços de compra e venda de Bitcoin.',
  keywords: ['termos de uso', 'termos e condições', 'regras', 'política', 'contrato', 'bitcoin'],
  canonicalUrl: 'https://rioporto.com/termos-de-uso',
  ogType: 'website',
});

const termsBreadcrumb = breadcrumbSchema([
  { name: 'Home', url: 'https://rioporto.com' },
  { name: 'Termos de Uso', url: 'https://rioporto.com/termos-de-uso' },
]);

export default function TermosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={termsBreadcrumb} />
      {children}
    </>
  );
}