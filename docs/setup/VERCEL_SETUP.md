# Configuração Rápida do Vercel Token

## Passo 1: Configurar o Token

Execute este comando e siga as instruções:

```bash
node scripts/setup-vercel-token.js
```

O script vai:
1. Pedir seu token do Vercel
2. Perguntar se você usa Teams
3. Salvar tudo em `.env.local` (ignorado pelo git)
4. Criar scripts auxiliares

## Passo 2: Carregar as Variáveis

Depois de configurar, carregue as variáveis:

```bash
source scripts/load-env.sh
```

## Passo 3: Usar o Sistema

### Opção A: Deploy Completo
```bash
./scripts/deploy-and-check.sh "sua mensagem de commit"
```

### Opção B: Só Push e Verificar
```bash
git add .
git commit -m "sua mensagem"
node scripts/vercel-deploy.js push
```

### Opção C: Só Verificar Último Deploy
```bash
node scripts/vercel-deploy.js
```

## Comandos Úteis

- **Ver último deploy**: `cat .last-deploy-url`
- **Ver logs de erro**: `ls deploy-error-*.log`
- **Reconfigurar token**: `node scripts/setup-vercel-token.js`

## Segurança

✅ O arquivo `.env.local` está no `.gitignore`
✅ O token nunca será commitado
✅ Só você tem acesso ao token no seu computador

## Problemas Comuns

**"VERCEL_TOKEN não encontrado"**
- Execute: `source scripts/load-env.sh`

**"Token inválido"**
- Tokens do Vercel começam com `vusr_`
- Crie um novo em: https://vercel.com/account/tokens

**"Projeto não encontrado"**
- Verifique se o nome do projeto está correto
- Confirme se você tem acesso ao projeto