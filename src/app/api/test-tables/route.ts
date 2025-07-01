import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Credenciais não configuradas' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const tables = ['users', 'transactions', 'courses', 'blog_posts', 'faqs', 'course_enrollments'];
  const results: Record<string, any> = {};
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        results[table] = { status: '❌', error: error.message };
      } else {
        results[table] = { status: '✅', count: count || 0 };
      }
    } catch (err: any) {
      results[table] = { status: '❌', error: err.message };
    }
  }
  
  // Verificar se o schema foi criado
  const schemaCheck = Object.values(results).every(r => r.status === '✅');
  
  return NextResponse.json({
    schemaCreated: schemaCheck,
    tables: results,
    supabaseUrl,
    timestamp: new Date().toISOString()
  });
}