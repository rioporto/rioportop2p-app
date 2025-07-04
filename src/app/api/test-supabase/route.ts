import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const results: {
    connection: boolean;
    tables: Record<string, string>;
    error: string | null;
    credentials: Record<string, string>;
    userCount?: number;
  } = {
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
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    
    // Testar acesso às novas tabelas
    const tables = ['users_profile', 'transactions', 'orders', 'cryptocurrencies', 'kyc_documents', 'chat_messages', 'notifications'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count').limit(1);
        results.tables[table] = error ? `❌ ${error.message}` : '✅ Acessível';
      } catch (err: any) {
        results.tables[table] = `❌ ${err.message}`;
      }
    }

    // Teste com service key se disponível
    if (supabaseServiceKey) {
      const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);
      const { count, error } = await supabaseAdmin
        .from('users_profile')
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        results.userCount = count || 0;
      }
      
      // Verificar se temos criptomoedas cadastradas
      const { data: cryptos } = await supabaseAdmin
        .from('cryptocurrencies')
        .select('symbol, name')
        .limit(5);
        
      if (cryptos) {
        results.tables['cryptocurrencies'] = `✅ ${cryptos.length} moedas cadastradas`;
      }
    }

    results.connection = true;
    return NextResponse.json(results);

  } catch (error: any) {
    results.error = error.message || 'Erro desconhecido';
    return NextResponse.json(results, { status: 500 });
  }
}