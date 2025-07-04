import { JsonLd } from '@/components/JsonLd';
import { organizationSchema, websiteSchema, serviceSchema } from '@/components/SEO';
import HomePage from './page';

const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Rio Porto P2P - Compra e Venda de Bitcoin com Segurança',
  description: 'A melhor plataforma P2P do Brasil para comprar e vender Bitcoin. Transações seguras, rápidas e com as melhores taxas do mercado.',
  url: 'https://rioporto.com',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Rio Porto P2P',
    url: 'https://rioporto.com',
  },
  about: {
    '@type': 'Thing',
    name: 'Bitcoin P2P Trading',
  },
  mainEntity: {
    '@type': 'Service',
    name: 'Compra e Venda de Bitcoin P2P',
    provider: {
      '@type': 'Organization',
      name: 'Rio Porto P2P',
    },
  },
};

export default function HomeWrapper() {
  return (
    <>
      <JsonLd data={[homePageSchema, serviceSchema]} />
      <HomePage />
    </>
  );
}