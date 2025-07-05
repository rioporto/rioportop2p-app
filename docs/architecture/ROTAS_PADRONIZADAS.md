# Rotas Padronizadas - RioPorto P2P

## Visão Geral

Este documento lista todas as rotas padronizadas da aplicação RioPorto P2P e seus respectivos redirects configurados.

## Páginas Principais

### Páginas Públicas
- `/` - Home
- `/sobre` - Página Sobre Nós
- `/cotacao-p2p` - Cotação P2P
- `/otc` - Serviço OTC
- `/blog` - Blog
- `/blog/[slug]` - Post individual do blog
- `/cursos` - Cursos
- `/faq` - Perguntas Frequentes
- `/contato` - Página de Contato
- `/politica-de-privacidade` - Política de Privacidade
- `/termos-de-uso` - Termos de Uso

### Autenticação
- `/login` - Página de Login
- `/signup` - Página de Cadastro
- `/verify-email` - Verificação de Email
- `/auth/callback` - Callback de Autenticação
- `/auth/2fa/verify` - Verificação 2FA

### Área do Usuário
- `/dashboard` - Dashboard do Usuário
- `/dashboard/transactions` - Transações
- `/dashboard/security` - Configurações de Segurança
- `/dashboard/pix-settings` - Configurações PIX
- `/notifications` - Notificações
- `/kyc` - KYC (Know Your Customer)
- `/kyc/verify` - Verificação KYC
- `/orders` - Ordens
- `/transactions` - Transações
- `/transactions/[id]` - Detalhes da Transação

### Área Administrativa
- `/admin` - Dashboard Admin
- `/admin/usuarios` - Gestão de Usuários
- `/admin/usuarios/kyc` - KYC de Usuários
- `/admin/transacoes` - Gestão de Transações
- `/admin/blog` - Gestão do Blog
- `/admin/cursos` - Gestão de Cursos
- `/admin/cotacoes` - Gestão de Cotações
- `/admin/faq` - Gestão de FAQ
- `/admin/pix-keys` - Gestão de Chaves PIX

## Redirects Configurados

### Redirects de URLs Antigas
- `/home` → `/`
- `/index` → `/`
- `/index.html` → `/`

### Redirects de Idioma/Nomenclatura
- `/register` → `/signup`
- `/about` → `/sobre`
- `/contact` → `/contato`
- `/privacy` → `/politica-de-privacidade`
- `/terms` → `/termos-de-uso`

### Redirects de Variações
- `/profile` → `/dashboard`
- `/perfil` → `/dashboard`
- `/test-contact-form` → `/contato`
- `/blog/post/:slug` → `/blog/:slug`
- `/posts/:slug` → `/blog/:slug`

### Redirects de URLs Alternativas
- `/p2p` → `/cotacao-p2p`
- `/cotacao` → `/cotacao-p2p`
- `/cotacoes` → `/cotacao-p2p`
- `/curso` → `/cursos`
- `/course` → `/cursos`
- `/courses` → `/cursos`
- `/politica-privacidade` → `/politica-de-privacidade`
- `/termos` → `/termos-de-uso`
- `/termos-uso` → `/termos-de-uso`
- `/cadastro` → `/signup`
- `/cadastrar` → `/signup`
- `/entrar` → `/login`
- `/signin` → `/login`
- `/minha-conta` → `/dashboard`
- `/my-account` → `/dashboard`
- `/painel` → `/dashboard`

### Redirects Administrativos
- `/admin/blog/create` → `/admin/blog`
- `/admin/blog/edit/:id` → `/admin/blog`

## APIs Padronizadas

### Rewrites de API
- `/api/quote` → `/api/cotacao`
- `/api/quotation` → `/api/cotacao`
- `/api/user/profile` → `/api/users/profile`
- `/api/user/kyc` → `/api/users/kyc`

### Arquivos Especiais
- `/sitemap.xml` → `/api/sitemap`
- `/robots.txt` → `/api/robots`

## Rotas de API Disponíveis

### Autenticação
- `/api/auth/signin`
- `/api/auth/signout`
- `/api/auth/signup`
- `/api/auth/callback`
- `/api/auth/2fa/setup`
- `/api/auth/2fa/verify`
- `/api/auth/2fa/disable`
- `/api/auth/2fa/backup-codes`
- `/api/auth/2fa/complete-login`

### Dados e Serviços
- `/api/blog` - CRUD de posts do blog
- `/api/contact` - Envio de mensagens de contato
- `/api/cotacao` - Cotações de criptomoedas
- `/api/courses` - CRUD de cursos
- `/api/crypto-list` - Lista de criptomoedas
- `/api/crypto-prices` - Preços de criptomoedas
- `/api/dashboard/stats` - Estatísticas do dashboard
- `/api/dashboard/transactions` - Transações do usuário
- `/api/enrollments` - Inscrições em cursos
- `/api/faqs` - CRUD de FAQs
- `/api/kyc/upload` - Upload de documentos KYC
- `/api/kyc/notify` - Notificações KYC
- `/api/notifications` - Sistema de notificações
- `/api/orders` - Gestão de ordens
- `/api/pix/create-payment` - Criação de pagamento PIX
- `/api/transactions` - Gestão de transações
- `/api/users/profile` - Perfil do usuário
- `/api/users/kyc` - Status KYC do usuário
- `/api/webhooks/pix` - Webhook para PIX

### Utilitários
- `/api/og` - Geração de imagem OG
- `/api/seo-config` - Configurações SEO
- `/api/system-check` - Verificação do sistema
- `/api/test-email` - Teste de envio de email
- `/api/test-supabase` - Teste de conexão Supabase
- `/api/test-tables` - Teste de tabelas do banco

## Observações

1. Todos os redirects permanentes (301) são usados para URLs antigas que não devem mais ser usadas
2. Redirects temporários (302) são usados para páginas que podem mudar no futuro
3. As rotas de API seguem o padrão RESTful quando possível
4. Páginas de teste estão redirecionadas para suas contrapartes em produção
5. URLs em português são priorizadas para melhor SEO local