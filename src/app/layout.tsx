import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./fallback.css";
import ClientLayout from "@/components/ClientLayout";
import { StackAuthProvider } from "@/components/StackAuthProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/components/SEO";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://rioporto.com'),
  title: {
    default: "Rio Porto P2P - Compra e Venda de Bitcoin com Segurança",
    template: "%s | Rio Porto P2P"
  },
  description: "A melhor plataforma P2P do Brasil para comprar e vender Bitcoin. Transações seguras, rápidas e com as melhores taxas do mercado. Suporte 24/7.",
  keywords: ['bitcoin', 'p2p', 'criptomoedas', 'comprar bitcoin', 'vender bitcoin', 'exchange brasil', 'bitcoin brasil', 'rio porto', 'transações seguras', 'otc bitcoin'],
  authors: [{ name: 'Rio Porto P2P' }],
  creator: 'Rio Porto P2P',
  publisher: 'Rio Porto P2P',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Rio Porto P2P - Compra e Venda de Bitcoin com Segurança',
    description: 'A melhor plataforma P2P do Brasil para comprar e vender Bitcoin. Transações seguras, rápidas e com as melhores taxas do mercado.',
    url: 'https://rioporto.com',
    siteName: 'Rio Porto P2P',
    images: [
      {
        url: 'https://rioporto.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rio Porto P2P - Compra e Venda de Bitcoin',
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rio Porto P2P - Compra e Venda de Bitcoin com Segurança',
    description: 'A melhor plataforma P2P do Brasil para comprar e vender Bitcoin. Transações seguras e rápidas.',
    site: '@rioportop2p',
    creator: '@rioportop2p',
    images: ['https://rioporto.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://rioporto.com',
    languages: {
      'pt-BR': 'https://rioporto.com',
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <JsonLd data={[organizationSchema, websiteSchema]} />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100`}>
        <GoogleAnalytics />
        <StackAuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </StackAuthProvider>
      </body>
    </html>
  );
}
