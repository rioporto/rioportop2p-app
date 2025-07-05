# Guia de Testes de Acessibilidade

Este documento descreve como executar e manter os testes de acessibilidade da plataforma Rio Porto P2P.

## 📋 Visão Geral

Os testes de acessibilidade garantem que nossa plataforma seja utilizável por todos os usuários, incluindo aqueles que dependem de tecnologias assistivas.

## 🚀 Executando os Testes

### Instalar Dependências
```bash
npm install
```

### Executar Todos os Testes de Acessibilidade
```bash
npm run test:a11y
```

### Executar Testes Específicos
```bash
# Testes de contraste
npm test contrast.test

# Testes de componentes
npm test components.test

# Testes de navegação por teclado
npm test keyboard-navigation.test
```

### Executar com Coverage
```bash
npm run test:coverage -- src/__tests__/accessibility
```

### Modo Watch (desenvolvimento)
```bash
npm run test:watch -- src/__tests__/accessibility
```

## 📁 Estrutura dos Testes

```
src/__tests__/accessibility/
├── contrast.test.tsx          # Testes de contraste de cores
├── components.test.tsx        # Testes de acessibilidade dos componentes
└── keyboard-navigation.test.tsx # Testes de navegação por teclado
```

## 🧪 Tipos de Testes

### 1. Testes de Contraste (contrast.test.tsx)
- Valida proporções de contraste WCAG 2.1
- Testa combinações de cores predefinidas
- Verifica cores de botões, textos e estados

### 2. Testes de Componentes (components.test.tsx)
- Usa jest-axe para detectar violações
- Verifica atributos ARIA corretos
- Testa associação de labels
- Valida roles semânticos

### 3. Testes de Navegação por Teclado (keyboard-navigation.test.tsx)
- Tab navigation
- Enter/Space activation
- Escape key dismissal
- Focus management
- Arrow key navigation

## 📝 Escrevendo Novos Testes

### Teste Básico com jest-axe
```typescript
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { MyComponent } from '@/components/MyComponent'

expect.extend(toHaveNoViolations)

describe('MyComponent Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Teste de Navegação por Teclado
```typescript
import userEvent from '@testing-library/user-event'

it('should be keyboard navigable', async () => {
  const user = userEvent.setup()
  const { getByRole } = render(<MyComponent />)
  
  const button = getByRole('button')
  button.focus()
  
  await user.keyboard('{Enter}')
  // Verificar comportamento esperado
})
```

### Teste de Contraste
```typescript
import { checkContrast } from '@/lib/accessibility/contrast-checker'

it('should have sufficient contrast', () => {
  const result = checkContrast('#000000', '#ffffff')
  expect(result.passes.normal).toBe(true)
  expect(result.ratio).toBeGreaterThanOrEqual(4.5)
})
```

## 🎯 Checklist de Acessibilidade

Ao criar novos componentes, certifique-se de testar:

- [ ] **Violações do axe**: O componente passa no jest-axe?
- [ ] **Navegação por teclado**: Todos os elementos interativos são acessíveis?
- [ ] **Focus visible**: O foco é claramente visível?
- [ ] **ARIA labels**: Elementos sem texto têm aria-label?
- [ ] **Roles semânticos**: Os roles estão corretos?
- [ ] **Contraste de cores**: Texto tem contraste suficiente?
- [ ] **Estados**: Estados (disabled, loading) são comunicados?
- [ ] **Mensagens de erro**: Erros são associados aos campos?

## 🛠️ Ferramentas Úteis

### Durante o Desenvolvimento
- **axe DevTools**: Extensão do Chrome/Firefox
- **WAVE**: Web Accessibility Evaluation Tool
- **Lighthouse**: Auditoria no Chrome DevTools

### CI/CD
Os testes de acessibilidade devem ser executados em:
- Pull requests
- Commits na branch main
- Antes de deploys

### Configuração Recomendada (GitHub Actions)
```yaml
- name: Run Accessibility Tests
  run: |
    npm ci
    npm run test:a11y
```

## 📊 Métricas e Relatórios

### Gerar Relatório de Coverage
```bash
npm run test:coverage -- src/__tests__/accessibility
```

### Interpretar Resultados
- **Statements**: % de declarações testadas
- **Branches**: % de branches (if/else) testadas
- **Functions**: % de funções testadas
- **Lines**: % de linhas testadas

Meta mínima: 80% de coverage em todos os critérios

## 🚨 Resolução de Problemas

### Falsos Positivos
Alguns avisos do jest-axe podem ser falsos positivos. Nesses casos:

```typescript
const results = await axe(container, {
  rules: {
    'color-contrast': { enabled: false }, // Desabilitar regra específica
  }
})
```

### Elementos Dinâmicos
Para testar elementos que aparecem após interação:

```typescript
await waitFor(async () => {
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Focus Management
Para testar gerenciamento de foco:

```typescript
// Salvar elemento focado antes
const previouslyFocused = document.activeElement

// Executar ação
await user.click(button)

// Verificar foco restaurado
expect(document.activeElement).toBe(previouslyFocused)
```

## 📚 Recursos Adicionais

- [Jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [Testing Library Docs](https://testing-library.com/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Testing Best Practices](https://web.dev/articles/accessibility-testing)

## 🎯 Próximos Passos

1. Adicionar testes para todos os componentes existentes
2. Integrar testes no pipeline CI/CD
3. Criar testes E2E de acessibilidade com Playwright
4. Implementar monitoramento contínuo de acessibilidade