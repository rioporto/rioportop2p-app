const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://wqrbyxgmpjvhmzgchjbb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcmJ5eGdtcGp2aG16Z2NoamJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQwODczNywiZXhwIjoyMDY2OTg0NzM3fQ.MfglQyxygXc_WIhJq6q41doilfeHempZBBZ4zoaU2rI';

async function checkUsersProfileTable() {
  console.log('🔍 Verificando tabela users_profile no Supabase...\n');
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // 1. Verificar se a tabela existe e obter informações sobre as colunas
    console.log('📊 Consultando estrutura da tabela users_profile...\n');
    
    // Consultar information_schema para obter as colunas
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public')
      .eq('table_name', 'users_profile')
      .order('ordinal_position');
    
    if (columnsError) {
      // Se der erro, tentar fazer uma query simples para verificar se a tabela existe
      const { error: tableError } = await supabase
        .from('users_profile')
        .select('*')
        .limit(0);
      
      if (tableError) {
        console.error('❌ Erro ao acessar a tabela users_profile:', tableError.message);
        console.log('\n⚠️  A tabela users_profile pode não existir.');
        return;
      }
    }
    
    if (columns && columns.length > 0) {
      console.log('✅ Tabela users_profile encontrada!\n');
      console.log('📋 Colunas da tabela:');
      console.log('─'.repeat(80));
      
      columns.forEach((col, index) => {
        console.log(`${index + 1}. ${col.column_name}`);
        console.log(`   Tipo: ${col.data_type}`);
        console.log(`   Nullable: ${col.is_nullable}`);
        if (col.column_default) {
          console.log(`   Valor padrão: ${col.column_default}`);
        }
        console.log('');
      });
      
      console.log('─'.repeat(80));
      console.log(`\n📊 Total de colunas: ${columns.length}`);
    } else {
      // Se não conseguir pelo information_schema, tentar outro método
      console.log('⚠️  Não foi possível obter informações detalhadas das colunas.');
      console.log('Tentando método alternativo...\n');
      
      // Fazer uma query para obter um registro e verificar as colunas
      const { data: sampleData, error: sampleError } = await supabase
        .from('users_profile')
        .select('*')
        .limit(1);
      
      if (!sampleError && sampleData) {
        if (sampleData.length > 0) {
          const columnNames = Object.keys(sampleData[0]);
          console.log('✅ Colunas encontradas através de amostra de dados:\n');
          columnNames.forEach((col, index) => {
            console.log(`${index + 1}. ${col}`);
          });
          console.log(`\n📊 Total de colunas: ${columnNames.length}`);
        } else {
          console.log('⚠️  A tabela existe mas está vazia. Não foi possível determinar as colunas.');
        }
      }
    }
    
    // 2. Verificar se existem registros na tabela
    console.log('\n\n📊 Verificando registros na tabela...');
    
    const { count, error: countError } = await supabase
      .from('users_profile')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Erro ao contar registros:', countError.message);
    } else {
      console.log(`\n✅ Total de registros na tabela: ${count || 0}`);
      
      if (count > 0) {
        // Buscar alguns registros de exemplo
        const { data: records, error: recordsError } = await supabase
          .from('users_profile')
          .select('*')
          .limit(5);
        
        if (!recordsError && records) {
          console.log(`\n📋 Primeiros ${Math.min(count, 5)} registros:`);
          console.log('─'.repeat(80));
          records.forEach((record, index) => {
            console.log(`\nRegistro ${index + 1}:`);
            Object.entries(record).forEach(([key, value]) => {
              console.log(`  ${key}: ${value}`);
            });
          });
          console.log('─'.repeat(80));
        }
      } else {
        console.log('\n⚠️  A tabela está vazia (sem registros).');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar tabela:', error.message);
  }
}

// Executar
checkUsersProfileTable().catch(console.error);