import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { createClient } from '@supabase/supabase-js';

async function checkAdminAccess() {
  // Por enquanto, vamos usar uma verificação simples
  // TODO: Implementar verificação real com Supabase
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Temporariamente, vamos verificar um header secreto
  // Em produção, isso deve verificar o usuário no banco
  const adminSecret = process.env.ADMIN_SECRET || 'admin-temp-secret';
  const authHeader = headersList.get('authorization');
  
  // Se não tiver o header secreto, redireciona
  if (authHeader !== `Bearer ${adminSecret}`) {
    // Por enquanto, vamos apenas mostrar um aviso
    console.warn('Acesso admin sem autenticação');
  }
  
  return true;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar acesso admin
  await checkAdminAccess();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}