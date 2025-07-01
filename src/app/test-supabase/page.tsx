'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testConnection() {
      try {
        const testResults: any = {
          connection: false,
          tables: {},
          error: null,
        };

        // Teste de conexão - usando instância importada
        
        // Testar acesso às tabelas
        const tables = ['users', 'transactions', 'courses', 'blog_posts', 'faqs'];
        
        for (const table of tables) {
          try {
            const { error } = await supabase.from(table).select('count').limit(1);
            testResults.tables[table] = error ? `❌ ${error.message}` : '✅ Acessível';
          } catch (err: any) {
            testResults.tables[table] = `❌ ${err.message}`;
          }
        }

        // Testar autenticação
        try {
          const { data: { session } } = await supabase.auth.getSession();
          testResults.auth = session ? '✅ Sessão ativa' : '✅ Sem sessão (normal)';
        } catch (err: any) {
          testResults.auth = `❌ ${err.message}`;
        }

        testResults.connection = true;
        setResults(testResults);
      } catch (error: any) {
        setResults({ error: error.message, connection: false });
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Testando conexão com Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste de Conexão Supabase</h1>
        
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Status da Conexão: {results?.connection ? '✅ Conectado' : '❌ Erro'}
          </h2>

          {results?.error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              <strong>Erro:</strong> {results.error}
            </div>
          )}

          {results?.auth && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Autenticação:</h3>
              <p>{results.auth}</p>
            </div>
          )}

          {results?.tables && (
            <div>
              <h3 className="font-semibold mb-2">Tabelas:</h3>
              <ul className="space-y-2">
                {Object.entries(results.tables).map(([table, status]) => (
                  <li key={table} className="flex justify-between">
                    <span className="font-mono">{table}</span>
                    <span>{status as string}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h3 className="font-semibold mb-2">Próximos Passos:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Adicionar as variáveis de ambiente no Vercel</li>
              <li>Fazer commit e push das alterações</li>
              <li>Aguardar o deploy automático</li>
              <li>Testar autenticação em produção</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}