import { Metadata } from 'next';
import { generateSEOMetadata, breadcrumbSchema } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Política de Privacidade - Rio Porto P2P',
  description: 'Saiba como protegemos seus dados pessoais e informações financeiras. Nossa política de privacidade garante transparência e segurança em todas as transações.',
  keywords: ['política de privacidade', 'proteção de dados', 'LGPD', 'segurança', 'privacidade', 'dados pessoais'],
  canonicalUrl: 'https://rioporto.com/politica-de-privacidade',
  ogType: 'website',
});

const privacyBreadcrumb = breadcrumbSchema([
  { name: 'Home', url: 'https://rioporto.com' },
  { name: 'Política de Privacidade', url: 'https://rioporto.com/politica-de-privacidade' },
]);

export default function PrivacidadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={privacyBreadcrumb} />
      {children}
    </>
  );
}