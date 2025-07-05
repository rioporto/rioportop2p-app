const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Configurações do Supabase
const supabaseUrl = 'https://wqrbyxgmpjvhmzgchjbb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcmJ5eGdtcGp2aG16Z2NoamJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQwODczNywiZXhwIjoyMDY2OTg0NzM3fQ.MfglQyxygXc_WIhJq6q41doilfeHempZBBZ4zoaU2rI';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdminUser() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('🔐 Criação de Usuário Admin\n');
  
  rl.question('Digite o email do usuário que será admin: ', async (email) => {
    try {
      // Verificar se o usuário existe
      const { data: user, error: userError } = await supabase
        .from('users_profile')
        .select('*')
        .eq('email', email)
        .single();
      
      if (userError || !user) {
        console.log('\n❌ Usuário não encontrado!');
        console.log('📝 Instruções:');
        console.log('1. Acesse http://localhost:3000/signup');
        console.log('2. Crie uma conta com o email:', email);
        console.log('3. Execute este script novamente\n');
        rl.close();
        return;
      }
      
      // Atualizar para admin
      const { error: updateError } = await supabase
        .from('users_profile')
        .update({ 
          is_admin: true,
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('email', email);
      
      if (updateError) {
        console.log('\n❌ Erro ao atualizar usuário:', updateError.message);
      } else {
        console.log('\n✅ Usuário promovido a admin com sucesso!');
        console.log('📍 Acesse: http://localhost:3000/admin');
        console.log('🔑 Login com:', email);
      }
      
    } catch (error) {
      console.error('\n❌ Erro:', error.message);
    } finally {
      rl.close();
    }
  });
}

// Executar
createAdminUser();