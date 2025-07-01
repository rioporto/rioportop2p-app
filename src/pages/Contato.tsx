import { useState } from 'react'
import { MapPin, Phone, Clock, MessageCircle, Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria a lógica de envio
    console.log('Formulário enviado:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      const match = numbers.match(/^(\d{2})(\d{5})(\d{4})$/)
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`
      }
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData({
      ...formData,
      telefone: formatted
    })
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <MessageCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl text-muted-foreground">
              Nossa equipe está pronta para ajudar você. Escolha o canal 
              de sua preferência e fale conosco.
            </p>
          </div>
        </div>
      </section>

      {/* Contatos Rápidos */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Atendimento rápido e direto
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://wa.me/5521201877776" target="_blank" rel="noopener noreferrer">
                  +55 21 2018-7776
                </a>
              </Button>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Telefone</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Ligação direta
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+5521201877776">
                  +55 21 2018-7776
                </a>
              </Button>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Horário</h3>
              <p className="text-sm text-muted-foreground">
                Segunda a Sexta: 9h às 18h<br />
                Sábado: 9h às 13h
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário e Informações */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Formulário */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Envie sua Mensagem</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome completo *</Label>
                      <Input
                        id="nome"
                        name="nome"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telefone">WhatsApp/Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={handlePhoneChange}
                      placeholder="(21) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="assunto">Assunto *</Label>
                    <select
                      id="assunto"
                      name="assunto"
                      required
                      value={formData.assunto}
                      onChange={handleChange}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="duvidas">Dúvidas sobre operações</option>
                      <option value="kyc">Verificação KYC</option>
                      <option value="otc">Operações OTC</option>
                      <option value="suporte">Suporte técnico</option>
                      <option value="cursos">Informações sobre cursos</option>
                      <option value="parceria">Proposta de parceria</option>
                      <option value="outro">Outro assunto</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="mensagem">Mensagem *</Label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      required
                      value={formData.mensagem}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Descreva como podemos ajudar..."
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensagem
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Ao enviar este formulário, você concorda com nossa{' '}
                    <a href="/privacidade" className="text-primary hover:underline">
                      Política de Privacidade
                    </a>
                  </p>
                </form>
              </div>

              {/* Informações */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Endereço</h3>
                        <p className="text-sm text-muted-foreground">
                          Av. Marechal Câmara 160, sala 1107<br />
                          Centro, Rio de Janeiro - RJ<br />
                          CEP: 20020-907
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Telefones</h3>
                        <p className="text-sm text-muted-foreground">
                          WhatsApp: +55 21 2018-7776<br />
                          Telefone: +55 21 2018-7776
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Horário de Atendimento</h3>
                        <p className="text-sm text-muted-foreground">
                          Segunda a Sexta: 9h às 18h<br />
                          Sábado: 9h às 13h<br />
                          Domingo e Feriados: Fechado
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">E-mail</h3>
                        <p className="text-sm text-muted-foreground">
                          Para contato via e-mail, use o formulário ao lado.<br />
                          Respondemos em até 24 horas úteis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mapa */}
                <div>
                  <h3 className="font-semibold mb-4">Localização</h3>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Mapa do Google Maps</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <a 
                      href="https://maps.google.com/?q=Av.+Marechal+Câmara+160,+sala+1107,+Centro,+Rio+de+Janeiro+-+RJ" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Ver no Google Maps
                    </a>
                  </Button>
                </div>

                {/* FAQ Rápido */}
                <div className="bg-muted rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Perguntas Frequentes</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Qual o melhor canal para operações?</strong><br />
                      <span className="text-muted-foreground">WhatsApp para resposta imediata</span>
                    </li>
                    <li className="pt-2">
                      <strong>Vocês atendem presencialmente?</strong><br />
                      <span className="text-muted-foreground">Sim, mediante agendamento prévio</span>
                    </li>
                    <li className="pt-2">
                      <strong>Atendem fora do horário comercial?</strong><br />
                      <span className="text-muted-foreground">Operações OTC têm atendimento especial</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="py-20 bg-green-50 dark:bg-green-950/10">
        <div className="container mx-auto px-4 text-center">
          <MessageCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Prefere um Atendimento Mais Rápido?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Fale conosco agora mesmo pelo WhatsApp
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
            <a href="https://wa.me/5521201877776" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Iniciar Conversa no WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}