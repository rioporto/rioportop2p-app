# Sistema de Verificação de Deploy

Este sistema permite fazer commit, push e verificar automaticamente se o deploy no Vercel foi bem-sucedido.

## Configuração

### 1. Obter Token do Vercel

1. Acesse: https://vercel.com/account/tokens
2. Clique em "Create Token"
3. Dê um nome (ex: "rioportop2p-deploy-check")
4. Copie o token gerado

### 2. Configurar Variáveis de Ambiente

```bash
# Adicione ao seu ~/.bashrc ou ~/.zshrc
export VERCEL_TOKEN="seu-token-aqui"
export VERCEL_TEAM_ID="seu-team-id" # Opcional, se usar Vercel Teams
```

### 3. Recarregar o terminal

```bash
source ~/.bashrc
# ou
source ~/.zshrc
```

## Uso

### Método 1: Script Completo (Recomendado)

```bash
# Com mensagem de commit personalizada
./scripts/deploy-and-check.sh "feat: adicionar nova funcionalidade"

# Com mensagem padrão
./scripts/deploy-and-check.sh
```

### Método 2: Verificar Deploy Manualmente

```bash
# Após fazer git push manualmente
node scripts/check-deploy.js
```

## Funcionalidades

### deploy-and-check.sh
- ✅ Adiciona todos os arquivos modificados
- ✅ Cria commit com mensagem formatada
- ✅ Faz push para o GitHub
- ✅ Aguarda e verifica o status do deploy
- ✅ Mostra logs de erro se o deploy falhar
- ✅ Saída colorida para melhor visualização

### check-deploy.js
- 🔍 Busca o último deployment do projeto
- 📊 Monitora o status em tempo real
- ⏱️ Timeout configurável (padrão: 5 minutos)
- 📋 Exibe logs de erro se houver falha
- 🌐 Mostra a URL do deploy quando concluído

## Estados do Deploy

- **QUEUED**: Deploy na fila
- **BUILDING**: Construindo a aplicação
- **READY**: Deploy concluído com sucesso ✅
- **ERROR**: Falha no deploy ❌
- **CANCELED**: Deploy cancelado ⚠️

## Troubleshooting

### Token não funcionando
```bash
# Verificar se o token está configurado
echo $VERCEL_TOKEN

# Testar o token
curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/www/user
```

### Deploy não encontrado
- Aguarde alguns segundos após o push
- Verifique se o projeto está correto no Vercel
- Confirme que o GitHub está conectado ao Vercel

### Timeout no deploy
- Deployments grandes podem demorar mais
- Ajuste MAX_WAIT_TIME em check-deploy.js se necessário

## Integração com Git Hooks (Opcional)

Para verificar automaticamente após cada push:

```bash
# Criar hook post-push
cat > .git/hooks/post-push << 'EOF'
#!/bin/bash
echo "Verificando deploy no Vercel..."
node scripts/check-deploy.js
EOF

chmod +x .git/hooks/post-push
```

## Exemplo de Saída

```
[14:32:10] Iniciando processo de deploy...
[14:32:10] Adicionando arquivos...
[14:32:10] Criando commit: feat: melhorar sistema de autenticação
[14:32:11] Enviando para GitHub...
[14:32:13] ✅ Push realizado com sucesso!
[14:32:13] Aguardando Vercel detectar o push...
[14:32:18] Verificando status do deploy no Vercel...
🔍 Buscando último deployment...
📦 Deployment encontrado: rioportop2p-app-xyz123.vercel.app
🆔 ID: dpl_ABC123XYZ
📅 Criado: 25/12/2024 14:32:15
📊 Status: BUILDING
📊 Status: READY
✅ Deploy concluído com sucesso!
🌐 URL: https://rioportop2p-app.vercel.app
[14:33:45] ✅ Deploy concluído com sucesso! 🎉
```