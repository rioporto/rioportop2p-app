# Variáveis para Atualizar no .env.local

Adicione ou atualize estas variáveis no seu arquivo `.env.local`:

```env
# API de Cotação Bitcoin - CoinMarketCap
COINMARKETCAP_API_KEY=b3c81af3-455a-4ff4-812b-d9e87433ec71
COINMARKETCAP_API_URL=https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest

# WhatsApp (substitua pelos números reais da empresa)
NEXT_PUBLIC_WHATSAPP_NUMBER=5521999999999
NEXT_PUBLIC_WHATSAPP_SUPPORT=5521999999999
NEXT_PUBLIC_WHATSAPP_SALES=5521999999999
NEXT_PUBLIC_WHATSAPP_KYC=5521999999999

# Remover estas (não são necessárias, já temos Stack Auth):
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=[gerar-com-openssl-rand-base64-32]

# Ambiente
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT=false
NEXT_PUBLIC_ENABLE_KYC_UPLOAD=true
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=false
```

## Variáveis que já devem estar corretas:

✅ Supabase (todas configuradas)
✅ Stack Auth (todas configuradas)
✅ Resend (configurado)
✅ Cloudinary (configurado)

## Para o Vercel (produção):

Lembre-se de adicionar estas mesmas variáveis no dashboard do Vercel, mas com valores de produção:
- `NEXT_PUBLIC_APP_URL=https://rioportop2p-app.vercel.app`
- `NODE_ENV=production`