import { Metadata } from 'next';
import { generateSEOMetadata, breadcrumbSchema, serviceSchema } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Cotação P2P Bitcoin - Compre e Venda com as Melhores Taxas',
  description: 'Cotação de Bitcoin em tempo real para transações P2P. Compare preços, veja ofertas disponíveis e negocie diretamente com outros usuários de forma segura.',
  keywords: ['cotação bitcoin', 'preço bitcoin', 'p2p bitcoin', 'comprar bitcoin hoje', 'vender bitcoin', 'bitcoin tempo real', 'mercado p2p'],
  canonicalUrl: 'https://rioporto.com/cotacao-p2p',
  ogType: 'website',
});

const cotacaoBreadcrumb = breadcrumbSchema([
  { name: 'Home', url: 'https://rioporto.com' },
  { name: 'Cotação P2P', url: 'https://rioporto.com/cotacao-p2p' },
]);

export default function CotacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[cotacaoBreadcrumb, serviceSchema]} />
      {children}
    </>
  );
}