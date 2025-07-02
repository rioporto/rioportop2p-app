#!/usr/bin/env node

/**
 * Script melhorado para verificar deploy com suporte a .env.local
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Carregar .env.local se existir
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = process.env.VERCEL_TEAM_ID;
const PROJECT_NAME = 'rioportop2p-app';

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN não encontrado!');
  console.error('\nConfigure usando: node scripts/setup-vercel-token.js');
  process.exit(1);
}

// Função para fazer requisições
function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
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
    req.end();
  });
}

// Buscar último deployment
async function getLatestDeployment() {
  const teamQuery = TEAM_ID ? `&teamId=${TEAM_ID}` : '';
  const path = `/v6/deployments?projectId=${PROJECT_NAME}&limit=1${teamQuery}`;
  
  const response = await makeRequest(path);
  if (response.deployments && response.deployments.length > 0) {
    return response.deployments[0];
  }
  return null;
}

// Buscar logs de build
async function getBuildLogs(deploymentId) {
  const teamQuery = TEAM_ID ? `?teamId=${TEAM_ID}` : '';
  const path = `/v2/deployments/${deploymentId}/events${teamQuery}`;
  
  try {
    const response = await makeRequest(path);
    return response;
  } catch (error) {
    return null;
  }
}

// Verificar status com mais detalhes
async function checkDeploymentStatus(deploymentId) {
  const teamQuery = TEAM_ID ? `?teamId=${TEAM_ID}` : '';
  const path = `/v13/deployments/${deploymentId}${teamQuery}`;
  
  const deployment = await makeRequest(path);
  return deployment;
}

// Função principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'push' || !command) {
    // Fazer push e verificar
    console.log('📦 Fazendo push para GitHub...');
    
    try {
      execSync('git push origin main', { stdio: 'inherit' });
      console.log('✅ Push concluído!\n');
    } catch (error) {
      console.error('❌ Erro no push');
      process.exit(1);
    }

    // Aguardar Vercel detectar
    console.log('⏳ Aguardando Vercel detectar o push...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Buscar e monitorar deployment
  console.log('🔍 Buscando último deployment...\n');
  
  const deployment = await getLatestDeployment();
  if (!deployment) {
    console.error('❌ Nenhum deployment encontrado');
    process.exit(1);
  }

  console.log(`📦 Deployment: ${deployment.url}`);
  console.log(`🆔 ID: ${deployment.uid}`);
  console.log(`📅 Criado: ${new Date(deployment.created).toLocaleString('pt-BR')}\n`);

  // Monitorar status
  let lastStatus = '';
  let errorShown = false;

  while (true) {
    const status = await checkDeploymentStatus(deployment.uid);
    
    if (status.readyState !== lastStatus) {
      lastStatus = status.readyState;
      console.log(`📊 Status: ${status.readyState}`);
    }

    if (status.readyState === 'READY') {
      console.log('\n✅ Deploy concluído com sucesso!');
      console.log(`🌐 URL: https://${deployment.url}`);
      
      // Salvar URL para fácil acesso
      fs.writeFileSync('.last-deploy-url', `https://${deployment.url}`);
      
      process.exit(0);
    }
    
    if (status.readyState === 'ERROR' || status.readyState === 'CANCELED') {
      console.error(`\n❌ Deploy ${status.readyState === 'ERROR' ? 'falhou' : 'cancelado'}!\n`);
      
      // Buscar logs de erro
      if (!errorShown) {
        errorShown = true;
        console.log('📋 Buscando logs de erro...\n');
        
        const logs = await getBuildLogs(deployment.uid);
        if (logs && logs.length > 0) {
          // Filtrar apenas erros
          const errors = logs.filter(log => 
            log.type === 'error' || 
            log.type === 'stderr' ||
            (log.text && log.text.includes('error'))
          );
          
          if (errors.length > 0) {
            console.log('🔴 Erros encontrados:\n');
            errors.forEach(error => {
              console.log(`  ${error.text || error.message || JSON.stringify(error)}`);
            });
          }
        }
        
        // Salvar logs para análise
        const logFile = `deploy-error-${deployment.uid}.log`;
        fs.writeFileSync(logFile, JSON.stringify(status, null, 2));
        console.log(`\n💾 Logs completos salvos em: ${logFile}`);
        console.log(`\n🔗 Ver no Vercel: https://vercel.com/${TEAM_ID || 'dashboard'}/${PROJECT_NAME}/${deployment.uid}`);
      }
      
      process.exit(1);
    }

    // Aguardar antes de verificar novamente
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

// Executar
main().catch(error => {
  console.error('❌ Erro:', error.message || error);
  process.exit(1);
});