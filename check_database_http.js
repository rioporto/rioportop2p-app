const https = require('https');

// Configuração do Supabase
const SUPABASE_URL = 'https://wqrbyxgmpjvhmzgchjbb.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'; // Você precisará fornecer a chave anon do Supabase

async function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'wqrbyxgmpjvhmzgchjbb.supabase.co',
      path: path,
      method: method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function checkTables() {
  console.log('=== VERIFICAÇÃO VIA API REST DO SUPABASE ===');
  console.log('\nNOTA: Para uma verificação completa do banco de dados, você precisará:');
  console.log('1. Fornecer a chave anon (SUPABASE_ANON_KEY) do seu projeto Supabase');
  console.log('2. Ou usar uma ferramenta de administração de banco de dados como pgAdmin, DBeaver, etc.');
  console.log('3. Ou acessar o painel do Supabase em: https://app.supabase.com/project/wqrbyxgmpjvhmzgchjbb');
  
  console.log('\n=== RESUMO BASEADO NA ESTRUTURA DO PROJETO ===');
  console.log('\nTabelas que DEVEM estar criadas no banco:');
  console.log('1. notifications - Para gerenciar notificações do sistema');
  console.log('2. two_factor_auth - Para autenticação de dois fatores');
  console.log('3. pix_keys - Para armazenar chaves PIX dos usuários');
  console.log('4. crypto_prices - Para armazenar preços de criptomoedas');
  console.log('5. contact_messages - Para mensagens de contato');
  
  console.log('\nOutras tabelas padrão do Supabase Auth:');
  console.log('- auth.users - Tabela de usuários (criada automaticamente)');
  console.log('- auth.sessions - Sessões de usuários');
  console.log('- auth.refresh_tokens - Tokens de atualização');
  
  console.log('\n=== AÇÕES RECOMENDADAS ===');
  console.log('1. Acesse o painel do Supabase para verificar visualmente as tabelas');
  console.log('2. Use o SQL Editor do Supabase para executar queries diretamente');
  console.log('3. Verifique se as migrations foram executadas corretamente');
}

// Analisar os arquivos do projeto para entender a estrutura esperada
const fs = require('fs');
const path = require('path');

function findDatabaseFiles(dir, files = []) {
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        findDatabaseFiles(fullPath, files);
      } else if (stat.isFile() && (
        item.includes('schema') || 
        item.includes('migration') || 
        item.includes('database') ||
        item.endsWith('.sql')
      )) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // Ignorar erros de permissão
  }
  return files;
}

console.log('\n=== ARQUIVOS DE BANCO DE DADOS ENCONTRADOS NO PROJETO ===');
const dbFiles = findDatabaseFiles('/home/johnnyhelder/Projetos/rioportop2p-app');
dbFiles.forEach(file => {
  console.log(`- ${file}`);
});

checkTables();