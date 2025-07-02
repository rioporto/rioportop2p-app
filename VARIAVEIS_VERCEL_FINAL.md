# Variáveis de Ambiente para Adicionar no Vercel

## 1. WhatsApp (IMPORTANTE - Número Real)
```
NEXT_PUBLIC_WHATSAPP_NUMBER=552120187776
NEXT_PUBLIC_WHATSAPP_SUPPORT=552120187776
NEXT_PUBLIC_WHATSAPP_SALES=552120187776
NEXT_PUBLIC_WHATSAPP_KYC=552120187776
```

## 2. Google Maps API (quando criar)
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[sua-chave-aqui]
```

## 3. Google Analytics (quando criar)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-[seu-id-aqui]
```

## 4. Sentry (opcional)
```
NEXT_PUBLIC_SENTRY_DSN=[seu-dsn-aqui]
SENTRY_AUTH_TOKEN=[seu-token-aqui]
```

## Variáveis Já Configuradas ✅

### Supabase
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- DATABASE_URL

### Stack Auth
- NEXT_PUBLIC_STACK_PROJECT_ID
- NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
- STACK_SECRET_SERVER_KEY

### Resend
- RESEND_API_KEY
- RESEND_FROM_EMAIL

### CoinMarketCap
- COINMARKETCAP_API_KEY
- COINMARKETCAP_API_URL

### Cloudinary
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

### Ambiente
- NEXT_PUBLIC_APP_URL
- NODE_ENV

## Como Adicionar no Vercel

1. Acesse o dashboard do Vercel
2. Vá em Settings → Environment Variables
3. Adicione cada variável acima
4. Clique em "Save"
5. Faça um novo deploy para aplicar as mudanças

## Testar Após Deploy

1. WhatsApp: https://rioportop2p-app.vercel.app/cotacao-p2p
2. Cotação: https://rioportop2p-app.vercel.app/api/cotacao
3. Top 300: https://rioportop2p-app.vercel.app/api/cotacao?top=true