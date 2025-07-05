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

async function checkAllUsers() {
  console.log('Conectando ao Supabase...');
  console.log('URL:', supabaseUrl);
  console.log('');

  try {
    // Primeiro, vamos verificar se a tabela existe listando todas as tabelas
    console.log('Verificando tabelas disponíveis...');
    
    // Listar todos os usuários (limite de 100 para não sobrecarregar)
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .limit(100)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar usuários:', error);
      
      // Se der erro, vamos tentar verificar se a tabela existe
      console.log('\nTentando verificar estrutura do banco...');
      
      // Tentar buscar informações sobre as tabelas
      const { data: tables, error: tableError } = await supabase
        .rpc('get_tables_info', {}, { count: 'exact' })
        .catch(() => ({ data: null, error: 'RPC function not available' }));
      
      if (tables) {
        console.log('Tabelas encontradas:', tables);
      } else {
        console.log('Não foi possível listar as tabelas. Erro:', tableError);
      }
      
      return;
    }

    console.log('Total de usuários encontrados:', data?.length || 0);
    console.log('');

    if (data && data.length > 0) {
      console.log('Lista de todos os usuários:');
      console.log('='.repeat(120));
      
      // Mostrar as colunas disponíveis
      const columns = Object.keys(data[0]);
      console.log('Colunas disponíveis:', columns.join(', '));
      console.log('='.repeat(120));
      
      data.forEach((user, index) => {
        console.log(`\nUsuário ${index + 1}:`);
        console.log('-'.repeat(60));
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email || 'Não informado'}`);
        console.log(`Nome Completo: ${user.full_name || 'Não informado'}`);
        console.log(`É Admin: ${user.is_admin !== undefined ? (user.is_admin ? 'SIM' : 'NÃO') : 'Campo não existe'}`);
        console.log(`Criado em: ${user.created_at ? new Date(user.created_at).toLocaleString('pt-BR') : 'Não informado'}`);
        
        // Mostrar outros campos relevantes
        if (user.phone) console.log(`Telefone: ${user.phone}`);
        if (user.cpf) console.log(`CPF: ${user.cpf}`);
        if (user.kyc_status) console.log(`Status KYC: ${user.kyc_status}`);
      });
      
      console.log('\n' + '='.repeat(120));
      
      // Estatísticas
      const adminCount = data.filter(u => u.is_admin === true).length;
      console.log(`\nEstatísticas:`);
      console.log(`Total de usuários: ${data.length}`);
      console.log(`Usuários admin: ${adminCount}`);
      console.log(`Usuários normais: ${data.length - adminCount}`);
      
    } else {
      console.log('Nenhum usuário encontrado na tabela users_profile.');
    }

  } catch (err) {
    console.error('Erro ao conectar ou executar query:', err);
  }
}

// Executar a função
checkAllUsers();