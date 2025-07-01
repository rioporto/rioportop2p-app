import { ScrollText, AlertCircle } from 'lucide-react'

export default function Termos() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <ScrollText className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Termos de Uso</h1>
            </div>
            <p className="text-muted-foreground">
              Última atualização: 15 de dezembro de 2024
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-6 mb-8">
              <div className="flex gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Importante
                  </h3>
                  <p className="text-amber-800 dark:text-amber-200">
                    Ao utilizar os serviços da Rio Porto P2P, você concorda com estes termos. 
                    Leia atentamente antes de realizar qualquer operação.
                  </p>
                </div>
              </div>
            </div>

            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar os serviços da RIO PORTO MEDIAÇÃO LTDA ("Rio Porto P2P", "nós", "nosso"), 
              você aceita e concorda em cumprir estes Termos de Uso. Se você não concordar com qualquer 
              parte destes termos, não deve usar nossos serviços.
            </p>

            <h2>2. Descrição dos Serviços</h2>
            <p>
              A Rio Porto P2P oferece serviços de intermediação para compra e venda de criptomoedas, 
              principalmente Bitcoin, operando no modelo peer-to-peer (P2P). Nossos serviços incluem:
            </p>
            <ul>
              <li>Cotação de preços para compra e venda de Bitcoin</li>
              <li>Intermediação de transações entre compradores e vendedores</li>
              <li>Verificação KYC (Know Your Customer) para segurança das operações</li>
              <li>Suporte educacional através de cursos e conteúdo</li>
              <li>Atendimento personalizado via WhatsApp</li>
            </ul>

            <h2>3. Elegibilidade</h2>
            <p>Para utilizar nossos serviços, você deve:</p>
            <ul>
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Ser legalmente capaz de celebrar contratos vinculativos</li>
              <li>Não estar impedido de usar nossos serviços por qualquer lei aplicável</li>
              <li>Fornecer informações verdadeiras e precisas durante o cadastro</li>
              <li>Manter suas informações de conta atualizadas</li>
            </ul>

            <h2>4. Processo KYC e Verificação</h2>
            <p>
              Para garantir a segurança e conformidade regulatória, implementamos um processo KYC em três níveis:
            </p>
            <ul>
              <li><strong>Nível 1:</strong> Verificação básica para operações até R$ 4.999/mês</li>
              <li><strong>Nível 2:</strong> Verificação intermediária para operações até R$ 50.000/mês</li>
              <li><strong>Nível 3:</strong> Verificação completa para operações até R$ 100.000/mês</li>
            </ul>
            <p>
              Você concorda em fornecer todos os documentos solicitados e autoriza a verificação 
              de suas informações. A recusa ou falsificação de informações resultará na suspensão 
              ou encerramento da conta.
            </p>

            <h2>5. Taxas e Pagamentos</h2>
            <p>
              As taxas aplicáveis são claramente informadas antes de cada operação e variam 
              conforme seu nível de verificação KYC:
            </p>
            <ul>
              <li>Nível 1: 3,5% por operação</li>
              <li>Nível 2: 2,5% por operação</li>
              <li>Nível 3: 1,5% por operação</li>
              <li>OTC (grandes volumes): taxas negociáveis</li>
            </ul>
            <p>
              Pagamentos são aceitos exclusivamente via PIX. Todas as transações são finais e 
              não reembolsáveis, exceto em casos específicos determinados pela empresa.
            </p>

            <h2>6. Responsabilidades do Usuário</h2>
            <p>Ao usar nossos serviços, você concorda em:</p>
            <ul>
              <li>Não usar os serviços para atividades ilegais ou fraudulentas</li>
              <li>Não tentar manipular preços ou realizar operações fictícias</li>
              <li>Proteger suas credenciais de acesso e carteira de criptomoedas</li>
              <li>Verificar cuidadosamente os endereços de carteira antes de enviar transações</li>
              <li>Cumprir todas as leis e regulamentações aplicáveis</li>
              <li>Pagar todos os impostos devidos sobre suas operações</li>
            </ul>

            <h2>7. Riscos de Criptomoedas</h2>
            <p>
              Você reconhece e aceita que:
            </p>
            <ul>
              <li>Criptomoedas são ativos voláteis e de alto risco</li>
              <li>Preços podem variar significativamente em curtos períodos</li>
              <li>Transações em blockchain são irreversíveis</li>
              <li>A perda de chaves privadas resulta em perda permanente dos ativos</li>
              <li>A Rio Porto P2P não é responsável por perdas decorrentes de erros do usuário</li>
            </ul>

            <h2>8. Limitação de Responsabilidade</h2>
            <p>
              A Rio Porto P2P não será responsável por:
            </p>
            <ul>
              <li>Perdas resultantes de flutuações de preço</li>
              <li>Erros do usuário ao informar endereços de carteira</li>
              <li>Problemas técnicos na rede blockchain</li>
              <li>Ações de terceiros, incluindo hackers ou fraudadores</li>
              <li>Perdas indiretas, incidentais ou consequenciais</li>
            </ul>

            <h2>9. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo disponível em nossa plataforma, incluindo textos, gráficos, logos, 
              ícones, imagens e software, é propriedade da Rio Porto P2P ou de seus licenciadores 
              e está protegido por leis de direitos autorais.
            </p>

            <h2>10. Privacidade e Proteção de Dados</h2>
            <p>
              O tratamento de seus dados pessoais é regido por nossa Política de Privacidade, 
              que faz parte integrante destes Termos de Uso. Cumprimos integralmente a Lei Geral 
              de Proteção de Dados (LGPD).
            </p>

            <h2>11. Suspensão e Encerramento</h2>
            <p>
              Reservamo-nos o direito de suspender ou encerrar sua conta a qualquer momento se:
            </p>
            <ul>
              <li>Você violar estes Termos de Uso</li>
              <li>Fornecer informações falsas ou enganosas</li>
              <li>Engajar-se em atividades fraudulentas ou ilegais</li>
              <li>Por determinação judicial ou regulatória</li>
            </ul>

            <h2>12. Alterações nos Termos</h2>
            <p>
              Podemos atualizar estes Termos de Uso periodicamente. Notificaremos sobre mudanças 
              significativas através de nosso site ou por e-mail. O uso continuado dos serviços 
              após as alterações constitui aceitação dos novos termos.
            </p>

            <h2>13. Lei Aplicável e Foro</h2>
            <p>
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
              Fica eleito o foro da Comarca do Rio de Janeiro, Estado do Rio de Janeiro, 
              para dirimir quaisquer questões oriundas destes termos.
            </p>

            <h2>14. Contato</h2>
            <p>
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <ul>
              <li><strong>Empresa:</strong> RIO PORTO MEDIAÇÃO LTDA</li>
              <li><strong>CNPJ:</strong> 11.741.563/0001-57</li>
              <li><strong>Endereço:</strong> Av. Marechal Câmara 160, sala 1107, Centro, Rio de Janeiro - RJ</li>
              <li><strong>WhatsApp:</strong> +55 21 2018-7776</li>
            </ul>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <p className="text-center text-sm text-muted-foreground">
                Ao usar nossos serviços, você confirma que leu, entendeu e concorda com estes Termos de Uso.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}