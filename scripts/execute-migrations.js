const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurações do Supabase
const supabaseUrl = 'https://wqrbyxgmpjvhmzgchjbb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcmJ5eGdtcGp2aG16Z2NoamJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQwODczNywiZXhwIjoyMDY2OTg0NzM3fQ.MfglQyxygXc_WIhJq6q41doilfeHempZBBZ4zoaU2rI';

async function executeMigrations() {
  console.log('🚀 Iniciando execução das migrations...\n');
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Ler o arquivo SQL
  const sqlPath = path.join(__dirname, '..', 'execute_missing_migrations.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  // Dividir em comandos individuais (por ponto e vírgula seguido de nova linha)
  const commands = sqlContent
    .split(/;\s*\n/)
    .filter(cmd => cmd.trim())
    .map(cmd => cmd.trim() + ';');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const command of commands) {
    // Pular comentários e comandos vazios
    if (command.startsWith('--') || command.trim() === ';') {
      continue;
    }
    
    try {
      // Executar comando via RPC (função SQL)
      const { data, error } = await supabase.rpc('execute_sql', {
        query: command
      });
      
      if (error) {
        // Tentar execução direta se RPC não funcionar
        console.log(`⚠️  Tentando método alternativo para: ${command.substring(0, 50)}...`);
        // Por enquanto, apenas registrar o erro
        console.error(`❌ Erro: ${error.message}`);
        errorCount++;
      } else {
        console.log(`✅ Comando executado com sucesso`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Erro ao executar: ${err.message}`);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Resumo da execução:`);
  console.log(`✅ Comandos bem-sucedidos: ${successCount}`);
  console.log(`❌ Comandos com erro: ${errorCount}`);
  
  // Verificar tabelas criadas
  console.log('\n🔍 Verificando tabelas criadas...');
  
  const tablesToCheck = ['notifications', 'two_factor_auth', 'pix_keys', 'crypto_prices', 'contact_messages'];
  
  for (const tableName of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Tabela ${tableName}: NÃO ENCONTRADA`);
      } else {
        console.log(`✅ Tabela ${tableName}: OK`);
      }
    } catch (err) {
      console.log(`❌ Tabela ${tableName}: ERRO - ${err.message}`);
    }
  }
}

// Executar
executeMigrations().catch(console.error);