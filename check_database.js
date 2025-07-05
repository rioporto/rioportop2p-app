const { Pool } = require('pg');

const pool = new Pool({
  host: 'db.wqrbyxgmpjvhmzgchjbb.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Dat15975310***',
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    // 1. Listar todas as tabelas do schema public
    const tablesQuery = `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `;
    const tablesResult = await pool.query(tablesQuery);
    
    console.log('=== TODAS AS TABELAS DO SCHEMA PUBLIC ===');
    tablesResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.tablename}`);
    });
    
    // 2. Verificar tabelas específicas
    const specificTables = [
      'notifications',
      'two_factor_auth',
      'pix_keys',
      'crypto_prices',
      'contact_messages'
    ];
    
    console.log('\n=== VERIFICAÇÃO DE TABELAS ESPECÍFICAS ===');
    for (const tableName of specificTables) {
      const exists = tablesResult.rows.some(row => row.tablename === tableName);
      console.log(`${tableName}: ${exists ? '✓ EXISTE' : '✗ NÃO EXISTE'}`);
    }
    
    // 3. Contar total de tabelas
    console.log(`\n=== TOTAL DE TABELAS: ${tablesResult.rows.length} ===`);
    
    // 4. Verificar estrutura das tabelas criadas
    console.log('\n=== ESTRUTURA DAS TABELAS CRIADAS ===');
    
    for (const tableName of specificTables) {
      const exists = tablesResult.rows.some(row => row.tablename === tableName);
      if (exists) {
        const columnsQuery = `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position;
        `;
        const columnsResult = await pool.query(columnsQuery, [tableName]);
        
        console.log(`\n${tableName.toUpperCase()}:`);
        columnsResult.rows.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}${col.column_default ? ` DEFAULT ${col.column_default}` : ''}`);
        });
      }
    }
    
  } catch (error) {
    console.error('ERRO ao conectar ou consultar banco de dados:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();