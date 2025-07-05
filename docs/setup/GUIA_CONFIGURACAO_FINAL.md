# Guia de Configuração Final - APIs Pendentes

## 1. NextAuth - NÃO É NECESSÁRIO!
Você já tem Stack Auth configurado, que é mais moderno e completo. Pode remover as variáveis do NextAuth.

## 2. CoinMarketCap API - Configuração Correta

### URLs da API CoinMarketCap:
```env
# Para cotações das top 300 criptos em BRL
COINMARKETCAP_API_KEY=b3c81af3-455a-4ff4-812b-d9e87433ec71
COINMARKETCAP_API_URL=https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest

# Endpoint específico para conversão em BRL
BITCOIN_API_URL=https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest
```

### Exemplos de uso:

#### Listar top 300 criptos com preço em BRL:
```typescript
const response = await fetch(
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=300&convert=BRL',
  {
    headers: {
      'X-CMC_PRO_API_KEY': 'b3c81af3-455a-4ff4-812b-d9e87433ec71'
    }
  }
);
```

#### Cotação específica (Bitcoin) em BRL:
```typescript
const response = await fetch(
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC&convert=BRL',
  {
    headers: {
      'X-CMC_PRO_API_KEY': 'b3c81af3-455a-4ff4-812b-d9e87433ec71'
    }
  }
);
```

## 3. WhatsApp - Solução Sem API

Como a META negou o WhatsApp Business API, vamos usar links diretos:

```typescript
// Em src/lib/whatsapp.ts
export function getWhatsAppLink(phone: string, message: string) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

// Exemplo de uso:
const link = getWhatsAppLink('5521999999999', 'Olá, quero comprar Bitcoin!');
```

Adicione no .env.local:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5521999999999
NEXT_PUBLIC_WHATSAPP_SUPPORT=5521888888888
```

## 4. Google Maps API - Passo a Passo

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Clique em "Select a project" → "New Project"
3. Nome: "Rio Porto P2P"
4. Após criar, vá em "APIs & Services" → "Enable APIs"
5. Procure e ative:
   - Maps JavaScript API
   - Places API
6. Vá em "Credentials" → "Create Credentials" → "API Key"
7. Configure restrições:
   - Application restrictions: HTTP referrers
   - Website restrictions: 
     - https://rioportop2p-app.vercel.app/*
     - http://localhost:3000/*
8. Copie a API Key gerada

## 5. Sentry - Monitoramento de Erros

1. Acesse [sentry.io](https://sentry.io)
2. Crie conta gratuita
3. Create Project → Next.js
4. Nome: "rioportop2p"
5. Copie o DSN fornecido

```env
NEXT_PUBLIC_SENTRY_DSN=https://[seu-id]@o[org-id].ingest.sentry.io/[project-id]
SENTRY_AUTH_TOKEN=[gerar em Settings → Auth Tokens]
```

## 6. Google Analytics

1. Acesse [analytics.google.com](https://analytics.google.com)
2. Admin → Create Property
3. Nome: "Rio Porto P2P"
4. Configurações → Data Streams → Web
5. URL: https://rioportop2p-app.vercel.app
6. Copie o Measurement ID (G-XXXXXXXXXX)

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 7. Ambiente (já está configurado)

```env
NODE_ENV=development (local)
NODE_ENV=production (no Vercel)
NEXT_PUBLIC_APP_URL=https://rioportop2p-app.vercel.app
```

## 8. Feature Flags - Opções Simples

### Opção A: Usar variáveis de ambiente (grátis)
```env
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_KYC_UPLOAD=true
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=false
```

### Opção B: LaunchDarkly (pago)
1. Acesse [launchdarkly.com](https://launchdarkly.com)
2. Crie conta trial
3. Copie SDK Key

### Opção C: Unleash (open source)
1. Acesse [getunleash.io](https://getunleash.io)
2. Use versão cloud gratuita
3. Configure SDK

## Arquivo .env.local Atualizado

```env
# APIs já configuradas ✅
NEXT_PUBLIC_SUPABASE_URL=https://wqrbyxgmpjvhmzgchjbb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://...

NEXT_PUBLIC_STACK_PROJECT_ID=b9ca3cdc-20f0-4322-ac81-26e9ae17d29f
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_7k4691393w3s1wwkcpc7fsyvhk7zgsqywbmqj5rct018r
STACK_SECRET_SERVER_KEY=ssk_6qpdw7xv3435t2pdc8r05tjrvjkmntkgn14yvjx9qxn10

RESEND_API_KEY=re_P9thfPMP_6s71TLxWv7mFxhsaKnRQyu34
RESEND_FROM_EMAIL=noreply@rioporto.com

# CoinMarketCap ✅
COINMARKETCAP_API_KEY=b3c81af3-455a-4ff4-812b-d9e87433ec71
COINMARKETCAP_API_URL=https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest

# WhatsApp (sem API)
NEXT_PUBLIC_WHATSAPP_NUMBER=5521999999999
NEXT_PUBLIC_WHATSAPP_SUPPORT=5521888888888

# Google Maps (adicionar após criar)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[adicionar-aqui]

# Cloudinary ✅
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=rioporto-cn
CLOUDINARY_API_KEY=975234669148173
CLOUDINARY_API_SECRET=afih5fz90xGFyK4vAbqLWd7VIKM

# Sentry (adicionar após criar)
NEXT_PUBLIC_SENTRY_DSN=[adicionar-aqui]
SENTRY_AUTH_TOKEN=[adicionar-aqui]

# Analytics (adicionar após criar)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-[adicionar-aqui]

# Ambiente
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT=false
NEXT_PUBLIC_ENABLE_KYC_UPLOAD=true
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=false
```

## Próximos Passos

1. Remover variáveis NextAuth (não necessário)
2. Atualizar COINMARKETCAP_API_URL
3. Criar Google Maps API seguindo o passo a passo
4. Criar conta Sentry e pegar DSN
5. Criar Google Analytics e pegar ID
6. Adicionar números WhatsApp reais
7. Fazer commit e push
8. Adicionar todas as variáveis no Vercel