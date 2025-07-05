'use client';

import dynamic from 'next/dynamic';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserPreferencesProvider>
      <NotificationProvider>
        <Navbar />
        <div className="min-h-screen pt-16">
          {children}
        </div>
        <Footer />
      </NotificationProvider>
    </UserPreferencesProvider>
  );
}