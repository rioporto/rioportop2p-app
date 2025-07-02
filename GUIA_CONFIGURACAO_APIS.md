# Guia de Configuração das APIs - Rio Porto P2P

## 1. Stack Auth (Autenticação)

### Passo a Passo:

1. **Criar conta no Stack**
   - Acesse [stack-auth.com](https://stack-auth.com)
   - Faça login com GitHub
   - Clique em "Create New Project"

2. **Configurar projeto**
   - Project Name: `Rio Porto P2P`
   - Environment: Production
   - Region: South America (se disponível)

3. **Obter credenciais**
   - No dashboard, vá para "API Keys"
   - Copie:
     - `Project ID`
     - `Publishable Client Key`
     - `Secret Server Key`

4. **Configurar no Vercel**
   ```
   NEXT_PUBLIC_STACK_PROJECT_ID=[seu-project-id]
   NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=[sua-publishable-key]
   STACK_SECRET_SERVER_KEY=[sua-secret-key]
   ```

5. **Configurar OAuth (opcional)**
   - Google OAuth
   - GitHub OAuth
   - Email/Password (já habilitado)

## 2. Resend (Envio de Emails)

### Passo a Passo:

1. **Criar conta no Resend**
   - Acesse [resend.com](https://resend.com)
   - Faça signup
   - Verifique seu email

2. **Gerar API Key**
   - Dashboard → API Keys
   - Click "Create API Key"
   - Nome: `rio-porto-p2p`
   - Permissões: Full Access

3. **Verificar domínio (importante!)**
   - Add Domain → Digite seu domínio
   - Adicione os registros DNS necessários
   - Aguarde verificação (pode levar algumas horas)

4. **Configurar no Vercel**
   ```
   RESEND_API_KEY=re_[sua-api-key]
   RESEND_FROM_EMAIL=noreply@[seu-dominio.com]
   ```

5. **Templates de email recomendados**
   - Confirmação de cadastro
   - Recuperação de senha
   - Notificação de transação
   - Atualização de KYC

## 3. API de Cotação Bitcoin

### Opções Recomendadas:

#### A. CoinGecko (Gratuito)
```
# Não precisa de API key para uso básico
BITCOIN_API_URL=https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl
```

#### B. Binance API (Gratuito)
```
BITCOIN_API_URL=https://api.binance.com/api/v3/ticker/price?symbol=BTCBRL
```

#### C. Mercado Bitcoin (Nacional)
```
# Criar conta em mercadobitcoin.com.br/api
BITCOIN_API_URL=https://api.mercadobitcoin.net/api/v4/tickers?symbols=BTC-BRL
BITCOIN_API_KEY=[sua-api-key]
BITCOIN_API_SECRET=[seu-secret]
```

#### D. CoinMarketCap (Mais completo)
```
# Criar conta em coinmarketcap.com/api
COINMARKETCAP_API_KEY=[sua-api-key]
BITCOIN_API_URL=https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest
```

### Implementação da API de Cotação:

```typescript
// src/lib/bitcoin-price.ts
export async function getBitcoinPrice() {
  try {
    // Opção A: CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl'
    );
    const data = await response.json();
    return data.bitcoin.brl;
    
    // Opção B: Binance
    // const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCBRL');
    // const data = await response.json();
    // return parseFloat(data.price);
  } catch (error) {
    console.error('Erro ao buscar cotação:', error);
    return null;
  }
}
```

## 4. APIs Opcionais

### Google Maps (Para Reviews)
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie novo projeto
3. Ative "Places API" e "Maps JavaScript API"
4. Gere API Key com restrições de domínio

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[sua-api-key]
```

### Cloudinary (Upload de Imagens)
1. Crie conta em [cloudinary.com](https://cloudinary.com)
2. Dashboard → Account Details
3. Copie credenciais

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=[seu-cloud-name]
CLOUDINARY_API_KEY=[sua-api-key]
CLOUDINARY_API_SECRET=[seu-api-secret]
```

### WhatsApp Business API
1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie app → WhatsApp
3. Configure webhook e número

```
WHATSAPP_BUSINESS_TOKEN=[seu-token]
WHATSAPP_PHONE_NUMBER_ID=[seu-phone-id]
```

## 5. Ordem de Implementação Recomendada

1. **Stack Auth** (essencial para login)
2. **Resend** (essencial para emails)
3. **API Bitcoin** (essencial para cotações)
4. **Cloudinary** (importante para KYC)
5. **Google Maps** (nice to have)
6. **WhatsApp** (nice to have)

## 6. Testes Após Configuração

### Testar Stack Auth:
```bash
curl https://rioportop2p-app.vercel.app/api/auth/test
```

### Testar Resend:
```bash
curl -X POST https://rioportop2p-app.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "seu-email@gmail.com"}'
```

### Testar Cotação Bitcoin:
```bash
curl https://rioportop2p-app.vercel.app/api/cotacao
```

## 7. Variáveis Completas para Vercel

```env
# Supabase (✅ Já configurado)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Bitcoin API (escolha uma)
BITCOIN_API_URL=
BITCOIN_API_KEY= (se necessário)

# Opcionais
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
WHATSAPP_BUSINESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

## 📝 Notas Importantes

1. **Segurança**: Nunca exponha chaves secretas no frontend
2. **Rate Limits**: Verifique limites de cada API
3. **Custos**: Monitore uso para evitar surpresas
4. **Backup**: Tenha fallbacks para APIs críticas
5. **Logs**: Configure logs para debug

## 🚀 Próximos Passos

Após configurar as APIs:
1. Implementar fluxo completo de autenticação
2. Testar envio de emails transacionais
3. Integrar cotação em tempo real
4. Configurar upload seguro de documentos
5. Implementar sistema de notificações