import { Metadata } from 'next';
import { generateSEOMetadata, breadcrumbSchema } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog - Notícias e Análises sobre Bitcoin e Criptomoedas',
  description: 'Fique por dentro das últimas notícias, análises de mercado e dicas sobre Bitcoin e criptomoedas. Conteúdo educativo e atualizado diariamente.',
  keywords: ['blog bitcoin', 'notícias criptomoedas', 'análise bitcoin', 'mercado crypto', 'educação bitcoin', 'blockchain'],
  canonicalUrl: 'https://rioporto.com/blog',
  ogType: 'website',
});

const blogBreadcrumb = breadcrumbSchema([
  { name: 'Home', url: 'https://rioporto.com' },
  { name: 'Blog', url: 'https://rioporto.com/blog' },
]);

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={blogBreadcrumb} />
      {children}
    </>
  );
}