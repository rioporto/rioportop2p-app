export default function TermosDeUso() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
        <h1>Termos de Uso - Rio Porto P2P</h1>
        <p className="text-gray-600 dark:text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao acessar e utilizar a plataforma Rio Porto P2P, você concorda com estes Termos de Uso. 
          Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
        </p>

        <h2>2. Descrição dos Serviços</h2>
        <p>
          A Rio Porto P2P é uma plataforma de intermediação para compra e venda de criptomoedas, 
          facilitando transações peer-to-peer (P2P) entre usuários.
        </p>

        <h2>3. Elegibilidade</h2>
        <ul>
          <li>Você deve ter pelo menos 18 anos de idade</li>
          <li>Deve fornecer informações verdadeiras e precisas</li>
          <li>Deve cumprir com os requisitos KYC (Know Your Customer)</li>
          <li>Não pode usar a plataforma para atividades ilegais</li>
        </ul>

        <h2>4. Cadastro e Conta</h2>
        <p>
          Para utilizar nossos serviços, você deve:
        </p>
        <ul>
          <li>Criar uma conta fornecendo informações precisas</li>
          <li>Manter a segurança de suas credenciais</li>
          <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
          <li>Completar o processo de verificação KYC conforme seu nível desejado</li>
        </ul>

        <h2>5. Níveis KYC</h2>
        <h3>Nível 1 - Básico</h3>
        <ul>
          <li>Nome completo e email</li>
          <li>Limite: até R$ 1.000/mês</li>
        </ul>
        
        <h3>Nível 2 - Intermediário</h3>
        <ul>
          <li>Documentos de identidade</li>
          <li>Comprovante de residência</li>
          <li>Limite: até R$ 50.000/mês</li>
        </ul>
        
        <h3>Nível 3 - Avançado</h3>
        <ul>
          <li>Verificação completa</li>
          <li>Comprovante de renda</li>
          <li>Sem limites</li>
        </ul>

        <h2>6. Taxas e Comissões</h2>
        <p>Nossa estrutura de taxas é baseada no volume de transação:</p>
        <ul>
          <li>Até R$ 1.000: 3,5%</li>
          <li>R$ 1.001 - R$ 5.000: 3,0%</li>
          <li>R$ 5.001 - R$ 10.000: 2,5%</li>
          <li>R$ 10.001 - R$ 50.000: 2,0%</li>
          <li>Acima de R$ 50.000: 1,5%</li>
        </ul>

        <h2>7. Responsabilidades do Usuário</h2>
        <p>Você é responsável por:</p>
        <ul>
          <li>Garantir a legalidade de suas transações</li>
          <li>Pagar todos os impostos aplicáveis</li>
          <li>Manter suas informações atualizadas</li>
          <li>Não usar a plataforma para lavagem de dinheiro ou financiamento ao terrorismo</li>
        </ul>

        <h2>8. Limitação de Responsabilidade</h2>
        <p>
          A Rio Porto P2P atua apenas como intermediária e não se responsabiliza por:
        </p>
        <ul>
          <li>Volatilidade dos preços das criptomoedas</li>
          <li>Perdas decorrentes de decisões de investimento</li>
          <li>Problemas técnicos fora de nosso controle</li>
          <li>Ações de terceiros</li>
        </ul>

        <h2>9. Privacidade e Proteção de Dados</h2>
        <p>
          Seus dados são tratados conforme nossa Política de Privacidade e em conformidade com a LGPD 
          (Lei Geral de Proteção de Dados).
        </p>

        <h2>10. Suspensão e Encerramento</h2>
        <p>
          Podemos suspender ou encerrar sua conta se:
        </p>
        <ul>
          <li>Você violar estes termos</li>
          <li>Fornecer informações falsas</li>
          <li>Usar a plataforma para atividades ilegais</li>
          <li>A pedido de autoridades competentes</li>
        </ul>

        <h2>11. Alterações nos Termos</h2>
        <p>
          Reservamo-nos o direito de alterar estes termos a qualquer momento. 
          Alterações significativas serão notificadas por email.
        </p>

        <h2>12. Lei Aplicável e Foro</h2>
        <p>
          Estes termos são regidos pelas leis brasileiras. 
          O foro da comarca do Rio de Janeiro - RJ é competente para dirimir quaisquer controvérsias.
        </p>

        <h2>13. Contato</h2>
        <p>
          Para dúvidas sobre estes termos, entre em contato:
        </p>
        <ul>
          <li>WhatsApp: +55 21 2018-7776</li>
          <li>Email: contato@rioportop2p.com.br</li>
          <li>CNPJ: XX.XXX.XXX/0001-XX</li>
        </ul>

        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-center font-semibold">
            RIO PORTO MEDIAÇÃO LTDA<br />
            Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}