# Guia de Deploy - Rio Porto P2P

## 📋 Status Atual
- ✅ Projeto inicializado com Git
- ✅ Primeiro commit realizado
- ✅ Configuração do Vercel preparada
- ⏳ Aguardando criação do repositório no GitHub
- ⏳ Aguardando conexão com Vercel

## 🚀 Próximos Passos

### 1. Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome do repositório: `rioportop2p-app`
3. Descrição: "Plataforma P2P para compra e venda de Bitcoin - Rio Porto Mediação LTDA"
4. Deixe como **Privado** (recomendado) ou Público
5. **NÃO** inicialize com README, .gitignore ou licença
6. Clique em "Create repository"

### 2. Conectar ao GitHub

Após criar o repositório, execute estes comandos no terminal:

```bash
git remote add origin https://github.com/SEU_USUARIO/rioportop2p-app.git
git push -u origin main
```

### 3. Deploy no Vercel

#### Opção A: Via Interface Web (Recomendado)
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Importe o repositório `rioportop2p-app`
5. As configurações já estão prontas no `vercel.json`
6. Clique em "Deploy"

#### Opção B: Via CLI
```bash
npm i -g vercel
vercel login
vercel
```

### 4. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel, vá em Settings > Environment Variables e adicione:

```
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 🔄 Deploy Automático

Após a configuração inicial:
- Cada `git push` para a branch `main` fará deploy automático
- Preview deployments para outras branches
- Rollback fácil pelo painel do Vercel

## 📱 URLs do Projeto

Após o deploy, você terá:
- URL de produção: `rioportop2p-app.vercel.app`
- URL customizada: Configure um domínio personalizado nas configurações

## 🛠️ Comandos Úteis

```bash
# Ver status do Git
git status

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "sua mensagem"

# Enviar para GitHub
git push

# Build local para teste
npm run build

# Preview do build
npm run preview
```

## ⚠️ Importante

- O arquivo `.env` NÃO é enviado para o GitHub (está no .gitignore)
- Configure TODAS as variáveis de ambiente no Vercel
- Use `.env.example` como referência