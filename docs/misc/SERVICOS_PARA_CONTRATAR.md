# 📋 SERVIÇOS PARA CONTRATAR - RIO PORTO P2P

## ✅ JÁ CONFIGURADOS (Funcionando)

### 1. **Supabase** (Banco de Dados) ✅
- Status: CONFIGURADO E FUNCIONANDO
- Plano: Free tier é suficiente para começar
- Limite: 500MB storage, 2GB bandwidth

### 2. **Vercel** (Hospedagem) ✅
- Status: CONFIGURADO E FUNCIONANDO
- Plano: Free tier (Hobby)
- Limite: 100GB bandwidth/mês

### 3. **CoinMarketCap** (Cotação Crypto) ✅
- Status: CONFIGURADO E FUNCIONANDO
- API Key: b3c81af3-455a-4ff4-812b-d9e87433ec71
- Plano: Basic (gratuito)
- Limite: 10.000 calls/mês

### 4. **WhatsApp** (Links Diretos) ✅
- Status: CONFIGURADO (sem API, apenas links)
- Custo: GRÁTIS
- Números configurados no Vercel

### 5. **Cloudinary** (Upload de Imagens) ✅
- Status: Credenciais prontas
- Plano: Free tier
- Limite: 25GB storage, 25GB bandwidth/mês

## 🔴 ESSENCIAIS - CONTRATAR AGORA

### 1. **Stack Auth** (Autenticação) 🔴
- **Por que precisa**: Login/Cadastro não funcionam sem isso
- **Onde contratar**: https://stack-auth.com
- **Plano recomendado**: Starter (Free)
- **O que fazer**:
  1. Criar conta
  2. Criar projeto "Rio Porto P2P"
  3. Copiar as 3 chaves
  4. Adicionar no Vercel

### 2. **Resend** (Envio de Emails) 🔴
- **Por que precisa**: Emails de confirmação, recuperação de senha
- **Onde contratar**: https://resend.com
- **Plano recomendado**: Free (3.000 emails/mês)
- **O que fazer**:
  1. Criar conta
  2. Verificar domínio (importante!)
  3. Gerar API key
  4. Adicionar no Vercel

## 🟡 IMPORTANTES - CONTRATAR EM BREVE

### 3. **Gateway de Pagamento PIX**
Escolha UM destes:

#### Opção A: **MercadoPago** (Recomendado)
- **Taxa**: 0,99% por transação PIX
- **Onde**: https://www.mercadopago.com.br/developers
- **Vantagem**: Mais popular, boa API

#### Opção B: **PagSeguro**
- **Taxa**: 0,40% por transação PIX
- **Onde**: https://dev.pagseguro.uol.com.br
- **Vantagem**: Taxa menor

#### Opção C: **Gerencianet/Efí**
- **Taxa**: R$ 0,01 por PIX
- **Onde**: https://sejaefi.com.br
- **Vantagem**: Cobrança fixa, não percentual

### 4. **Validação de Documentos (KYC)**
Escolha UM destes:

#### Opção A: **Serpro** (Governo)
- **Serviço**: Validação CPF oficial
- **Custo**: ~R$ 0,40 por consulta
- **Onde**: https://servicos.serpro.gov.br

#### Opção B: **SintegraWS**
- **Serviço**: CPF + dados complementares
- **Custo**: A partir de R$ 0,15 por consulta
- **Onde**: https://www.sintegraws.com.br

### 5. **SMS para 2FA**
- **Twilio**: $0.0075 por SMS
- **Zenvia**: ~R$ 0,09 por SMS
- **SNS Amazon**: ~R$ 0,024 por SMS

## 🟢 OPCIONAIS - MELHORIAS FUTURAS

### 6. **Google Maps API**
- **Para**: Mostrar localização de vendedores
- **Custo**: $200 créditos grátis/mês
- **Onde**: https://console.cloud.google.com

### 7. **WhatsApp Business API**
- **Para**: Notificações automáticas
- **Custo**: ~$0.005 por mensagem
- **Onde**: Meta for Developers

### 8. **Sentry** (Monitoramento de Erros)
- **Para**: Detectar bugs em produção
- **Plano**: Free (5.000 eventos/mês)
- **Onde**: https://sentry.io

### 9. **Google Analytics**
- **Para**: Análise de tráfego
- **Custo**: GRÁTIS
- **Onde**: https://analytics.google.com

## 💰 CUSTO MENSAL ESTIMADO

### Fase 1 - MVP (Agora)
- Stack Auth: R$ 0 (free tier)
- Resend: R$ 0 (3.000 emails/mês free)
- **TOTAL: R$ 0/mês**

### Fase 2 - Produção (100-500 usuários)
- Stack Auth: R$ 0-50
- Resend: R$ 0-50
- Gateway PIX: ~R$ 50-200 (dependendo do volume)
- Validação CPF: ~R$ 20-100
- **TOTAL: R$ 120-400/mês**

### Fase 3 - Escala (500+ usuários)
- Upgrades necessários conforme crescimento
- Estimar 2-3% da receita em infraestrutura

## 🚀 ORDEM DE IMPLEMENTAÇÃO

### HOJE:
1. **Stack Auth** - 10 minutos para configurar
2. **Resend** - 20 minutos (incluindo DNS)

### ESTA SEMANA:
3. **Gateway PIX** - Escolher e criar conta
4. **Validação CPF** - Testar APIs

### PRÓXIMO MÊS:
5. Demais serviços conforme necessidade

## 📝 CHECKLIST RÁPIDO

- [ ] Criar conta Stack Auth
- [ ] Configurar Stack Auth no Vercel
- [ ] Criar conta Resend
- [ ] Verificar domínio no Resend
- [ ] Configurar Resend no Vercel
- [ ] Escolher gateway de pagamento PIX
- [ ] Criar conta no gateway escolhido
- [ ] Escolher serviço de validação CPF
- [ ] Testar fluxo completo

## 🆘 PRECISA DE AJUDA?

Para cada serviço, temos guias detalhados:
- `GUIA_CONFIGURACAO_APIS.md` - Tutorial passo a passo
- `CONFIGURACOES_FINAIS.md` - Variáveis de ambiente
- `API_DOCUMENTATION.md` - Como integrar

---

**PRÓXIMO PASSO**: Comece criando conta no Stack Auth e Resend. Em 30 minutos você terá login e emails funcionando!