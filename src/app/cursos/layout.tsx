import { Metadata } from 'next';
import { generateSEOMetadata, breadcrumbSchema } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Cursos de Bitcoin e Criptomoedas - Aprenda com Especialistas',
  description: 'Cursos completos sobre Bitcoin, blockchain e criptomoedas. Do básico ao avançado, aprenda a investir com segurança e entenda o mercado crypto.',
  keywords: ['cursos bitcoin', 'curso criptomoedas', 'aprender bitcoin', 'educação blockchain', 'curso trading', 'bitcoin para iniciantes'],
  canonicalUrl: 'https://rioporto.com/cursos',
  ogType: 'website',
});

const cursosBreadcrumb = breadcrumbSchema([
  { name: 'Home', url: 'https://rioporto.com' },
  { name: 'Cursos', url: 'https://rioporto.com/cursos' },
]);

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'CourseCollection',
  name: 'Cursos de Bitcoin e Criptomoedas',
  description: 'Coleção de cursos educacionais sobre Bitcoin, blockchain e criptomoedas',
  provider: {
    '@type': 'Organization',
    name: 'Rio Porto P2P',
  },
};

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[cursosBreadcrumb, courseSchema]} />
      {children}
    </>
  );
}