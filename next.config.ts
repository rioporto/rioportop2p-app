import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration to ensure proper CSS processing
  reactStrictMode: true,
  // Ensure CSS modules work properly
  transpilePackages: ["@tailwindcss/postcss"],
  
  // SEO and Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    domains: ['rioporto.com', 'res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Headers for SEO and Security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)'
          }
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      // Redirects for broken links
      {
        source: '/register',
        destination: '/signup',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/sobre',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/contato',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/politica-de-privacidade',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/termos-de-uso',
        permanent: true,
      },
      // Additional redirects for common variations
      {
        source: '/profile',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/perfil',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/test-contact-form',
        destination: '/contato',
        permanent: true,
      },
      {
        source: '/blog/post/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/posts/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/admin/blog/create',
        destination: '/admin/blog',
        permanent: false,
      },
      {
        source: '/admin/blog/edit/:id',
        destination: '/admin/blog',
        permanent: false,
      },
      // Redirects for old or alternative URLs
      {
        source: '/p2p',
        destination: '/cotacao-p2p',
        permanent: true,
      },
      {
        source: '/cotacao',
        destination: '/cotacao-p2p',
        permanent: true,
      },
      {
        source: '/cotacoes',
        destination: '/cotacao-p2p',
        permanent: true,
      },
      {
        source: '/curso',
        destination: '/cursos',
        permanent: true,
      },
      {
        source: '/course',
        destination: '/cursos',
        permanent: true,
      },
      {
        source: '/courses',
        destination: '/cursos',
        permanent: true,
      },
      {
        source: '/politica-privacidade',
        destination: '/politica-de-privacidade',
        permanent: true,
      },
      {
        source: '/termos',
        destination: '/termos-de-uso',
        permanent: true,
      },
      {
        source: '/termos-uso',
        destination: '/termos-de-uso',
        permanent: true,
      },
      {
        source: '/cadastro',
        destination: '/signup',
        permanent: true,
      },
      {
        source: '/cadastrar',
        destination: '/signup',
        permanent: true,
      },
      {
        source: '/entrar',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/signin',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/minha-conta',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/my-account',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/painel',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
  
  // Rewrites for clean URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      // API standardization rewrites
      {
        source: '/api/quote',
        destination: '/api/cotacao',
      },
      {
        source: '/api/quotation',
        destination: '/api/cotacao',
      },
      {
        source: '/api/user/profile',
        destination: '/api/users/profile',
      },
      {
        source: '/api/user/kyc',
        destination: '/api/users/kyc',
      },
    ];
  },
};

export default nextConfig;
