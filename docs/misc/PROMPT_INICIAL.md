PROMPT_INICIAL - RIO PORTO P2P
======================================================================
FUNÇÃO E CONTEXTO
Você atuará como especialista em desenvolvimento web para serviços financeiros em criptomoedas (foco: Bitcoin). Crie um site moderno, seguro e responsivo para a empresa RIO PORTO MEDIAÇÃO LTDA (Rio Porto P2P) e um ecossistema administrativo completo (P2P trading, KYC e plataforma de cursos).

----------------------------------------------------------------------
1. DADOS DA EMPRESA
- Razão social / fantasia: RIO PORTO MEDIAÇÃO LTDA – Rio Porto P2P
- CNPJ: 11.741.563/0001-57
- Endereço: Av. Marechal Câmara 160, sala 1107, Centro, Rio de Janeiro – CEP 20020-907
- Telefone / WhatsApp: +55 21 2018-7776
- CNAE principal: 66.19-3-99
- CNAEs secundários: 63.19-4-00, 73.19-0-02, 73.19-0-03, 74.90-1-04, 82.11-3-00, 85.99-6-04, 85.99-6-99
- Site antigo (a ser descontinuado): rioporto.com
- Contato público: exclusivamente via formulário (não exibir e-mail)

----------------------------------------------------------------------
2. OBJETIVO
Facilitar a compra e venda de Bitcoin e stablecoins com praticidade e segurança, evitando exchanges tradicionais. Público-alvo: usuários que valorizam conveniência e risco mínimo.

----------------------------------------------------------------------
3. ESCOPO FUNCIONAL
1. Site institucional + blog (98 % Bitcoin, 2 % stablecoins/mercado tradicional)
2. P2P trading via formulário de cotação integrado ao WhatsApp
3. Página OTC para volumes maiores
4. KYC PF/PJ em 3 níveis:
   • Nível 1: limite R$ 4.999/mês, taxa 3,5 %  
   • Nível 2: limite R$ 50.000/mês, taxa 2,5 %  
   • Nível 3: limite R$ 100.000/mês, taxa 1,5 % (acima disso, negociar)  
   • Nível 4: administrador (acesso total)
5. Plataforma de cursos (CRUD, vídeo + material):
   • Pagamento Hotmart ou Bitcoin (-25 % desconto)  
   • Curso gratuito de P2P como isca digital (captura de leads)
6. Dashboard administrativo populado com dados mockados (demonstração)
7. Chatbot FAQ com escalonamento para atendimento humano
8. Integração de avaliações Google Maps (link da empresa)
9. Dark Mode com paleta cinza-escura consistente

----------------------------------------------------------------------
4. TECNOLOGIAS E PADRÕES
- Frontend: Next.js 14 + React 18 + TypeScript
- UI: Tailwind CSS
- Backend: Node.js (API Routes do Next.js) e Python (futuro)
- Banco de dados: Supabase (free tier, escalável)
- Autenticação: stack-auth.com + OTP via Resend
- Versionamento: GitHub
- Hospedagem: Vercel (plano gratuito inicial)
- Segurança: OWASP Top 10
- Assistentes de código (IA): MCP Context7 com 5 agentes paralelos ("ultrathink") seguindo padrão único de código

----------------------------------------------------------------------
5. DESIGN E UX
- Referência visual: fort.exchange (credibilidade e organização)
- Abordagem mobile-first; fluxos críticos (KYC e cotação) em poucos cliques
- Dark Mode padrão, tema claro opcional

----------------------------------------------------------------------
6. GOVERNANÇA DO PROJETO
- Salvar este conteúdo como "PROMPT_INICIAL.md"
- Manter arquivo-log de progresso (tarefas, decisões, pendências)
- Otimizar custos e performance usando Supabase e Vercel gratuitos
- Perguntar sempre que houver ambiguidade; só implementar com total clareza
======================================================================