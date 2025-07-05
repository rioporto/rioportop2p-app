
# 📒 Relatório de Auditoria – Rio Porto P2P  
*(revisão solicitada – 05 jul 2025)*  

---

## 1. Contexto da revisão  

O painel **/admin** está deliberadamente exposto enquanto a equipe realiza QA interno. Quando a autenticação definitiva via Supabase/NextAuth for ativada, o acesso passará a exigir credenciais. Todos os achados abaixo assumem **esse cenário futuro** – isto é, o painel ficará protegido, e nenhuma informação sensível deverá ficar acessível sem login. Os demais riscos e recomendações permanecem válidos.  

---

## 2. Sumário‑executivo (priorização revista)  

| Severidade | Descrição | Justificativa principal |
|------------|-----------|-------------------------|
| **Alta** | Ausência de gateway PIX/escrow e verificação KYC completa | Impacto direto na receita e compliance regulatório |
| **Alta** | Falta de cabeçalhos de segurança (HSTS, CSP, X‑Frame) | Aumenta superfície a ataques XSS, clickjacking e downgrade HTTPS |
| **Alta** | APIs de mutação sem token CSRF e rate‑limiting | Possível execução não autorizada de transações |
| **Média** | Painel **/admin** acessível durante fase de testes | Risco temporário aceitável, mas exige *feature flag* para dados reais |
| **Média** | Problemas de acessibilidade (contraste, `alt`, foco) | Diminui usabilidade, expõe a litígios A11y |
| **Baixa** | Otimizações de UX (hamburger desktop, LCP fontes, PWA) | Melhora satisfação e SEO, sem impacto crítico |

---

## 3. Achados críticos detalhados  

1. **Integração financeira incompleta (PIX + escrow)**  
   *Não há liquidação automática nem segregação de valores* – risco de fraude e autuação BACEN.  
   **Correção**: integrar MercadoPago/PagSeguro, criar webhook `/api/webhooks/pix` com assinatura, armazenar estado de escrow.  

2. **KYC/AML pendente**  
   Documentos são coletados mas não verificados contra bases oficiais.  
   **Correção**: Serviço Serpro ou SintegraWS, gatilho antes de liberar limites > R$ 5 000.  

3. **Cabeçalhos de segurança ausentes**  
   `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options` não são enviados.  
   **Correção**: adicionar via `next.config.js` (exemplo no §7).  

4. **CSRF e Bruteforce**  
   Endpoints `POST /api/transactions` aceitam requisições sem token anti‑forgery; não há *rate‑limit*.  
   **Correção**: `SameSite=Lax` + token CSRF; usar `express-rate-limit` ou Edge Middleware.  

---

## 4. Achados de severidade média  

| # | Item | Nota | Ação recomendada |
|---|------|------|------------------|
| 1 | **Painel /admin exposto (ambiente de QA)** | Dados exibidos ainda são *mock*; equipe pretende fechar antes de produção. | Manter rota protegida atrás de *feature flag*; nunca subir dados reais enquanto estiver aberto. |
| 2 | **Contraste insuficiente** (#00ADEF sobre branco) | Fere WCAG AA. | Escurecer cor ou aumentar peso da fonte. |
| 3 | **Componentes interativos sem foco visível** | Usuários teclado/leitores de tela têm dificuldade. | Aplicar utilitário `focus:outline` + `:focus-visible`. |
| 4 | **Imagens sem `alt`** | Reduz SEO/A11y. | Inserir textos alternativos descritivos. |

---

## 5. Achados de severidade baixa  

* Menu hamburger aparece em desktop ≥ lg  
* Fontes Google sem `preconnect`, aumentando LCP ~100 ms  
* Ausência de `robots.txt` e tags `og:`/`twitter:`  
* Sem manifest PWA e ícone *apple‑touch*  
* Logs `console.log` em produção  
* Migrations Supabase sem *rollback*  

---

## 6. Roadmap priorizado (ajustado)  

| Prazo | Entrega |
|-------|---------|
| **0 – 3 dias** | • Configurar `strict-mode` nos headers<br>• Adicionar proteção CSRF e *rate‑limit*<br>• Remover dados fictícios do painel ou aplicar *feature flag* |
| **1 semana** | • Gateway PIX + escrow em sandbox<br>• Integração KYC (Serpro)<br>• Ajustar contraste e menu responsivo |
| **1 mês** | • Testes E2E (Playwright)<br>• Manifest PWA + push notifications<br>• Bug‑bounty interno |

---

## 7. Hardening técnico (referência rápida)  

```js
// next.config.js
headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: "default-src 'self'; frame-ancestors 'none';" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "same-origin" }
      ],
    },
  ];
}
```

* **Supabase RLS**: `user_id = auth.uid()` em todas as tabelas  
* **Zod** para validar payloads API  
* **.env**: usar variáveis criptografadas Vercel; evitar `NEXT_PUBLIC_` para segredos  

---

## 8. Conclusão revisada  

Com o painel **/admin** aberto apenas para QA, o risco de exposição imediata é controlado, mas **não** elimina a necessidade de blindagem antes do *go‑live*. As prioridades agora são:  

1. Concluir integrações financeiras (PIX + escrow) e KYC obrigatórios;  
2. Fortalecer segurança de transporte e API (HSTS, CSP, CSRF, rate‑limit);  
3. Refinar acessibilidade e desempenho UX para lançamento público.  

A plataforma continua robusta em arquitetura, porém precisa dessas correções para operar de forma segura e em conformidade. Após implementar o roadmap, recomenda‑se um *pentest* externo para validar o ambiente de produção.  

---
