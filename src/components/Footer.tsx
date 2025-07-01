import { Link } from 'react-router-dom'
import { Bitcoin, Phone, MapPin, Building } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bitcoin className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Rio Porto P2P</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Facilitando a compra e venda de Bitcoin com praticidade e segurança.
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                <strong>CNPJ:</strong> 11.741.563/0001-57
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Razão Social:</strong> RIO PORTO MEDIAÇÃO LTDA
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cotacao" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cotação P2P
                </Link>
              </li>
              <li>
                <Link to="/otc" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  OTC - Grandes Volumes
                </Link>
              </li>
              <li>
                <Link to="/kyc" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Verificação KYC
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Serviços</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Compra e Venda de Bitcoin</li>
              <li className="text-sm text-muted-foreground">Operações OTC</li>
              <li className="text-sm text-muted-foreground">Consultoria Cripto</li>
              <li className="text-sm text-muted-foreground">Cursos e Treinamentos</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Av. Marechal Câmara 160, sala 1107<br />
                  Centro, Rio de Janeiro - RJ<br />
                  CEP: 20020-907
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="https://wa.me/5521201877776" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +55 21 2018-7776
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  CNAE: 66.19-3-99
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Rio Porto Mediação LTDA. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            <Link to="/termos" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}