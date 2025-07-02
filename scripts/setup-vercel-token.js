#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Configuração do Token do Vercel\n');
console.log('Este script vai ajudar você a configurar o token de forma segura.\n');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  // Verificar se .env.local existe
  const envPath = path.join(process.cwd(), '.env.local');
  let existingContent = '';
  
  if (fs.existsSync(envPath)) {
    existingContent = fs.readFileSync(envPath, 'utf8');
    console.log('⚠️  Arquivo .env.local já existe. O token será adicionado/atualizado.\n');
  }

  // Pedir o token
  console.log('1. Acesse: https://vercel.com/account/tokens');
  console.log('2. Crie um novo token com "Full Access"');
  console.log('3. Copie o token (começa com "vusr_")\n');
  
  const token = await question('Cole seu token aqui: ');
  
  if (!token || !token.startsWith('vusr_')) {
    console.error('\n❌ Token inválido! Tokens do Vercel começam com "vusr_"');
    rl.close();
    process.exit(1);
  }

  // Verificar se precisa do Team ID
  const needsTeam = await question('\nVocê usa Vercel Teams? (s/N): ');
  let teamId = '';
  
  if (needsTeam.toLowerCase() === 's') {
    teamId = await question('Digite seu Team ID: ');
  }

  // Preparar conteúdo
  let newContent = existingContent;
  
  // Remover tokens antigos se existirem
  newContent = newContent.replace(/VERCEL_TOKEN=.*/g, '');
  newContent = newContent.replace(/VERCEL_TEAM_ID=.*/g, '');
  
  // Adicionar novos valores
  if (!newContent.endsWith('\n') && newContent.length > 0) {
    newContent += '\n';
  }
  
  newContent += `VERCEL_TOKEN=${token}\n`;
  if (teamId) {
    newContent += `VERCEL_TEAM_ID=${teamId}\n`;
  }

  // Salvar arquivo
  fs.writeFileSync(envPath, newContent);
  console.log('\n✅ Token configurado com sucesso em .env.local');

  // Criar script de carregamento
  const loadScriptPath = path.join(process.cwd(), 'scripts', 'load-env.sh');
  const loadScript = `#!/bin/bash
# Carrega variáveis do .env.local
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
  echo "✅ Variáveis de ambiente carregadas"
else
  echo "❌ Arquivo .env.local não encontrado"
fi`;

  fs.writeFileSync(loadScriptPath, loadScript);
  fs.chmodSync(loadScriptPath, '755');

  console.log('\n📝 Instruções de uso:\n');
  console.log('1. Para carregar as variáveis no terminal atual:');
  console.log('   source scripts/load-env.sh\n');
  console.log('2. Para fazer deploy e verificar:');
  console.log('   ./scripts/deploy-and-check.sh "sua mensagem"\n');
  console.log('3. Para verificar apenas o último deploy:');
  console.log('   node scripts/check-deploy.js\n');

  rl.close();
}

setup().catch(error => {
  console.error('❌ Erro:', error);
  rl.close();
  process.exit(1);
});