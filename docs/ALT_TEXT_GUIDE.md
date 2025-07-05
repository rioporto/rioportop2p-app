# Guia de Alt Text - Rio Porto P2P

Este guia fornece exemplos e diretrizes para escrever textos alternativos (alt text) adequados para imagens na plataforma.

## 📋 Princípios Básicos

### O que é Alt Text?
Alt text é uma descrição textual de uma imagem que:
- É lida por leitores de tela para usuários com deficiência visual
- Aparece quando a imagem não carrega
- Ajuda SEO ao fornecer contexto para mecanismos de busca

### Quando Usar Alt Text
- **Sempre** para imagens informativas
- **Vazio** (`alt=""`) para imagens decorativas
- **Descritivo** para gráficos e diagramas complexos

## ✅ Boas Práticas

### 1. Seja Conciso mas Descritivo
```tsx
// ❌ Ruim - muito genérico
alt="Imagem"
alt="Gráfico"

// ✅ Bom - descritivo e conciso
alt="Gráfico de linha mostrando crescimento de 15% no preço do Bitcoin"
alt="Logo da Rio Porto P2P"
```

### 2. Não Use "Imagem de" ou "Foto de"
```tsx
// ❌ Ruim - redundante
alt="Imagem de um gráfico de Bitcoin"

// ✅ Bom - direto ao ponto
alt="Gráfico de preço do Bitcoin nas últimas 24 horas"
```

### 3. Forneça Contexto Relevante
```tsx
// ❌ Ruim - sem contexto
alt="Pessoa sorrindo"

// ✅ Bom - contexto relevante
alt="Cliente satisfeito após completar primeira transação P2P"
```

### 4. Para Imagens Decorativas
```tsx
// Para imagens puramente decorativas, use alt vazio
<Image src="/pattern.svg" alt="" />

// Ou use o componente AccessibleImage
<AccessibleImage 
  src="/decoration.png" 
  alt=""
  decorative={true}
/>
```

## 📸 Exemplos Específicos do Projeto

### Logos e Ícones
```tsx
// Logo da empresa
alt="Rio Porto P2P"

// Ícones de criptomoedas
alt="Bitcoin (BTC)"
alt="Ethereum (ETH)"
alt="Tether (USDT)"

// Ícones de funcionalidade
alt="Ícone de segurança"
alt="Verificado"
alt="Transação pendente"
```

### Gráficos e Charts
```tsx
// Gráficos de preço
alt="Gráfico mostrando Bitcoin a R$ 245.000 com alta de 3.5% hoje"
alt="Histórico de preços do Ethereum na última semana"

// Gráficos de volume
alt="Volume de negociação: R$ 2.5 milhões nas últimas 24 horas"
```

### Screenshots e Interfaces
```tsx
// Screenshots de funcionalidades
alt="Tela de criação de ordem de compra mostrando campos de valor e quantidade"
alt="Painel de controle exibindo saldo de R$ 10.000 e 3 transações ativas"

// QR Codes
alt="QR Code para pagamento PIX de R$ 500,00"
alt="QR Code para autenticação de dois fatores"
```

### Fotos de Usuários
```tsx
// Avatares
alt="Foto de perfil de João Silva"
alt="Avatar padrão de usuário"

// Documentos (KYC)
alt="Documento de identidade para verificação"
alt="Comprovante de residência"
```

### Estados e Feedback
```tsx
// Estados de transação
alt="Ícone de check verde indicando transação concluída"
alt="Ícone de relógio amarelo indicando pagamento pendente"
alt="Ícone de X vermelho indicando transação cancelada"

// Níveis de verificação
alt="Selo de conta verificada nível Bronze"
alt="Selo de conta verificada nível Ouro"
```

## 🎯 Casos Especiais

### Imagens Complexas
Para diagramas ou infográficos complexos, use descrições longas:

```tsx
<AccessibleImage
  src="/security-diagram.png"
  alt="Diagrama de arquitetura de segurança"
  longDescription="Diagrama mostrando 5 camadas de segurança: 1) Autenticação com 2FA, 2) Criptografia SSL/TLS, 3) Validação de dados, 4) Monitoramento 24/7, 5) Backups automáticos. Cada camada é representada por um escudo conectado aos outros."
  width={800}
  height={600}
/>
```

### Botões com Apenas Ícones
```tsx
// Use aria-label para botões sem texto
<button aria-label="Fechar modal">
  <XIcon />
</button>

<button aria-label="Adicionar aos favoritos">
  <StarIcon />
</button>
```

### Imagens de Fundo CSS
Para imagens de fundo importantes, forneça texto alternativo via HTML:

```tsx
<div className="hero-background">
  <span className="sr-only">
    Imagem de fundo mostrando skyline do Rio de Janeiro
  </span>
  {/* conteúdo */}
</div>
```

## 🚫 O Que Evitar

### 1. Alt Text Muito Longo
```tsx
// ❌ Ruim - descrição excessiva
alt="Esta é uma imagem de um gráfico de linha colorido em azul e verde mostrando o preço do Bitcoin em reais brasileiros durante o período de 24 horas do dia 15 de janeiro de 2024, com eixo X representando as horas e eixo Y representando o valor em reais"

// ✅ Bom - conciso mas completo
alt="Gráfico de preço do Bitcoin em 24h mostrando alta de R$ 240.000 para R$ 248.000"
```

### 2. Informações Redundantes
```tsx
// ❌ Ruim - repete informação já presente no texto
// Texto: "João Silva - Usuário Verificado"
alt="João Silva - Usuário Verificado"

// ✅ Bom - complementa o texto
alt="Foto de perfil de João Silva"
```

### 3. Keywords para SEO
```tsx
// ❌ Ruim - keyword stuffing
alt="bitcoin comprar vender p2p exchange brasil criptomoeda"

// ✅ Bom - natural e descritivo
alt="Interface de compra de Bitcoin na plataforma P2P"
```

## 🧪 Como Testar

1. **Desabilite imagens** no navegador e veja se o conteúdo ainda faz sentido
2. **Use um leitor de tela** (NVDA, JAWS, VoiceOver)
3. **Verifique com ferramentas**:
   - axe DevTools
   - WAVE
   - Lighthouse

## 📚 Recursos

- [WebAIM Alt Text Guide](https://webaim.org/techniques/alttext/)
- [W3C Alt Text Decision Tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- [MDN Alt Text Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#writing_good_alt_text)

## 🎯 Checklist

Antes de fazer commit, verifique:

- [ ] Todas as imagens informativas têm alt text descritivo
- [ ] Imagens decorativas têm `alt=""`
- [ ] Alt text é conciso (máximo ~125 caracteres)
- [ ] Não usa "imagem de" ou "foto de"
- [ ] Fornece contexto relevante para o usuário
- [ ] Imagens complexas têm descrições longas quando necessário
- [ ] Botões com ícones têm `aria-label`