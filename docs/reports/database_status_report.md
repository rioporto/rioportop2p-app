# Relatório de Status do Banco de Dados Supabase

## Informações de Conexão
- **URL do Banco**: `postgresql://postgres:Dat15975310***@db.wqrbyxgmpjvhmzgchjbb.supabase.co:5432/postgres`
- **Projeto Supabase**: wqrbyxgmpjvhmzgchjbb
- **Dashboard**: https://app.supabase.com/project/wqrbyxgmpjvhmzgchjbb

## Status da Verificação
⚠️ **Não foi possível conectar diretamente ao banco de dados devido a restrições de rede neste ambiente.**

## Tabelas que DEVEM Estar Criadas

### 1. ✅ notifications
- **Arquivo de Migration**: `/supabase/migrations/create_notifications_table.sql`
- **Descrição**: Gerenciamento de notificações do sistema
- **Campos principais**:
  - id (UUID)
  - user_id (UUID) - referência para auth.users
  - type (TEXT) - tipos: transaction, kyc, course, system, p2p_trade, price_alert
  - title, message (TEXT)
  - read (BOOLEAN)
  - metadata (JSONB)
  - created_at, updated_at (TIMESTAMPTZ)

### 2. ✅ two_factor_auth
- **Arquivo de Migration**: `/supabase/migrations/008_two_factor_auth.sql`
- **Descrição**: Autenticação de dois fatores
- **Campos principais**:
  - id (UUID)
  - user_id (UUID) - referência para auth.users
  - secret (TEXT)
  - enabled, verified (BOOLEAN)
  - backup_codes_generated (BOOLEAN)
  - created_at, updated_at (TIMESTAMPTZ)
- **Tabela relacionada**: backup_codes (para códigos de recuperação)

### 3. ✅ pix_keys
- **Arquivo de Migration**: `/supabase/migrations/006_pix_payment_system.sql`
- **Descrição**: Armazenamento de chaves PIX dos usuários
- **Campos principais**:
  - id (UUID)
  - user_id (UUID)
  - key_type (TEXT) - tipos: cpf, cnpj, email, phone, random
  - key_value (TEXT)
  - bank_name (TEXT)
  - account_holder_name, account_holder_document (TEXT)
  - is_active, is_verified (BOOLEAN)
- **Tabelas relacionadas**: 
  - pix_payment_details
  - pix_webhooks

### 4. ✅ crypto_prices
- **Arquivo de Migration**: `/supabase/migrations/20250103_create_crypto_prices_table.sql`
- **Descrição**: Dados de preços de criptomoedas
- **Campos principais**:
  - id (UUID)
  - symbol (VARCHAR)
  - price_brl, price_usd (DECIMAL)
  - percent_change_24h, percent_change_7d (DECIMAL)
  - volume_24h, market_cap (DECIMAL)
  - source (VARCHAR)
- **View criada**: latest_crypto_prices (preços mais recentes)

### 5. ✅ contact_messages
- **Arquivo de Migration**: `/supabase/migrations/20250104_create_contact_messages_table.sql`
- **Descrição**: Mensagens de contato do site
- **Campos principais**:
  - id (UUID)
  - name, email, phone (TEXT)
  - subject, message (TEXT)
  - type (TEXT) - tipos: general, support, partnership, complaint
  - status (TEXT) - estados: new, read, replied, archived
  - ip_address, user_agent (TEXT)

## Outras Tabelas do Sistema

Com base na análise dos arquivos de migration, o sistema também deve ter:

1. **users** - Tabela principal de usuários
2. **transactions** - Transações P2P
3. **p2p_offers** - Ofertas de compra/venda P2P
4. **wallets** - Carteiras de criptomoedas
5. **kyc_documents** - Documentos KYC
6. **courses** - Cursos educacionais
7. **blog_posts** - Posts do blog
8. **cryptocurrencies** - Lista de criptomoedas suportadas

## Scripts de Execução Disponíveis

1. **execute_missing_migrations.sql** - Script SQL completo para criar todas as tabelas faltantes
2. **execute-migrations.js** - Scripts Node.js para executar migrations programaticamente
3. Múltiplos arquivos SQL na pasta `/supabase/` para correções e ajustes

## Ações Recomendadas

1. **Verificação Manual no Dashboard Supabase**:
   - Acesse https://app.supabase.com/project/wqrbyxgmpjvhmzgchjbb
   - Vá para "Table Editor" ou "SQL Editor"
   - Execute: `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`

2. **Executar Migrations Faltantes**:
   - Use o arquivo `/execute_missing_migrations.sql` no SQL Editor do Supabase
   - Ou execute os scripts individuais na pasta `/supabase/migrations/`

3. **Verificar Logs de Erros**:
   - Verifique se há erros nas execuções anteriores
   - Confirme que todas as dependências (tabelas relacionadas) existem

4. **Testar Conectividade**:
   - Use ferramentas como pgAdmin, DBeaver ou TablePlus
   - Ou teste a conexão através da aplicação Next.js

## Total Esperado de Tabelas
Com base nos arquivos de migration analisados, o sistema deve ter aproximadamente **15-20 tabelas** no schema public, incluindo as 5 tabelas específicas mencionadas.