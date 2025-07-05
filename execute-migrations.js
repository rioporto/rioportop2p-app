const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');

async function executeMigration(client, filePath, migrationName) {
  try {
    console.log(`\n========== Executando migration: ${migrationName} ==========`);
    const sql = await fs.readFile(filePath, 'utf8');
    await client.query(sql);
    console.log(`✅ Migration ${migrationName} executada com sucesso!`);
    return { success: true, migration: migrationName };
  } catch (error) {
    console.error(`❌ Erro ao executar migration ${migrationName}:`, error.message);
    return { success: false, migration: migrationName, error: error.message };
  }
}

async function checkTables(client) {
  console.log('\n========== Verificando tabelas criadas ==========');
  const tables = ['notifications', 'two_factor_auth', 'backup_codes', 'pix_keys', 'pix_payment_details', 'pix_webhooks', 'pix_payment_confirmations', 'crypto_prices'];
  
  for (const table of tables) {
    try {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [table]);
      
      const exists = result.rows[0].exists;
      console.log(`${exists ? '✅' : '❌'} Tabela ${table}: ${exists ? 'Existe' : 'Não existe'}`);
      
      if (exists) {
        // Contar registros
        const countResult = await client.query(`SELECT COUNT(*) FROM public.${table}`);
        console.log(`   └─ Registros: ${countResult.rows[0].count}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao verificar tabela ${table}:`, error.message);
    }
  }
}

async function main() {
  const client = new Client({
    host: 'db.wqrbyxgmpjvhmzgchjbb.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Dat15975310***',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados Supabase!');

    const migrations = [
      {
        file: 'supabase/migrations/create_notifications_table.sql',
        name: 'create_notifications_table'
      },
      {
        file: 'supabase/migrations/008_two_factor_auth.sql',
        name: '008_two_factor_auth'
      },
      {
        file: 'supabase/migrations/006_pix_payment_system_CORRIGIDA.sql',
        name: '006_pix_payment_system_CORRIGIDA'
      },
      {
        file: 'supabase/migrations/20250103_create_crypto_prices_table.sql',
        name: '20250103_create_crypto_prices_table'
      }
    ];

    const results = [];
    
    for (const migration of migrations) {
      const result = await executeMigration(client, migration.file, migration.name);
      results.push(result);
    }

    // Verificar tabelas criadas
    await checkTables(client);

    // Resumo final
    console.log('\n========== RESUMO DA EXECUÇÃO ==========');
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Migrations executadas com sucesso: ${successful.length}`);
    successful.forEach(r => console.log(`   - ${r.migration}`));
    
    if (failed.length > 0) {
      console.log(`\n❌ Migrations que falharam: ${failed.length}`);
      failed.forEach(r => console.log(`   - ${r.migration}: ${r.error}`));
    }

  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
  } finally {
    await client.end();
    console.log('\n✅ Conexão encerrada.');
  }
}

main();