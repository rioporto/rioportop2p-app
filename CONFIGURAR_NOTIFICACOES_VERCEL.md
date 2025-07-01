# Configurar Notificações Automáticas do Vercel

## Opções Disponíveis

### 1. **Webhooks do Vercel** (Recomendado)
O Vercel pode enviar notificações automáticas quando um deploy falha ou é bem-sucedido.

#### Como configurar:
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** → **Webhooks**
3. Clique em **Create Webhook**
4. Configure:
   - **URL**: Endpoint que receberá as notificações
   - **Events**: Selecione `deployment.failed` e `deployment.succeeded`
   - **Projects**: Selecione `rioportop2p-app`

### 2. **GitHub Actions**
Adicionar uma action que monitora o status dos deploys:

```yaml
# .github/workflows/vercel-deploy-status.yml
name: Monitor Vercel Deploy
on:
  push:
    branches: [main]

jobs:
  check-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Wait for Vercel Deploy
        uses: patrickedqvist/wait-for-vercel-preview@v1.3.1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          max_timeout: 600
      
      - name: Notify on Failure
        if: failure()
        run: |
          echo "Deploy failed!"
          # Adicionar notificação aqui
```

### 3. **Vercel CLI com Script de Monitoramento**
Criar um script que verifica o status periodicamente:

```bash
# monitor-deploy.sh
#!/bin/bash

# Instalar Vercel CLI globalmente se não tiver
# npm i -g vercel

# Pegar o último deployment
LAST_DEPLOY=$(vercel list --json | jq -r '.[0]')
STATUS=$(echo $LAST_DEPLOY | jq -r '.state')

if [ "$STATUS" = "ERROR" ] || [ "$STATUS" = "FAILED" ]; then
  echo "Deploy failed!"
  # Enviar notificação
fi
```

### 4. **Integração com Slack/Discord**
O Vercel tem integrações nativas:

1. **Slack**: 
   - Vá em Vercel → Settings → Integrations
   - Adicione Slack
   - Configure o canal para receber notificações

2. **Discord**:
   - Use webhooks do Discord
   - Configure no Vercel Webhooks

### 5. **API do Vercel**
Usar a API para verificar status programaticamente:

```javascript
// check-vercel-status.js
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = 'rioportop2p-app';

async function checkDeployStatus() {
  const response = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=1`,
    {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`
      }
    }
  );
  
  const data = await response.json();
  const latestDeploy = data.deployments[0];
  
  if (latestDeploy.state === 'ERROR' || latestDeploy.state === 'FAILED') {
    console.log('Deploy failed!', latestDeploy);
    // Notificar sobre o erro
  }
}
```

### 6. **Configurar no arquivo vercel.json**
Adicionar configurações de build e notificações:

```json
{
  "github": {
    "silent": false,
    "autoJobCancelation": true
  },
  "functions": {
    "api/webhook-deploy.ts": {
      "maxDuration": 10
    }
  }
}
```

## Recomendação para Claude Code

A melhor opção seria:

1. **Configurar Webhook** no Vercel que aponta para um endpoint seu
2. **Criar uma Cloud Function** ou **GitHub Action** que:
   - Recebe as notificações do Vercel
   - Salva o status em um arquivo no repositório
   - Faz commit automático quando há erro

Assim, eu poderia verificar o arquivo de status periodicamente ou você poderia me informar quando houver updates.

## Implementação Simples com GitHub Actions

```yaml
# .github/workflows/track-deploy-status.yml
name: Track Deploy Status

on:
  workflow_dispatch:
  schedule:
    - cron: '*/5 * * * *' # A cada 5 minutos

jobs:
  check-vercel:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check Vercel Deploy Status
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          # Pegar último deploy
          DEPLOY_STATUS=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
            "https://api.vercel.com/v6/deployments?projectId=rioportop2p-app&limit=1" \
            | jq -r '.deployments[0].state')
          
          # Salvar em arquivo
          echo "$DEPLOY_STATUS" > .vercel-status
          echo "$(date): $DEPLOY_STATUS" >> .vercel-history.log
      
      - name: Commit Status
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .vercel-status .vercel-history.log
          git commit -m "Update Vercel deploy status" || exit 0
          git push
```

## Próximos Passos

1. Escolha o método preferido
2. Configure as credenciais necessárias
3. Teste a integração
4. Me avise qual método escolheu para eu poder monitorar

Com qualquer uma dessas opções, eu poderei saber o status dos deploys sem precisar perguntar!