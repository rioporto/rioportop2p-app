# Guia de Acessibilidade - Rio Porto P2P

Este documento contém diretrizes e melhores práticas de acessibilidade para o projeto Rio Porto P2P.

## 📋 Índice

1. [Princípios WCAG 2.1](#princípios-wcag-21)
2. [Contraste de Cores](#contraste-de-cores)
3. [Navegação por Teclado](#navegação-por-teclado)
4. [Leitores de Tela](#leitores-de-tela)
5. [Imagens e Mídia](#imagens-e-mídia)
6. [Formulários](#formulários)
7. [Componentes Interativos](#componentes-interativos)
8. [Testes de Acessibilidade](#testes-de-acessibilidade)

## 🎯 Princípios WCAG 2.1

### 1. Perceptível
- Informações devem ser apresentadas de formas que os usuários possam perceber
- Use contraste adequado entre texto e fundo
- Forneça alternativas textuais para conteúdo não-textual

### 2. Operável
- Componentes devem ser operáveis por teclado
- Dê tempo suficiente para ler e usar o conteúdo
- Não use conteúdo que cause convulsões

### 3. Compreensível
- Informações devem ser legíveis e compreensíveis
- Páginas devem funcionar de maneira previsível
- Ajude usuários a evitar e corrigir erros

### 4. Robusto
- Conteúdo deve ser robusto o suficiente para funcionar com tecnologias assistivas
- Use HTML semântico válido
- Garanta compatibilidade com leitores de tela

## 🎨 Contraste de Cores

### Requisitos Mínimos
- **Texto normal**: Contraste mínimo de 4.5:1
- **Texto grande** (18pt+ ou 14pt+ bold): Contraste mínimo de 3:1
- **Componentes UI**: Contraste mínimo de 3:1

### Cores Aprovadas

```typescript
// Use estas cores para garantir acessibilidade
import { colors, accessibleCombinations } from '@/lib/theme/colors'

// Botões primários
<button className="bg-orange-700 text-white hover:bg-orange-800">
  Ação Principal
</button>

// Links
<a className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
  Link Acessível
</a>

// Texto em fundos claros
<p className="text-gray-900">Texto principal</p>
<p className="text-gray-600">Texto secundário</p>

// Texto em fundos escuros
<p className="text-gray-100">Texto principal</p>
<p className="text-gray-400">Texto secundário</p>
```

### Ferramenta de Teste
Acesse `/test-contrast` para verificar combinações de cores.

## ⌨️ Navegação por Teclado

### Skip Links
Sempre inclua skip links no início da página:

```tsx
import { SkipLinks } from '@/components/ui/SkipLinks'

export default function Layout({ children }) {
  return (
    <body>
      <SkipLinks />
      {/* resto do conteúdo */}
    </body>
  )
}
```

### Ordem de Tabulação
- Use `tabindex="0"` para elementos que devem receber foco
- Use `tabindex="-1"` para elementos que recebem foco programaticamente
- Evite `tabindex` positivos

### Indicadores de Foco
Sempre forneça indicadores visuais claros:

```css
/* Tailwind classes recomendadas */
.focus-visible:ring-2 
.focus-visible:ring-offset-2 
.focus-visible:ring-blue-500
```

## 🔊 Leitores de Tela

### Texto Oculto Visualmente
Use a classe `sr-only` para texto apenas para leitores de tela:

```tsx
<span className="sr-only">Informação adicional para leitores de tela</span>
```

### ARIA Labels
Use ARIA labels quando necessário:

```tsx
<button aria-label="Fechar modal">
  <XIcon />
</button>

<nav aria-label="Navegação principal">
  {/* links */}
</nav>
```

### Live Regions
Para atualizações dinâmicas:

```tsx
<div aria-live="polite" aria-atomic="true">
  {notification && <p>{notification}</p>}
</div>
```

## 🖼️ Imagens e Mídia

### Componente AccessibleImage
Use o componente `AccessibleImage` para todas as imagens:

```tsx
import { AccessibleImage } from '@/components/ui/AccessibleImage'

// Imagem informativa
<AccessibleImage
  src="/bitcoin-chart.png"
  alt="Gráfico mostrando alta de 5% no Bitcoin"
  width={600}
  height={400}
/>

// Imagem complexa com descrição longa
<AccessibleImage
  src="/complex-diagram.png"
  alt="Diagrama de segurança"
  longDescription="Diagrama detalhando as 5 camadas de segurança: autenticação, criptografia, validação, monitoramento e backup"
  width={800}
  height={600}
/>

// Imagem decorativa
<AccessibleImage
  src="/decoration.png"
  alt=""
  decorative={true}
  width={100}
  height={100}
/>
```

### Vídeos
Sempre forneça:
- Legendas (captions)
- Transcrições
- Descrições de áudio quando relevante

## 📝 Formulários

### Labels Associados
Sempre associe labels aos campos:

```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Mensagens de Erro
Torne erros claros e associados aos campos:

```tsx
<div>
  <label htmlFor="cpf">CPF</label>
  <input 
    id="cpf" 
    aria-invalid={!!error}
    aria-describedby={error ? "cpf-error" : undefined}
  />
  {error && (
    <p id="cpf-error" className="text-red-600">
      {error}
    </p>
  )}
</div>
```

### Grupos de Campos
Use fieldset e legend para grupos relacionados:

```tsx
<fieldset>
  <legend>Informações Pessoais</legend>
  {/* campos do formulário */}
</fieldset>
```

## 🎛️ Componentes Interativos

### Estados Visuais
Sempre indique estados claramente:

```tsx
// Loading
<LoadingButton loading={isLoading} loadingText="Processando...">
  Enviar
</LoadingButton>

// Disabled
<button disabled className="opacity-50 cursor-not-allowed">
  Ação Indisponível
</button>

// Selected/Active
<button aria-pressed="true" className="bg-blue-600">
  Opção Selecionada
</button>
```

### Modals e Dialogs
- Trap focus dentro do modal
- Permita fechar com ESC
- Retorne foco ao elemento que abriu o modal

```tsx
<dialog role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <h2 id="modal-title">Título do Modal</h2>
  {/* conteúdo */}
</dialog>
```

## 🧪 Testes de Acessibilidade

### Ferramentas Recomendadas

1. **axe DevTools** - Extensão do navegador
2. **WAVE** - Web Accessibility Evaluation Tool
3. **Lighthouse** - Auditoria do Chrome DevTools
4. **NVDA/JAWS** - Leitores de tela para testes

### Checklist de Testes

- [ ] Navegue usando apenas o teclado
- [ ] Verifique contraste de cores com `/test-contrast`
- [ ] Teste com leitor de tela
- [ ] Valide HTML com W3C Validator
- [ ] Execute Lighthouse audit
- [ ] Teste com 200% de zoom
- [ ] Desabilite CSS e verifique se o conteúdo faz sentido
- [ ] Teste em modo de alto contraste do OS

### Testes Automatizados

```bash
# Instalar jest-axe
npm install --save-dev @testing-library/jest-dom jest-axe

# Exemplo de teste
import { axe, toHaveNoViolations } from 'jest-axe'

test('should not have accessibility violations', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## 📚 Recursos Adicionais

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## 🎯 Metas de Acessibilidade

### Curto Prazo (Concluído ✅)
- [x] Implementar skip links
- [x] Criar utilitário de verificação de contraste
- [x] Documentar cores acessíveis
- [x] Criar componente AccessibleImage

### Médio Prazo
- [ ] Adicionar testes automatizados de acessibilidade
- [ ] Implementar preferências de usuário (contraste alto, animações reduzidas)
- [ ] Criar modo de navegação por teclado aprimorado
- [ ] Adicionar suporte a múltiplos idiomas

### Longo Prazo
- [ ] Certificação WCAG AA
- [ ] Suporte completo a tecnologias assistivas
- [ ] Documentação em Braille/áudio
- [ ] Interface por comandos de voz