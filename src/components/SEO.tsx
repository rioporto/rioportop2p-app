import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  jsonLd?: any;
}

export function generateSEOMetadata({
  title = 'Rio Porto P2P - Compra e Venda de Bitcoin com Segurança',
  description = 'A melhor plataforma P2P do Brasil para comprar e vender Bitcoin. Transações seguras, rápidas e com as melhores taxas do mercado. Suporte 24/7.',
  keywords = ['bitcoin', 'p2p', 'criptomoedas', 'comprar bitcoin', 'vender bitcoin', 'exchange', 'brasil', 'rio porto'],
  ogImage = 'https://rioporto.com/og-image.jpg',
  ogType = 'website',
  author,
  publishedTime,
  modifiedTime,
  canonicalUrl,
  noindex = false,
}: SEOProps): Metadata {
  const siteName = 'Rio Porto P2P';
  const siteUrl = 'https://rioporto.com';
  const twitterHandle = '@rioportop2p';

  const metadata: Metadata = {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl || siteUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl || siteUrl,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'pt_BR',
      type: ogType,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && ogType === 'article' && { authors: [author] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: twitterHandle,
      creator: twitterHandle,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code',
      yahoo: 'yahoo-verification-code',
    },
  };

  if (noindex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

// Structured Data Schemas
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rio Porto P2P',
  url: 'https://rioporto.com',
  logo: 'https://rioporto.com/logo.png',
  description: 'Plataforma P2P líder no Brasil para compra e venda de Bitcoin com segurança e praticidade.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BR',
    addressRegion: 'RJ',
    addressLocality: 'Rio de Janeiro',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-21-99999-9999',
    contactType: 'customer service',
    availableLanguage: ['Portuguese'],
    areaServed: 'BR',
  },
  sameAs: [
    'https://www.facebook.com/rioportop2p',
    'https://twitter.com/rioportop2p',
    'https://www.instagram.com/rioportop2p',
    'https://www.linkedin.com/company/rioportop2p',
    'https://www.youtube.com/@rioportop2p',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rio Porto P2P',
  url: 'https://rioporto.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://rioporto.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const articleSchema = ({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  image,
  url,
}: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  author: {
    '@type': 'Person',
    name: author,
  },
  datePublished: publishedTime,
  dateModified: modifiedTime || publishedTime,
  image,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': url,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Rio Porto P2P',
    logo: {
      '@type': 'ImageObject',
      url: 'https://rioporto.com/logo.png',
    },
  },
});

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Compra e Venda de Bitcoin P2P',
  provider: {
    '@type': 'Organization',
    name: 'Rio Porto P2P',
  },
  description: 'Serviço de compra e venda de Bitcoin peer-to-peer com segurança e as melhores taxas do mercado.',
  areaServed: {
    '@type': 'Country',
    name: 'Brasil',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de Criptomoedas',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Compra de Bitcoin',
          description: 'Compre Bitcoin de forma segura e rápida através da nossa plataforma P2P.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Venda de Bitcoin',
          description: 'Venda seus Bitcoins com as melhores taxas e receba em sua conta rapidamente.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Transações OTC',
          description: 'Serviço especializado para grandes volumes com atendimento personalizado.',
        },
      },
    ],
  },
};