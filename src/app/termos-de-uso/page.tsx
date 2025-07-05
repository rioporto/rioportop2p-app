import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso - Rio Porto P2P',
  description: 'Termos e condições de uso da plataforma Rio Porto P2P para compra e venda de Bitcoin.',
}

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Termos de Uso
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p className="mb-4">
                Ao acessar e usar a plataforma Rio Porto P2P, você concorda em cumprir e estar vinculado 
                aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes 
                termos, não deve usar nossa plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
              <p className="mb-4">
                A Rio Porto P2P é uma plataforma que facilita transações peer-to-peer (P2P) de 
                criptomoedas entre usuários. Nós não custodiamos fundos, apenas facilitamos o 
                encontro entre compradores e vendedores.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Matching de ordens entre compradores e vendedores</li>
                <li>Sistema de escrow para segurança das transações</li>
                <li>Verificação KYC (Know Your Customer) dos usuários</li>
                <li>Suporte técnico e resolução de disputas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Elegibilidade</h2>
              <p className="mb-4">Para usar nossa plataforma, você deve:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Ser legalmente capaz de celebrar contratos vinculativos</li>
                <li>Não estar proibido de usar o serviço sob as leis aplicáveis</li>
                <li>Fornecer informações verdadeiras e precisas durante o cadastro</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Cadastro e Conta</h2>
              <p className="mb-4">
                Para acessar determinados recursos, você deve criar uma conta fornecendo informações 
                precisas e completas. Você é responsável por:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Manter a confidencialidade de sua senha</li>
                <li>Todas as atividades que ocorrem em sua conta</li>
                <li>Notificar imediatamente sobre qualquer uso não autorizado</li>
                <li>Manter suas informações de contato atualizadas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Verificação KYC</h2>
              <p className="mb-4">
                Para garantir a segurança e conformidade regulatória, exigimos verificação de identidade:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Documento de identidade válido (RG ou CNH)</li>
                <li>Comprovante de residência recente</li>
                <li>Selfie para verificação biométrica</li>
                <li>CPF/CNPJ válido e ativo</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Uso Aceitável</h2>
              <p className="mb-4">Você concorda em NÃO usar a plataforma para:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Atividades ilegais ou fraudulentas</li>
                <li>Lavagem de dinheiro ou financiamento ao terrorismo</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Transmitir vírus ou código malicioso</li>
                <li>Manipular preços ou enganar outros usuários</li>
                <li>Criar múltiplas contas para contornar limites</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Taxas e Pagamentos</h2>
              <p className="mb-4">
                A Rio Porto P2P cobra taxas pelos serviços prestados:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Taxa de transação: 1% do valor negociado</li>
                <li>Taxa mínima: R$ 5,00 por transação</li>
                <li>Saques PIX: Gratuitos</li>
                <li>Taxas podem ser alteradas com aviso prévio de 30 dias</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Riscos de Criptomoedas</h2>
              <p className="mb-4">
                Você reconhece e aceita que:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Criptomoedas são voláteis e podem perder valor</li>
                <li>Transações são irreversíveis</li>
                <li>Você é responsável por suas decisões de investimento</li>
                <li>A plataforma não oferece consultoria financeira</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Privacidade e Dados</h2>
              <p className="mb-4">
                Suas informações pessoais são tratadas conforme nossa Política de Privacidade. 
                Ao usar a plataforma, você consente com a coleta e uso de seus dados conforme descrito.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Propriedade Intelectual</h2>
              <p className="mb-4">
                Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones e software, 
                é propriedade da Rio Porto P2P e está protegido por leis de propriedade intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Limitação de Responsabilidade</h2>
              <p className="mb-4">
                A Rio Porto P2P não será responsável por:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Perdas resultantes de flutuações de preço</li>
                <li>Indisponibilidade temporária da plataforma</li>
                <li>Ações de terceiros ou outros usuários</li>
                <li>Perdas indiretas ou consequenciais</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Resolução de Disputas</h2>
              <p className="mb-4">
                Em caso de disputas entre usuários, a Rio Porto P2P oferece um sistema de mediação. 
                Disputas não resolvidas serão submetidas à arbitragem conforme a Lei Brasileira de Arbitragem.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Modificações dos Termos</h2>
              <p className="mb-4">
                Podemos modificar estes termos a qualquer momento. Alterações significativas serão 
                notificadas com 30 dias de antecedência. O uso continuado após as alterações 
                constitui aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Rescisão</h2>
              <p className="mb-4">
                Podemos suspender ou encerrar sua conta se você violar estes termos. Você pode 
                encerrar sua conta a qualquer momento, sujeito à conclusão de transações pendentes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">15. Lei Aplicável</h2>
              <p className="mb-4">
                Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida 
                nos tribunais do Rio de Janeiro, RJ.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">16. Contato</h2>
              <p className="mb-4">
                Para questões sobre estes termos, entre em contato:
              </p>
              <ul className="list-none mb-4">
                <li><strong>Email:</strong> legal@rioporto.com</li>
                <li><strong>Telefone:</strong> +55 21 2018-7776</li>
                <li><strong>Endereço:</strong> Av. Marechal Câmara 160, sala 1107, Centro, Rio de Janeiro - RJ</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}