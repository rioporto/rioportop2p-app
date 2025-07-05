const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Credenciais do .env.local
const supabaseUrl = 'https://wqrbyxgmpjvhmzgchjbb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcmJ5eGdtcGp2aG16Z2NoamJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQwODczNywiZXhwIjoyMDY2OTg0NzM3fQ.MfglQyxygXc_WIhJq6q41doilfeHempZBBZ4zoaU2rI';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeMigration(sql, migrationName) {
  try {
    console.log(`\n========== Executando migration: ${migrationName} ==========`);
    
    // Dividir o SQL em comandos individuais para evitar problemas
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i] + ';';
      
      // Pular comandos vazios ou apenas comentários
      if (command.trim().length <= 1) continue;
      
      console.log(`Executando comando ${i + 1}/${commands.length}...`);
      
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: command
      }).select();
      
      if (error) {
        // Se o erro for porque a função não existe, vamos usar uma abordagem diferente
        if (error.message.includes('exec_sql')) {
          console.log('Função exec_sql não disponível, tentando abordagem alternativa...');
          // Como não podemos executar SQL diretamente via SDK, vamos apenas registrar
          console.log('⚠️  Migration não pode ser executada diretamente via SDK');
          return { success: false, migration: migrationName, error: 'SDK não suporta execução direta de DDL' };
        }
        throw error;
      }
    }
    
    console.log(`✅ Migration ${migrationName} executada com sucesso!`);
    return { success: true, migration: migrationName };
  } catch (error) {
    console.error(`❌ Erro ao executar migration ${migrationName}:`, error.message);
    return { success: false, migration: migrationName, error: error.message };
  }
}

async function checkTables() {
  console.log('\n========== Verificando tabelas criadas ==========');
  const tables = ['notifications', 'two_factor_auth', 'backup_codes', 'pix_keys', 'pix_payment_details', 'pix_webhooks', 'pix_payment_confirmations', 'crypto_prices'];
  
  for (const table of tables) {
    try {
      // Tentar fazer uma query simples para verificar se a tabela existe
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ Tabela ${table}: Não existe`);
        } else {
          console.log(`⚠️  Tabela ${table}: Erro ao verificar - ${error.message}`);
        }
      } else {
        console.log(`✅ Tabela ${table}: Existe`);
        
        // Contar registros
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        console.log(`   └─ Registros: ${count || 0}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao verificar tabela ${table}:`, error.message);
    }
  }
}

async function main() {
  try {
    console.log('🔄 Iniciando execução das migrations...');
    console.log('⚠️  Nota: O Supabase SDK não suporta execução direta de DDL (CREATE TABLE, etc.)');
    console.log('ℹ️  Para executar as migrations, você precisa usar:');
    console.log('   1. Supabase Dashboard SQL Editor');
    console.log('   2. Supabase CLI (supabase db push)');
    console.log('   3. psql ou outro cliente PostgreSQL');
    
    // Vamos apenas verificar o estado atual das tabelas
    await checkTables();
    
    console.log('\n========== INSTRUÇÕES PARA EXECUTAR AS MIGRATIONS ==========');
    console.log('1. Acesse: https://app.supabase.com/project/wqrbyxgmpjvhmzgchjbb/editor');
    console.log('2. Vá para SQL Editor');
    console.log('3. Execute cada arquivo de migration na seguinte ordem:');
    console.log('   - create_notifications_table.sql');
    console.log('   - 008_two_factor_auth.sql');
    console.log('   - 006_pix_payment_system_CORRIGIDA.sql');
    console.log('   - 20250103_create_crypto_prices_table.sql');
    
    // Vamos ler e mostrar um resumo de cada migration
    console.log('\n========== RESUMO DAS MIGRATIONS ==========');
    
    const migrations = [
      { file: 'supabase/migrations/create_notifications_table.sql', name: 'create_notifications_table' },
      { file: 'supabase/migrations/008_two_factor_auth.sql', name: '008_two_factor_auth' },
      { file: 'supabase/migrations/006_pix_payment_system_CORRIGIDA.sql', name: '006_pix_payment_system_CORRIGIDA' },
      { file: 'supabase/migrations/20250103_create_crypto_prices_table.sql', name: '20250103_create_crypto_prices_table' }
    ];
    
    for (const migration of migrations) {
      const sql = await fs.readFile(migration.file, 'utf8');
      const lines = sql.split('\n');
      console.log(`\n📄 ${migration.name}:`);
      
      // Extrair tabelas que serão criadas
      const createTableRegex = /CREATE TABLE IF NOT EXISTS\s+(?:public\.)?(\w+)/gi;
      const tables = [...sql.matchAll(createTableRegex)].map(match => match[1]);
      
      if (tables.length > 0) {
        console.log(`   Tabelas: ${tables.join(', ')}`);
      }
      
      // Contar outros objetos
      const indexes = (sql.match(/CREATE INDEX/gi) || []).length;
      const policies = (sql.match(/CREATE POLICY/gi) || []).length;
      const functions = (sql.match(/CREATE OR REPLACE FUNCTION/gi) || []).length;
      const triggers = (sql.match(/CREATE TRIGGER/gi) || []).length;
      
      if (indexes > 0) console.log(`   Índices: ${indexes}`);
      if (policies > 0) console.log(`   Políticas RLS: ${policies}`);
      if (functions > 0) console.log(`   Funções: ${functions}`);
      if (triggers > 0) console.log(`   Triggers: ${triggers}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

main();