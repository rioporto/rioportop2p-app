require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não configuradas');
  process.exit(1);
}

// Criar cliente Supabase com service role key para ter acesso total
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAdminUsers() {
  console.log('Conectando ao Supabase...');
  console.log('URL:', supabaseUrl);
  console.log('');

  try {
    // Executar a query
    const { data, error } = await supabase
      .from('users_profile')
      .select('id, email, full_name, is_admin, created_at, updated_at')
      .or('email.like.%johnnyhelder%,is_admin.eq.true')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erro ao executar query:', error);
      return;
    }

    console.log('Resultados encontrados:', data?.length || 0);
    console.log('');

    if (data && data.length > 0) {
      console.log('Usuários encontrados:');
      console.log('='.repeat(100));
      
      data.forEach((user, index) => {
        console.log(`\nUsuário ${index + 1}:`);
        console.log('-'.repeat(50));
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Nome Completo: ${user.full_name || 'Não informado'}`);
        console.log(`É Admin: ${user.is_admin ? 'SIM' : 'NÃO'}`);
        console.log(`Criado em: ${new Date(user.created_at).toLocaleString('pt-BR')}`);
        console.log(`Atualizado em: ${new Date(user.updated_at).toLocaleString('pt-BR')}`);
      });
      
      console.log('\n' + '='.repeat(100));
    } else {
      console.log('Nenhum usuário encontrado com os critérios especificados.');
    }

  } catch (err) {
    console.error('Erro ao conectar ou executar query:', err);
  }
}

// Executar a função
checkAdminUsers();