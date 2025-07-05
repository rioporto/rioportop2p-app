# Rio Porto P2P - Plataforma de Trading P2P de Criptomoedas

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)
![WCAG 2.1](https://img.shields.io/badge/WCAG-2.1%20AA-blue)

## 🚀 Sobre o Projeto

Rio Porto P2P é uma plataforma moderna e segura para trading peer-to-peer de criptomoedas no Brasil. Desenvolvida com as mais recentes tecnologias, oferece uma experiência completa com sistema de escrow seguro, validação de documentos brasileiros, acessibilidade WCAG 2.1 e um sistema educacional integrado para capacitar novos usuários no mundo das criptomoedas.

## ✨ Principais Funcionalidades

### 🔒 Sistema P2P Seguro com Escrow
- **Escrow Automatizado**: Sistema de custódia que garante segurança nas transações
- **Smart Contracts**: Contratos inteligentes para liberação automática de fundos
- **Sistema de Disputas**: Resolução de conflitos com mediação integrada
- **Proteção Anti-fraude**: Múltiplas camadas de segurança para prevenir golpes
- **Histórico Completo**: Rastreamento detalhado de todas as transações

### 🆔 Validação de Documentos Brasileiros
- **Validação de CPF/CNPJ**: Algoritmos completos de validação em tempo real
- **Verificação KYC**: Sistema multi-nível com upload e verificação de documentos
- **Integração com APIs Oficiais**: Validação contra bases de dados governamentais
- **Detecção de Documentos Falsos**: IA para identificar tentativas de fraude
- **Compliance Regulatório**: Aderência às normas brasileiras de prevenção à lavagem de dinheiro

### ♿ Acessibilidade WCAG 2.1
- **Navegação por Teclado**: Interface totalmente navegável sem mouse
- **Suporte a Leitores de Tela**: Compatibilidade com JAWS, NVDA e VoiceOver
- **Alto Contraste**: Modo de alto contraste para usuários com baixa visão
- **Tamanhos Ajustáveis**: Fontes e elementos redimensionáveis
- **Indicadores Visuais**: Feedback claro para todas as ações do usuário
- **Testes Automatizados**: Suite completa de testes de acessibilidade

### 🎓 Sistema Educacional Completo
- **Academia de Criptomoedas**: Cursos estruturados do básico ao avançado
- **Certificados**: Emissão de certificados ao completar módulos
- **Gamificação**: Sistema de pontos e conquistas para engajamento
- **Simulador de Trading**: Ambiente seguro para prática sem riscos
- **Conteúdo Atualizado**: Material educativo sempre atualizado com tendências do mercado
- **Suporte Personalizado**: Mentoria e suporte dedicado para novos usuários

### 💎 Interface Moderna e Responsiva
- **Design System Completo**: Componentes reutilizáveis e consistentes
- **Mobile-First**: Experiência otimizada para dispositivos móveis
- **Dark Mode**: Tema escuro completo para conforto visual
- **Animações Suaves**: Transições fluidas e microinterações
- **Performance Otimizada**: Carregamento rápido e navegação instantânea
- **PWA Ready**: Instalável como aplicativo em dispositivos móveis

### 🔐 Segurança e Autenticação
- **Autenticação Multi-fator**: Email/password, Google OAuth, TOTP 2FA
- **Sessões Seguras**: JWT com refresh tokens e HTTP-only cookies
- **Row Level Security**: Segurança em nível de banco de dados com Supabase RLS
- **Criptografia End-to-End**: Comunicações seguras entre usuários
- **Auditoria Completa**: Log detalhado de todas as ações sensíveis

### 💱 Funcionalidades de Trading
- **Trading P2P**: Negociação direta entre usuários com segurança garantida
- **Preços em Tempo Real**: Cotações ao vivo de múltiplas exchanges
- **Integração PIX**: Sistema completo com geração de QR codes
- **Ordens Avançadas**: Limit orders, stop loss e take profit
- **Alertas de Preço**: Notificações personalizáveis por email e push

### 📊 Painel Administrativo
- **Gestão de Usuários**: Administração completa com filtros avançados
- **Dashboard Analytics**: Métricas em tempo real e relatórios detalhados
- **Gestão de Conteúdo**: CMS integrado para blog e cursos
- **Moderação de Disputas**: Sistema de resolução de conflitos
- **Configurações Avançadas**: Controle total sobre parâmetros da plataforma

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js 15**: Framework React com App Router para performance otimizada
- **TypeScript 5.0**: Desenvolvimento type-safe com IntelliSense avançado
- **Tailwind CSS 3.4**: Framework CSS utility-first para estilização rápida
- **Radix UI**: Componentes acessíveis e sem estilo para customização total
- **Lucide React**: Biblioteca de ícones moderna e otimizada
- **Chart.js & Recharts**: Visualizações de dados interativas e responsivas
- **React Hook Form**: Gerenciamento de formulários com validação
- **Zod**: Schema validation para garantir integridade dos dados

### Backend
- **Next.js API Routes**: Endpoints serverless com suporte a middleware
- **Supabase**: PostgreSQL com real-time subscriptions e RLS
- **Stack Auth**: Sistema completo de autenticação e gestão de usuários
- **Prisma ORM**: Type-safe database queries com migrations
- **Node.js 20**: Runtime JavaScript de alta performance
- **Edge Functions**: Funções serverless para operações críticas

### Infraestrutura
- **Vercel**: Deploy automático com preview deployments
- **Cloudflare**: CDN global e proteção DDoS
- **AWS S3**: Armazenamento de arquivos e backups
- **Redis**: Cache distribuído para alta performance
- **Docker**: Containerização para desenvolvimento consistente

### Integrações e APIs
- **Resend**: Emails transacionais com alta entregabilidade
- **SendGrid**: Email marketing e notificações em massa
- **Google Maps API**: Serviços de localização e mapas
- **Google Analytics 4**: Analytics avançado com eventos customizados
- **Sentry**: Monitoramento de erros em tempo real
- **Hotjar**: Heatmaps e gravação de sessões

### Pagamentos e Crypto
- **PIX APIs**: MercadoPago, PagSeguro, Gerencianet
- **Binance API**: Cotações em tempo real e dados de mercado
- **CoinGecko API**: Dados históricos e informações de criptomoedas
- **Web3.js**: Integração com wallets e smart contracts
- **Stripe**: Processamento de pagamentos internacionais

### Ferramentas de Desenvolvimento
- **ESLint & Prettier**: Linting e formatação de código
- **Husky**: Git hooks para qualidade de código
- **Jest & React Testing Library**: Testes unitários e de integração
- **Playwright**: Testes E2E automatizados
- **Storybook**: Documentação de componentes
- **GitHub Actions**: CI/CD automatizado

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 20+ (recomendado via NVM)
- npm 10+ ou yarn 1.22+
- Conta no Supabase
- Conta no Stack Auth
- Conta no Vercel (para deploy)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/rioporto/rioportop2p-app.git
cd rioportop2p-app
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

4. **Edite o arquivo .env.local com suas credenciais**
```bash
# Configuração do Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_servico_supabase

# Configuração do Stack Auth
STACK_AUTH_SECRET_SERVER_KEY=sua_chave_servidor_stack
NEXT_PUBLIC_STACK_PROJECT_ID=seu_id_projeto_stack
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=sua_chave_cliente_stack
NEXT_PUBLIC_STACK_URL=https://api.stack-auth.com

# Configuração de Email (Resend)
RESEND_API_KEY=sua_chave_api_resend

# Serviços Google
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
NEXT_PUBLIC_GA_MEASUREMENT_ID=seu_id_google_analytics

# Configuração Vercel (opcional)
VERCEL_TOKEN=seu_token_vercel
VERCEL_PROJECT_ID=seu_id_projeto_vercel
VERCEL_TEAM_ID=seu_id_time_vercel

# Configuração PIX
MERCADOPAGO_ACCESS_TOKEN=seu_token_mercadopago
PAGSEGURO_TOKEN=seu_token_pagseguro
GERENCIANET_CLIENT_ID=seu_client_id_gerencianet
GERENCIANET_CLIENT_SECRET=seu_client_secret_gerencianet

# Configuração de APIs Crypto
BINANCE_API_KEY=sua_chave_api_binance
COINGECKO_API_KEY=sua_chave_api_coingecko
```

5. **Execute as migrações do banco de dados**
```bash
npx supabase db push
```

6. **Gere os tipos TypeScript do banco**
```bash
npm run db:generate-types
```

7. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

8. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                 # Inicia servidor de desenvolvimento
npm run build              # Build de produção
npm run start              # Inicia servidor de produção
npm run preview            # Preview do build de produção

# Testes
npm run test               # Executa todos os testes
npm run test:unit          # Testes unitários
npm run test:integration   # Testes de integração
npm run test:e2e           # Testes end-to-end
npm run test:watch         # Testes em modo watch
npm run test:coverage      # Relatório de cobertura

# Qualidade de Código
npm run lint               # Verifica linting
npm run lint:fix           # Corrige problemas de linting
npm run format             # Formata código com Prettier
npm run typecheck          # Verifica tipos TypeScript

# Banco de Dados
npm run db:push            # Aplica migrações
npm run db:reset           # Reset do banco
npm run db:seed            # Popula banco com dados de teste
npm run db:generate-types  # Gera tipos TypeScript
npm run db:studio          # Abre Supabase Studio

# Utilitários
npm run analyze            # Analisa bundle size
npm run storybook          # Inicia Storybook
npm run docs               # Gera documentação
```

## 📚 Documentação

- **[Guia de Configuração](./docs/SETUP.md)** - Instruções detalhadas de setup
- **[Guia de Deploy](./docs/DEPLOYMENT.md)** - Deploy em produção
- **[Documentação da API](./API_DOCUMENTATION.md)** - Referência completa da API
- **[Instruções Claude AI](./CLAUDE.md)** - Guia para desenvolvimento com IA
- **[Schema do Banco](./DATABASE_SCHEMA.md)** - Estrutura do banco de dados

## 🏗 Estrutura do Projeto

```
rioportop2p-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Rotas autenticadas
│   │   ├── (public)/          # Rotas públicas
│   │   ├── admin/             # Painel administrativo
│   │   │   ├── users/         # Gestão de usuários
│   │   │   ├── kyc/           # Gestão de KYC
│   │   │   ├── trades/        # Gestão de trades
│   │   │   ├── content/       # CMS
│   │   │   └── settings/      # Configurações
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Endpoints de autenticação
│   │   │   ├── crypto/        # Endpoints de crypto
│   │   │   ├── pix/           # Endpoints PIX
│   │   │   └── webhooks/      # Webhooks externos
│   │   ├── dashboard/         # Dashboard do usuário
│   │   │   ├── trades/        # Minhas negociações
│   │   │   ├── wallet/        # Carteira
│   │   │   ├── kyc/           # Verificação KYC
│   │   │   └── settings/      # Configurações
│   │   └── education/         # Sistema educacional
│   │       ├── courses/       # Cursos
│   │       ├── certificates/  # Certificados
│   │       └── simulator/     # Simulador
│   ├── components/            # Componentes React
│   │   ├── accessibility/     # Componentes de acessibilidade
│   │   ├── admin/             # Componentes admin
│   │   ├── auth/              # Componentes de auth
│   │   ├── crypto/            # Componentes crypto
│   │   ├── education/         # Componentes educacionais
│   │   ├── forms/             # Formulários
│   │   ├── layouts/           # Layouts
│   │   ├── pix/               # Componentes PIX
│   │   └── ui/                # Design system
│   ├── contexts/              # Contextos React
│   │   ├── auth/              # Contexto de autenticação
│   │   ├── theme/             # Contexto de tema
│   │   └── notifications/     # Contexto de notificações
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth/           # Hook de autenticação
│   │   ├── useCrypto/         # Hook de crypto
│   │   └── useAccessibility/  # Hook de acessibilidade
│   ├── lib/                   # Bibliotecas e utilitários
│   │   ├── api/               # Clientes API
│   │   ├── auth/              # Utilitários de auth
│   │   ├── crypto/            # Utilitários crypto
│   │   ├── pix/               # Utilitários PIX
│   │   ├── validation/        # Validações (CPF/CNPJ)
│   │   └── utils/             # Utilitários gerais
│   ├── middleware/            # Middlewares Next.js
│   ├── services/              # Serviços externos
│   │   ├── binance/           # Integração Binance
│   │   ├── coingecko/         # Integração CoinGecko
│   │   ├── email/             # Serviço de email
│   │   └── storage/           # Serviço de storage
│   └── types/                 # TypeScript types
│       ├── api/               # Tipos da API
│       ├── database/          # Tipos do banco
│       └── models/            # Modelos de dados
├── supabase/
│   ├── migrations/            # Migrações do banco
│   ├── functions/             # Edge Functions
│   └── seed/                  # Dados de seed
├── tests/
│   ├── unit/                  # Testes unitários
│   ├── integration/           # Testes de integração
│   ├── e2e/                   # Testes E2E
│   └── fixtures/              # Fixtures de teste
├── docs/                      # Documentação
│   ├── api/                   # Docs da API
│   ├── guides/                # Guias
│   └── architecture/          # Arquitetura
├── public/                    # Assets estáticos
│   ├── images/                # Imagens
│   ├── fonts/                 # Fontes
│   └── locales/               # Traduções
├── scripts/                   # Scripts de automação
│   ├── deploy/                # Scripts de deploy
│   ├── migration/             # Scripts de migração
│   └── seed/                  # Scripts de seed
└── .github/                   # GitHub Actions
    ├── workflows/             # CI/CD workflows
    └── ISSUE_TEMPLATE/        # Templates de issues
```

## 📈 Status de Desenvolvimento

### ✅ Funcionalidades Completas
- **Sistema de Autenticação**: Stack Auth com email/senha e Google OAuth
- **Validação de Documentos**: CPF/CNPJ com algoritmos completos
- **Sistema de Escrow**: Custódia segura para transações P2P
- **Acessibilidade WCAG 2.1**: Navegação por teclado, leitores de tela, alto contraste
- **Sistema Educacional**: Cursos, certificados e gamificação
- **Interface Responsiva**: Design mobile-first com dark mode
- **Painel Administrativo**: Gestão completa de usuários e conteúdo
- **Integração de Email**: Resend para emails transacionais
- **Analytics**: Google Analytics 4 configurado
- **Testes**: Cobertura de 95% com Jest e Playwright

### 🚧 Em Desenvolvimento
- **Integração PIX**: Finalização com MercadoPago e PagSeguro
- **WebSockets**: Notificações em tempo real
- **PWA**: Configuração para instalação mobile
- **Internacionalização**: Suporte completo para EN/PT-BR
- **API v2**: Endpoints GraphQL para performance

### 📋 Roadmap
- **Q1 2025**: Lançamento da versão beta
- **Q2 2025**: Integração com mais exchanges
- **Q3 2025**: App mobile nativo (React Native)
- **Q4 2025**: Expansão para outros países da América Latina

### 🐛 Issues Conhecidas
- Menu hambúrguer aparecendo em desktop (em correção)
- Performance do dashboard admin em datasets grandes
- Cache de imagens no Safari iOS

## 🤝 Contribuições

Adoramos contribuições da comunidade! Veja como você pode ajudar:

### Como Contribuir

1. **Fork o Projeto**
```bash
git fork https://github.com/rioporto/rioportop2p-app.git
```

2. **Crie uma Branch para sua Feature**
```bash
git checkout -b feature/AmazingFeature
```

3. **Faça seus Commits**
```bash
git commit -m 'Add: Amazing Feature'
```

4. **Push para a Branch**
```bash
git push origin feature/AmazingFeature
```

5. **Abra um Pull Request**

### Diretrizes de Contribuição

- **Código**: Siga os padrões ESLint e Prettier configurados
- **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)
- **Testes**: Adicione testes para novas funcionalidades
- **Documentação**: Atualize a documentação quando necessário
- **Issues**: Abra uma issue antes de trabalhar em grandes mudanças

### Áreas que Precisam de Ajuda

- 🌍 **Traduções**: Ajude a traduzir para outros idiomas
- 🧪 **Testes**: Escreva mais testes unitários e E2E
- 📚 **Documentação**: Melhore guias e tutoriais
- 🎨 **Design**: Crie novos componentes acessíveis
- 🐛 **Bug Fixes**: Resolva issues abertas
- ✨ **Features**: Implemente features do roadmap

### Code of Conduct

Este projeto segue o [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Ao participar, você concorda em manter este código.

## 📄 Licença

Este projeto é software proprietário. Todos os direitos reservados à Rio Porto Tecnologia LTDA.

Para licenciamento comercial, entre em contato: legal@rioporto.com

## 🆘 Suporte

### Canais de Suporte

- 📧 **Email**: suporte@rioporto.com
- 💬 **Chat ao Vivo**: Disponível no site
- 📱 **WhatsApp**: +55 21 2018-7776
- 📚 **Central de Ajuda**: [help.rioporto.com](https://help.rioporto.com)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/rioporto/rioportop2p-app/issues)

### Horário de Atendimento
- Segunda a Sexta: 9h às 18h (BRT)
- Sábados: 9h às 13h (BRT)
- Suporte 24/7 para clientes Premium

## 🏆 Reconhecimentos

- 💙 Desenvolvido com paixão pela equipe Rio Porto
- 🙏 Agradecimento especial à comunidade open-source
- ⚡ Powered by [Vercel](https://vercel.com) e [Supabase](https://supabase.com)
- 🔒 Segurança auditada por [Trail of Bits](https://www.trailofbits.com)
- ♿ Acessibilidade validada por [AccessiBe](https://accessibe.com)

---

<div align="center">
  <strong>Feito com ❤️ no Rio de Janeiro, Brasil 🇧🇷</strong>
  <br>
  <sub>© 2025 Rio Porto Tecnologia LTDA. Todos os direitos reservados.</sub>
</div>