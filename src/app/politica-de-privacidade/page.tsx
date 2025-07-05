import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade - Rio Porto P2P',
  description: 'Política de privacidade e proteção de dados da plataforma Rio Porto P2P.',
}

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p className="mb-4">
                A Rio Porto P2P ("nós", "nosso" ou "Empresa") está comprometida em proteger sua 
                privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos 
                e protegemos suas informações quando você usa nossa plataforma.
              </p>
              <p className="mb-4">
                Ao usar nossos serviços, você concorda com a coleta e uso de informações de acordo 
                com esta política. Esta política está em conformidade com a Lei Geral de Proteção 
                de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Informações Fornecidas por Você</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Dados de Cadastro:</strong> Nome completo, CPF/CNPJ, data de nascimento, endereço, telefone, e-mail</li>
                <li><strong>Dados de Verificação:</strong> Documentos de identidade, comprovante de residência, selfie</li>
                <li><strong>Dados Financeiros:</strong> Informações bancárias, chaves PIX, histórico de transações</li>
                <li><strong>Comunicações:</strong> Mensagens de suporte, feedback, avaliações</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Informações Coletadas Automaticamente</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Dados de Uso:</strong> Páginas visitadas, tempo de acesso, ações realizadas</li>
                <li><strong>Dados do Dispositivo:</strong> Endereço IP, tipo de navegador, sistema operacional</li>
                <li><strong>Cookies:</strong> Identificadores únicos para melhorar sua experiência</li>
                <li><strong>Localização:</strong> Dados gerais de localização baseados em IP</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Como Usamos Suas Informações</h2>
              <p className="mb-4">Utilizamos suas informações para:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Processar transações e enviar notificações relacionadas</li>
                <li>Verificar sua identidade e prevenir fraudes</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Responder a solicitações de suporte</li>
                <li>Enviar comunicações de marketing (com seu consentimento)</li>
                <li>Analisar uso da plataforma e melhorar a experiência</li>
                <li>Proteger direitos e segurança dos usuários</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Base Legal para Processamento</h2>
              <p className="mb-4">
                Processamos seus dados pessoais com base nas seguintes bases legais da LGPD:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Consentimento:</strong> Para marketing e comunicações promocionais</li>
                <li><strong>Execução de Contrato:</strong> Para fornecer nossos serviços</li>
                <li><strong>Obrigação Legal:</strong> Para cumprir leis de prevenção à lavagem de dinheiro</li>
                <li><strong>Legítimo Interesse:</strong> Para melhorar serviços e prevenir fraudes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Compartilhamento de Informações</h2>
              <p className="mb-4">
                Podemos compartilhar suas informações com:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Outros Usuários:</strong> Nome e informações de contato durante transações</li>
                <li><strong>Prestadores de Serviços:</strong> Processadores de pagamento, verificação de identidade</li>
                <li><strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial</li>
                <li><strong>Parceiros de Negócios:</strong> Com seu consentimento expresso</li>
              </ul>
              <p className="mb-4">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros 
                para fins de marketing sem seu consentimento explícito.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Segurança dos Dados</h2>
              <p className="mb-4">
                Implementamos medidas técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso baseados em função</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Auditorias regulares de segurança</li>
                <li>Treinamento de funcionários em proteção de dados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
              <p className="mb-4">
                Retemos suas informações pelo tempo necessário para:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fornecer nossos serviços</li>
                <li>Cumprir obrigações legais (mínimo 5 anos para dados financeiros)</li>
                <li>Resolver disputas e fazer cumprir acordos</li>
                <li>Atender solicitações de exclusão conforme a LGPD</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Seus Direitos (LGPD)</h2>
              <p className="mb-4">
                Conforme a LGPD, você tem direito a:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Confirmação e Acesso:</strong> Saber se processamos seus dados e acessá-los</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos ou desatualizados</li>
                <li><strong>Anonimização ou Bloqueio:</strong> De dados desnecessários ou excessivos</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Eliminação:</strong> Solicitar exclusão de dados pessoais</li>
                <li><strong>Informação:</strong> Sobre entidades com quem compartilhamos dados</li>
                <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> Se opor a processamento em certas situações</li>
              </ul>
              <p className="mb-4">
                Para exercer seus direitos, entre em contato: privacidade@rioporto.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Cookies e Tecnologias Similares</h2>
              <p className="mb-4">
                Usamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Manter você conectado à plataforma</li>
                <li>Entender como você usa nossos serviços</li>
                <li>Personalizar sua experiência</li>
                <li>Medir eficácia de campanhas</li>
              </ul>
              <p className="mb-4">
                Você pode controlar cookies através das configurações do navegador, mas isso pode 
                afetar a funcionalidade da plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Transferências Internacionais</h2>
              <p className="mb-4">
                Seus dados podem ser transferidos e processados em servidores localizados fora do 
                Brasil. Garantimos que tais transferências cumpram os requisitos da LGPD, incluindo 
                cláusulas contratuais padrão ou outros mecanismos apropriados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Menores de Idade</h2>
              <p className="mb-4">
                Nossos serviços não são direcionados a menores de 18 anos. Não coletamos 
                intencionalmente informações de menores. Se tomarmos conhecimento de que coletamos 
                dados de um menor, tomaremos medidas para excluir essas informações.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Alterações nesta Política</h2>
              <p className="mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre 
                alterações significativas por e-mail ou aviso em nossa plataforma. Recomendamos 
                revisar esta política regularmente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Encarregado de Proteção de Dados</h2>
              <p className="mb-4">
                Nomeamos um Encarregado de Proteção de Dados (DPO) conforme a LGPD:
              </p>
              <ul className="list-none mb-4">
                <li><strong>Nome:</strong> [A ser nomeado]</li>
                <li><strong>Email:</strong> dpo@rioporto.com</li>
                <li><strong>Telefone:</strong> +55 21 2018-7776</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Contato</h2>
              <p className="mb-4">
                Para questões sobre esta política ou suas informações pessoais:
              </p>
              <ul className="list-none mb-4">
                <li><strong>Email Geral:</strong> privacidade@rioporto.com</li>
                <li><strong>DPO:</strong> dpo@rioporto.com</li>
                <li><strong>Endereço:</strong> Av. Marechal Câmara 160, sala 1107, Centro, Rio de Janeiro - RJ, CEP: 20020-080</li>
                <li><strong>CNPJ:</strong> 11.741.563/0001-57</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">15. Autoridade Nacional de Proteção de Dados</h2>
              <p className="mb-4">
                Você tem o direito de registrar reclamação junto à ANPD:
              </p>
              <ul className="list-none mb-4">
                <li><strong>Website:</strong> www.gov.br/anpd</li>
                <li><strong>Email:</strong> encarregado@anpd.gov.br</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}