#!/usr/bin/env node

/**
 * Script para verificar o status do deploy no Vercel
 * Usa a API do Vercel para buscar o status do último deployment
 */

const https = require('https');
const path = require('path');

// Carregar variáveis de ambiente do .env.local
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
} catch (e) {
  // Se dotenv não estiver instalado, continuar sem ele
}

// Configurações
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'rioportop2p-app';
const TEAM_ID = process.env.VERCEL_TEAM_ID;
const MAX_WAIT_TIME = 5 * 60 * 1000; // 5 minutos
const CHECK_INTERVAL = 10 * 1000; // 10 segundos

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN não encontrado nas variáveis de ambiente');
  process.exit(1);
}

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

async function getLatestDeployment() {
  const teamQuery = TEAM_ID ? `&teamId=${TEAM_ID}` : '';
  const path = `/v6/deployments?projectId=${PROJECT_ID}&limit=1${teamQuery}`;
  
  try {
    const response = await makeRequest(path);
    if (response.deployments && response.deployments.length > 0) {
      return response.deployments[0];
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar deployments:', error);
    return null;
  }
}

async function checkDeploymentStatus(deploymentId) {
  const teamQuery = TEAM_ID ? `?teamId=${TEAM_ID}` : '';
  const path = `/v13/deployments/${deploymentId}${teamQuery}`;
  
  try {
    const deployment = await makeRequest(path);
    return deployment;
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return null;
  }
}

async function waitForDeployment() {
  console.log('🔍 Buscando último deployment...');
  
  const latestDeployment = await getLatestDeployment();
  if (!latestDeployment) {
    console.error('❌ Nenhum deployment encontrado');
    process.exit(1);
  }

  console.log(`📦 Deployment encontrado: ${latestDeployment.url}`);
  console.log(`🆔 ID: ${latestDeployment.uid}`);
  console.log(`📅 Criado: ${new Date(latestDeployment.created).toLocaleString('pt-BR')}`);

  const startTime = Date.now();
  let lastStatus = '';

  while (Date.now() - startTime < MAX_WAIT_TIME) {
    const deployment = await checkDeploymentStatus(latestDeployment.uid);
    
    if (!deployment) {
      console.error('❌ Erro ao verificar status do deployment');
      process.exit(1);
    }

    if (deployment.readyState !== lastStatus) {
      lastStatus = deployment.readyState;
      console.log(`📊 Status: ${deployment.readyState}`);
    }

    // Estados possíveis: QUEUED, BUILDING, READY, ERROR, CANCELED
    switch (deployment.readyState) {
      case 'READY':
        console.log('✅ Deploy concluído com sucesso!');
        console.log(`🌐 URL: https://${deployment.url}`);
        
        // Verificar se há erros de build
        if (deployment.builds && deployment.builds.length > 0) {
          const build = deployment.builds[0];
          if (build.error) {
            console.error('⚠️  Erro durante o build:');
            console.error(build.error);
          }
        }
        
        process.exit(0);
        break;
        
      case 'ERROR':
        console.error('❌ Deploy falhou!');
        if (deployment.error) {
          console.error('Erro:', deployment.error);
        }
        
        // Buscar logs de build se disponível
        if (deployment.builds && deployment.builds.length > 0) {
          console.log('\n📋 Logs do build:');
          for (const build of deployment.builds) {
            if (build.error) {
              console.error(build.error);
            }
          }
        }
        
        process.exit(1);
        break;
        
      case 'CANCELED':
        console.error('⚠️  Deploy cancelado');
        process.exit(1);
        break;
    }

    // Aguardar antes de verificar novamente
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }

  console.error('⏰ Timeout: Deploy demorou mais que o esperado');
  process.exit(1);
}

// Executar
waitForDeployment().catch(error => {
  console.error('❌ Erro inesperado:', error);
  process.exit(1);
});