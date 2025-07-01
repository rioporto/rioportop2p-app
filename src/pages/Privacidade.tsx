import { Shield, Lock } from 'lucide-react'

export default function Privacidade() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Política de Privacidade</h1>
            </div>
            <p className="text-muted-foreground">
              Última atualização: 15 de dezembro de 2024 | Em conformidade com a LGPD
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-6 mb-8">
              <div className="flex gap-3">
                <Lock className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Seu direito à privacidade
                  </h3>
                  <p className="text-green-800 dark:text-green-200">
                    A Rio Porto P2P está comprometida com a proteção de seus dados pessoais 
                    em total conformidade com a Lei Geral de Proteção de Dados (LGPD).
                  </p>
                </div>
              </div>
            </div>

            <h2>1. Introdução</h2>
            <p>
              Esta Política de Privacidade descreve como a RIO PORTO MEDIAÇÃO LTDA ("Rio Porto P2P", "nós") 
              coleta, usa, armazena e protege suas informações pessoais. Ao utilizar nossos serviços, 
              você concorda com as práticas descritas nesta política.
            </p>

            <h2>2. Dados que Coletamos</h2>
            <h3>2.1. Dados de Identificação</h3>
            <ul>
              <li>Nome completo</li>
              <li>CPF ou CNPJ</li>
              <li>Data de nascimento</li>
              <li>Endereço residencial ou comercial</li>
              <li>Telefone e e-mail</li>
            </ul>

            <h3>2.2. Dados de Verificação (KYC)</h3>
            <ul>
              <li>Documentos de identidade (RG, CNH)</li>
              <li>Comprovante de residência</li>
              <li>Selfie com documento</li>
              <li>Comprovante de renda (níveis 2 e 3)</li>
              <li>Declaração de Imposto de Renda (nível 3)</li>
            </ul>

            <h3>2.3. Dados Transacionais</h3>
            <ul>
              <li>Histórico de operações</li>
              <li>Valores transacionados</li>
              <li>Endereços de carteiras Bitcoin</li>
              <li>Dados bancários para PIX</li>
            </ul>

            <h3>2.4. Dados de Navegação</h3>
            <ul>
              <li>Endereço IP</li>
              <li>Tipo de navegador</li>
              <li>Páginas visitadas</li>
              <li>Tempo de permanência</li>
              <li>Cookies (mediante consentimento)</li>
            </ul>

            <h2>3. Base Legal para Tratamento</h2>
            <p>
              Tratamos seus dados pessoais com base nas seguintes bases legais previstas na LGPD:
            </p>
            <ul>
              <li><strong>Execução de contrato:</strong> Para fornecer nossos serviços de intermediação</li>
              <li><strong>Cumprimento de obrigação legal:</strong> Para atender regulamentações contra lavagem de dinheiro</li>
              <li><strong>Consentimento:</strong> Para comunicações de marketing e uso de cookies</li>
              <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços e prevenir fraudes</li>
            </ul>

            <h2>4. Como Usamos seus Dados</h2>
            <p>Utilizamos suas informações para:</p>
            <ul>
              <li>Processar suas operações de compra e venda</li>
              <li>Verificar sua identidade (KYC)</li>
              <li>Prevenir fraudes e lavagem de dinheiro</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Enviar comunicações sobre suas transações</li>
              <li>Melhorar nossos produtos e serviços</li>
              <li>Fornecer suporte ao cliente</li>
              <li>Enviar conteúdo educacional (com consentimento)</li>
            </ul>

            <h2>5. Compartilhamento de Dados</h2>
            <p>
              Não vendemos, alugamos ou comercializamos seus dados pessoais. 
              Compartilhamos informações apenas:
            </p>
            <ul>
              <li>Com autoridades governamentais quando exigido por lei</li>
              <li>Com prestadores de serviços essenciais (processamento de pagamento, verificação de identidade)</li>
              <li>Para prevenir fraudes ou atividades ilegais</li>
              <li>Com seu consentimento explícito</li>
            </ul>

            <h2>6. Armazenamento e Segurança</h2>
            <p>
              Implementamos medidas técnicas e organizacionais para proteger seus dados:
            </p>
            <ul>
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Acesso restrito baseado em necessidade</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares e plano de recuperação</li>
              <li>Treinamento de equipe em proteção de dados</li>
            </ul>
            <p>
              Seus dados são armazenados em servidores seguros e mantidos apenas pelo 
              tempo necessário para cumprir as finalidades descritas ou conforme exigido por lei.
            </p>

            <h2>7. Seus Direitos (LGPD)</h2>
            <p>
              Conforme a LGPD, você tem direito a:
            </p>
            <ul>
              <li><strong>Confirmação:</strong> Saber se tratamos seus dados pessoais</li>
              <li><strong>Acesso:</strong> Obter cópia dos dados que temos sobre você</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou desatualizados</li>
              <li><strong>Anonimização ou bloqueio:</strong> De dados desnecessários ou excessivos</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Eliminação:</strong> Solicitar exclusão de dados pessoais</li>
              <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se a tratamentos realizados</li>
            </ul>

            <h2>8. Retenção de Dados</h2>
            <p>
              Mantemos seus dados pelo período necessário para:
            </p>
            <ul>
              <li>Fornecer nossos serviços</li>
              <li>Cumprir obrigações legais (mínimo 5 anos para dados financeiros)</li>
              <li>Resolver disputas e fazer cumprir nossos acordos</li>
              <li>Atender solicitações de autoridades competentes</li>
            </ul>

            <h2>9. Dados de Menores</h2>
            <p>
              Nossos serviços não são direcionados a menores de 18 anos. 
              Não coletamos conscientemente informações de menores de idade. 
              Se tomarmos conhecimento de tal coleta, excluiremos os dados imediatamente.
            </p>

            <h2>10. Cookies e Tecnologias Similares</h2>
            <p>
              Utilizamos cookies para:
            </p>
            <ul>
              <li>Manter sua sessão ativa</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar o uso do site (analytics)</li>
              <li>Melhorar sua experiência de navegação</li>
            </ul>
            <p>
              Você pode gerenciar cookies através das configurações do seu navegador. 
              Note que desabilitar cookies pode afetar funcionalidades do site.
            </p>

            <h2>11. Transferência Internacional</h2>
            <p>
              Seus dados podem ser processados em servidores localizados fora do Brasil. 
              Nesses casos, garantimos que os dados sejam protegidos conforme os padrões 
              da LGPD através de cláusulas contratuais apropriadas.
            </p>

            <h2>12. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças 
              significativas através de nosso site ou e-mail. A data da última atualização 
              será sempre indicada no topo desta página.
            </p>

            <h2>13. Encarregado de Proteção de Dados (DPO)</h2>
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de seus dados, 
              entre em contato com nosso Encarregado de Proteção de Dados:
            </p>
            <ul>
              <li><strong>E-mail:</strong> privacidade@rioportop2p.com.br</li>
              <li><strong>WhatsApp:</strong> +55 21 2018-7776</li>
              <li><strong>Correio:</strong> Av. Marechal Câmara 160, sala 1107, Centro, Rio de Janeiro - RJ, CEP 20020-907</li>
            </ul>

            <h2>14. Autoridade Nacional de Proteção de Dados</h2>
            <p>
              Você também pode entrar em contato com a Autoridade Nacional de Proteção de Dados (ANPD) 
              para fazer reclamações sobre o tratamento de seus dados pessoais:
            </p>
            <p>
              <strong>Site:</strong> www.gov.br/anpd
            </p>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <p className="text-center text-sm text-muted-foreground">
                Esta Política de Privacidade é parte integrante dos nossos Termos de Uso.
                <br />
                Última revisão: 15 de dezembro de 2024
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}