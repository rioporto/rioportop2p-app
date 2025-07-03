# Instruções para Configurar o Supabase

## 1. Criar o Projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Crie um novo projeto com o nome "rioportop2p"
3. Anote as credenciais:
   - Project URL
   - Anon Key
   - Service Role Key

## 2. Executar as Migrations

### Opção A: Via Dashboard do Supabase
1. No painel do Supabase, vá para "SQL Editor"
2. Cole o conteúdo do arquivo `supabase/migrations/001_initial_schema.sql`
3. Execute o SQL

### Opção B: Via Supabase CLI
```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login

# Linkar o projeto
supabase link --project-ref YOUR_PROJECT_REF

# Executar migrations
supabase db push
```

## 3. Configurar Storage Buckets

No dashboard do Supabase, vá para "Storage" e crie os seguintes buckets:

1. **kyc-documents** (privado)
   - Para documentos de verificação KYC
   - Políticas: Apenas o próprio usuário e admins

2. **payment-proofs** (privado)
   - Para comprovantes de pagamento
   - Políticas: Apenas usuários da transação e admins

3. **avatars** (público)
   - Para fotos de perfil
   - Políticas: Leitura pública, escrita autenticada

4. **crypto-logos** (público)
   - Para logos das criptomoedas
   - Políticas: Leitura pública

## 4. Configurar Authentication

1. Em "Authentication" > "Providers":
   - Habilitar Email/Password
   - Configurar templates de email em português

2. Em "Authentication" > "Email Templates":
   - Personalizar os templates para a marca Rio Porto P2P

## 5. Configurar as Variáveis de Ambiente

Atualize o arquivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_key_aqui

# Database URL (para migrations locais)
DATABASE_URL=sua_database_url_aqui
```

## 6. Configurar Realtime

Para chat e notificações em tempo real:

1. No dashboard, vá para "Database" > "Replication"
2. Habilite replication para as tabelas:
   - `chat_messages`
   - `notifications`
   - `transactions` (apenas status updates)

## 7. Configurar Edge Functions (opcional)

Para processamento assíncrono:

```sql
-- Criar edge functions para:
-- 1. Processar verificação KYC automática
-- 2. Enviar notificações
-- 3. Atualizar preços de criptomoedas
```

## 8. Seed Data (Dados de Teste)

Execute após criar as tabelas:

```sql
-- Inserir usuário admin de teste
INSERT INTO auth.users (id, email) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@rioportop2p.com');

INSERT INTO users_profile (id, email, full_name, role) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@rioportop2p.com', 'Admin Rio Porto', 'admin');

-- Inserir algumas ordens de teste
-- Inserir transações de exemplo
```

## 9. Verificar a Instalação

1. Teste a conexão no projeto:
   ```bash
   npm run dev
   ```

2. Acesse `/api/test-supabase` para verificar a conexão

## 10. Backup e Segurança

1. Configure backups automáticos no Supabase
2. Habilite 2FA para a conta do Supabase
3. Restrinja as chaves de API apenas aos domínios necessários