# Rio Porto P2P - Plataforma de Bitcoin P2P

## 🚀 Sobre o Projeto

Rio Porto P2P é uma plataforma moderna e segura para compra e venda de Bitcoin no modelo peer-to-peer (P2P), desenvolvida para a RIO PORTO MEDIAÇÃO LTDA. A plataforma oferece uma experiência completa com sistema KYC multinível, operações OTC para grandes volumes, blog educacional e plataforma de cursos.

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Type safety e melhor DX
- **Tailwind CSS** - Estilização utility-first
- **Supabase** - Backend as a Service
- **Lucide React** - Ícones modernos
- **Vercel** - Deploy e hospedagem

## 📋 Funcionalidades

### Páginas Públicas
- **Home** - Landing page com informações principais
- **Cotação P2P** - Calculadora e solicitação de cotações
- **OTC** - Operações de grandes volumes
- **KYC** - Sistema de verificação em 3 níveis
- **Blog** - Conteúdo educacional (98% Bitcoin)
- **Cursos** - Plataforma educacional com curso P2P gratuito
- **FAQ** - Perguntas frequentes interativas
- **Contato** - Formulários e informações

### API Routes
- `/api/cotacao` - Retorna cotações atualizadas do Bitcoin
- `/api/contact` - Processa formulários de contato

### Características
- ✅ Design responsivo mobile-first
- ✅ Dark mode nativo
- ✅ SEO otimizado
- ✅ Performance otimizada
- ✅ Acessibilidade
- ✅ Formulários com validação
- ✅ Integração WhatsApp

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/rioporto/rioportop2p-app.git

# Entre no diretório
cd rioportop2p-app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### Build para Produção

```bash
# Criar build otimizada
npm run build

# Iniciar servidor de produção
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/                  # Páginas e rotas
│   ├── api/             # API routes
│   ├── (páginas)/       # Páginas da aplicação
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página inicial
├── components/          # Componentes reutilizáveis
│   ├── Navbar.tsx      # Navegação principal
│   └── Footer.tsx      # Rodapé
├── lib/                # Utilitários e configurações
│   ├── supabase.ts     # Cliente Supabase
│   └── utils.ts        # Funções auxiliares
```

## 🔐 Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 📱 Páginas e Rotas

- `/` - Página inicial
- `/cotacao-p2p` - Cotação e calculadora
- `/otc` - Operações OTC
- `/kyc` - Verificação KYC
- `/blog` - Blog educacional
- `/cursos` - Plataforma de cursos
- `/faq` - Perguntas frequentes

## 🎨 Design System

### Cores Principais
- Primary: Laranja (#f97316)
- Secondary: Cinza escuro
- Accent: Âmbar (#f59e0b)

### Tipografia
- Font: System UI / Inter
- Headings: Bold
- Body: Regular

## 🚀 Deploy

O projeto está configurado para deploy automático no Vercel:

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na branch main

## 📞 Contato

**RIO PORTO MEDIAÇÃO LTDA**
- CNPJ: 11.741.563/0001-57
- WhatsApp: +55 21 2018-7776
- Endereço: Av. Marechal Câmara 160, sala 1107, Centro, Rio de Janeiro - RJ

## 📄 Licença

Este projeto é propriedade da RIO PORTO MEDIAÇÃO LTDA. Todos os direitos reservados.

---

Desenvolvido com ❤️ pela equipe Rio Porto P2P