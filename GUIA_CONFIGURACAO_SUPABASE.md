# Guia de Configuração do Supabase - Rio Porto P2P

## 📋 Pré-requisitos
- Conta no GitHub (para fazer login no Supabase)
- Acesso ao painel do Vercel para adicionar variáveis de ambiente

## 🚀 Passo a Passo

### 1. Criar Conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com sua conta GitHub
4. Confirme seu email se necessário

### 2. Criar Novo Projeto

1. Clique em "New project"
2. Preencha os campos:
   - **Organization**: Selecione ou crie uma nova
   - **Project name**: `rioportop2p` (ou outro nome de sua preferência)
   - **Database Password**: Gere uma senha forte e **SALVE EM LOCAL SEGURO**
   - **Region**: Escolha `South America (São Paulo)` para melhor latência
   - **Pricing Plan**: Free tier é suficiente para começar

3. Clique em "Create new project" e aguarde a criação (pode levar alguns minutos)

### 3. Configurar o Banco de Dados

1. No painel do Supabase, vá para **SQL Editor** (ícone de banco de dados na barra lateral)
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `src/lib/database.schema.sql` do projeto
4. Cole no editor SQL
5. Clique em "Run" para executar o script
6. Verifique se todas as tabelas foram criadas sem erros

### 4. Obter as Credenciais

1. No painel do Supabase, vá para **Settings** → **API**
2. Você encontrará as seguintes informações:

```
Project URL: https://[seu-projeto].supabase.co
Anon public key: eyJ... (chave longa)
Service role key: eyJ... (chave longa - MANTENHA SECRETA!)
```

3. Anote estas informações, você precisará delas no próximo passo

### 5. Configurar Variáveis de Ambiente no Vercel

1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione o projeto `rioportop2p-app`
3. Vá para **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

```bash
NEXT_PUBLIC_SUPABASE_URL=[Project URL do passo anterior]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Anon public key do passo anterior]
SUPABASE_SERVICE_ROLE_KEY=[Service role key do passo anterior]
DATABASE_URL=[Connection string - veja abaixo]
```

Para obter a `DATABASE_URL`:
1. No Supabase, vá para **Settings** → **Database**
2. Copie a "Connection string" na seção "Connection Pooling"
3. Substitua `[YOUR-PASSWORD]` pela senha que você criou no passo 2

### 6. Configurar Autenticação no Supabase

1. No painel do Supabase, vá para **Authentication** → **Providers**
2. Habilite **Email** como provider
3. Configure as seguintes opções:
   - Enable Email Confirmations: ON
   - Enable Email Change Confirmations: ON
   - Secure Email Change: ON

4. Vá para **Authentication** → **Email Templates**
5. Personalize os templates de email conforme necessário

### 7. Configurar Políticas de Segurança (RLS)

As políticas já foram criadas pelo script SQL, mas você pode verificar:

1. Vá para **Table Editor**
2. Para cada tabela, clique no ícone de cadeado
3. Verifique se RLS está habilitado (deve estar verde)
4. Revise as políticas criadas

### 8. Testar Localmente

1. Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://...
```

2. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Teste a conexão acessando a aplicação e tentando fazer login/cadastro

### 9. Deploy com as Novas Variáveis

1. Após adicionar todas as variáveis no Vercel, faça um novo deploy:
```bash
git add .
git commit -m "Add Supabase configuration"
git push origin main
```

2. O Vercel automaticamente fará o deploy com as novas variáveis

### 10. Verificar Funcionamento

1. Acesse sua aplicação em produção
2. Teste as seguintes funcionalidades:
   - Cadastro de novo usuário
   - Login
   - Visualização de perfil
   - Criação de transação (se disponível)

## 🔍 Troubleshooting

### Erro de Conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo (não pausado)
- Verifique se o RLS está configurado corretamente

### Erro de Autenticação
- Confirme que o provider Email está habilitado
- Verifique os logs no Supabase Dashboard → Logs → Auth

### Erro no Schema
- Re-execute o script SQL
- Verifique se não há erros de sintaxe
- Confirme que a extensão uuid-ossp foi criada

## 📊 Monitoramento

1. Use o **Supabase Dashboard** para monitorar:
   - Uso de banco de dados
   - Logs de autenticação
   - Performance das queries

2. Configure alertas no Vercel para:
   - Erros de build
   - Falhas de deploy
   - Erros de runtime

## 🎉 Próximos Passos

Após configurar o Supabase com sucesso:

1. **Popular dados iniciais**: Crie alguns usuários e dados de teste
2. **Configurar Stack Auth**: Para complementar a autenticação
3. **Configurar Resend**: Para envio de emails transacionais
4. **Testar fluxo completo**: Do cadastro até uma transação

## 📞 Suporte

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Status Supabase](https://status.supabase.com)