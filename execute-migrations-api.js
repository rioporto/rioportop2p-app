const fs = require('fs').promises;
const https = require('https');

// Configurações
const SUPABASE_URL = 'https://wqrbyxgmpjvhmzgchjbb.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcmJ5eGdtcGp2aG16Z2NoamJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQwODczNywiZXhwIjoyMDY2OTg0NzM3fQ.MfglQyxygXc_WIhJq6q41doilfeHempZBBZ4zoaU2rI';

async function executeSQLViaAPI(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);
    
    const options = {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    
    req.write(JSON.stringify({ sql }));
    req.end();
  });
}

async function main() {
  console.log('🔄 Tentando executar migrations via API...\n');
  
  const migrations = [
    { file: 'supabase/migrations/create_notifications_table.sql', name: 'create_notifications_table' },
    { file: 'supabase/migrations/008_two_factor_auth.sql', name: '008_two_factor_auth' },
    { file: 'supabase/migrations/006_pix_payment_system_CORRIGIDA.sql', name: '006_pix_payment_system_CORRIGIDA' },
    { file: 'supabase/migrations/20250103_create_crypto_prices_table.sql', name: '20250103_create_crypto_prices_table' }
  ];
  
  // Vamos criar um arquivo SQL combinado para facilitar a execução manual
  let combinedSQL = '-- Combined migrations file\n';
  combinedSQL += '-- Execute this in Supabase SQL Editor\n\n';
  
  for (const migration of migrations) {
    const sql = await fs.readFile(migration.file, 'utf8');
    combinedSQL += `-- ========== ${migration.name} ==========\n`;
    combinedSQL += sql;
    combinedSQL += '\n\n';
  }
  
  // Salvar arquivo combinado
  await fs.writeFile('supabase/migrations/combined_migrations.sql', combinedSQL);
  console.log('✅ Arquivo combinado criado: supabase/migrations/combined_migrations.sql');
  
  console.log('\n========== COMO EXECUTAR AS MIGRATIONS ==========\n');
  console.log('Como o acesso direto ao banco está bloqueado, você tem duas opções:\n');
  
  console.log('OPÇÃO 1 - Via Supabase Dashboard (Recomendado):');
  console.log('1. Acesse: https://app.supabase.com/project/wqrbyxgmpjvhmzgchjbb/editor');
  console.log('2. Clique em "SQL Editor" no menu lateral');
  console.log('3. Cole o conteúdo do arquivo: supabase/migrations/combined_migrations.sql');
  console.log('4. Clique em "Run" para executar\n');
  
  console.log('OPÇÃO 2 - Via Supabase CLI:');
  console.log('1. Instale o Supabase CLI: npm install -g supabase');
  console.log('2. Faça login: supabase login');
  console.log('3. Link ao projeto: supabase link --project-ref wqrbyxgmpjvhmzgchjbb');
  console.log('4. Execute: supabase db push\n');
  
  console.log('========== STATUS ATUAL DAS TABELAS ==========');
  console.log('❌ notifications - Não existe');
  console.log('❌ two_factor_auth - Não existe');
  console.log('✅ backup_codes - Existe (0 registros)');
  console.log('❌ pix_keys - Não existe');
  console.log('❌ pix_payment_details - Não existe');
  console.log('❌ pix_webhooks - Não existe');
  console.log('❌ pix_payment_confirmations - Não existe');
  console.log('❌ crypto_prices - Não existe');
}

main().catch(console.error);