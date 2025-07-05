const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://wqrbyxgmpjvhmzgchjbb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcmJ5eGdtcGp2aG16Z2NoamJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQwODczNywiZXhwIjoyMDY2OTg0NzM3fQ.MfglQyxygXc_WIhJq6q41doilfeHempZBBZ4zoaU2rI';

async function verifyTables() {
  console.log('🔍 Verificando tabelas no Supabase...\n');
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Tabelas essenciais que devem existir
  const essentialTables = [
    'notifications',
    'two_factor_auth', 
    'pix_keys',
    'crypto_prices',
    'contact_messages',
    'users_profile',
    'transactions',
    'cryptocurrencies',
    'blog_posts',
    'courses'
  ];
  
  let foundCount = 0;
  let missingCount = 0;
  
  console.log('📋 Verificando tabelas essenciais:\n');
  
  for (const tableName of essentialTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('count(*)', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${tableName}: NÃO ENCONTRADA`);
        missingCount++;
      } else {
        console.log(`✅ ${tableName}: OK`);
        foundCount++;
      }
    } catch (err) {
      console.log(`❌ ${tableName}: ERRO - ${err.message}`);
      missingCount++;
    }
  }
  
  console.log(`\n📊 Resumo:`);
  console.log(`✅ Tabelas encontradas: ${foundCount}`);
  console.log(`❌ Tabelas faltando: ${missingCount}`);
  console.log(`📋 Total verificado: ${essentialTables.length}`);
  
  if (missingCount === 0) {
    console.log('\n🎉 Todas as tabelas essenciais foram criadas com sucesso!');
  } else {
    console.log('\n⚠️  Ainda há tabelas faltando. Verifique o SQL Editor do Supabase.');
  }
}

// Executar
verifyTables().catch(console.error);