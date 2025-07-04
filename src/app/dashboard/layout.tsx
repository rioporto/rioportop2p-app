import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Dashboard - Gerencie suas transações de Bitcoin',
  description: 'Painel de controle completo para gerenciar suas transações de Bitcoin, acompanhar cotações em tempo real e histórico de operações.',
  keywords: ['dashboard', 'painel', 'transações bitcoin', 'gerenciar bitcoin', 'cotações', 'histórico'],
  canonicalUrl: 'https://rioporto.com/dashboard',
  ogType: 'website',
  noindex: true, // Dashboard é área privada
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}