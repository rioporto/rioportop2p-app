import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const results = {
    connection: false,
    tables: {},
    error: null,
    credentials: {
      url: supabaseUrl ? '✅ Configurado' : '❌ Faltando',
      anonKey: supabaseAnonKey ? '✅ Configurado' : '❌ Faltando',
      serviceKey: supabaseServiceKey ? '✅ Configurado' : '❌ Faltando',
    }
  };

  if (!supabaseUrl || !supabaseAnonKey) {
    results.error = 'Credenciais do Supabase não configuradas';
    return NextResponse.json(results, { status: 500 });
  }

  try {
    // Teste com chave anônima
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Testar acesso às tabelas
    const tables = ['users', 'transactions', 'courses', 'blog_posts', 'faqs'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count').limit(1);
        results.tables[table] = error ? `❌ ${error.message}` : '✅ Acessível';
      } catch (err) {
        results.tables[table] = `❌ ${err.message}`;
      }
    }

    // Teste com service key se disponível
    if (supabaseServiceKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const { count, error } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        results.userCount = count || 0;
      }
    }

    results.connection = true;
    return NextResponse.json(results);

  } catch (error) {
    results.error = error.message;
    return NextResponse.json(results, { status: 500 });
  }
}