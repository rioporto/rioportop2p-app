'use client';

import { GoogleMap } from '@/components/GoogleMap';
import { GoogleReviews } from '@/components/GoogleReviews';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { useWhatsApp } from '@/lib/whatsapp';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContatoPage() {
  const { numbers, templates } = useWhatsApp();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Entre em Contato</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Informações de Contato */}
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Informações de Contato</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Telefone/WhatsApp</p>
                  <p className="text-gray-600 dark:text-gray-400">+55 21 2018-7776</p>
                  <WhatsAppButton
                    phone={numbers.main}
                    message={templates.generalSupport()}
                    className="mt-2 text-primary hover:underline text-sm"
                  >
                    Enviar mensagem via WhatsApp
                  </WhatsAppButton>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600 dark:text-gray-400">contato@rioportop2p.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Endereço</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Rio de Janeiro - RJ<br />
                    Brasil
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Horário de Atendimento</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Segunda a Sexta: 9h às 18h<br />
                    Sábado: 9h às 13h<br />
                    Domingo: Fechado
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="mt-8 space-y-3">
              <WhatsAppButton
                phone={numbers.sales}
                message={templates.buyBitcoin(1000, 250000)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors justify-center"
              >
                <Phone className="w-5 h-5" />
                Quero Comprar Bitcoin
              </WhatsAppButton>

              <WhatsAppButton
                phone={numbers.sales}
                message={templates.sellBitcoin(1000, 250000)}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors justify-center"
              >
                <Phone className="w-5 h-5" />
                Quero Vender Bitcoin
              </WhatsAppButton>

              <WhatsAppButton
                phone={numbers.support}
                message={templates.generalSupport()}
                className="w-full border border-gray-300 dark:border-gray-600 py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors justify-center"
              >
                <Phone className="w-5 h-5" />
                Suporte Geral
              </WhatsAppButton>
            </div>
          </div>

          {/* Mapa */}
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Nossa Localização</h2>
            <GoogleMap 
              center={{ lat: -22.9068, lng: -43.1729 }}
              zoom={15}
              height="400px"
              markerTitle="Rio Porto P2P"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              * Atendimento presencial apenas com agendamento prévio
            </p>
          </div>
        </div>

        {/* Avaliações do Google */}
        <GoogleReviews placeId="ChIJfbBquYSBmQARFwAerehRUew" />

        {/* FAQ Rápido */}
        <div className="mt-12 bg-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Como funciona a compra de Bitcoin?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Entre em contato via WhatsApp, informe o valor desejado, receba a cotação e realize o pagamento. 
                Após confirmação, o Bitcoin é enviado para sua carteira.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Quais formas de pagamento são aceitas?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aceitamos PIX, TED, transferência bancária e dinheiro em espécie (para atendimento presencial).
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">É seguro?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sim! Somos uma empresa registrada, com CNPJ e seguimos todas as regulamentações brasileiras. 
                Além disso, temos centenas de avaliações positivas no Google.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Qual o valor mínimo para transação?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                O valor mínimo é R$ 100,00 e o máximo é R$ 50.000,00. 
                Para valores acima, oferecemos nosso serviço OTC especializado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}