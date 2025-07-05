'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Cotação P2P', href: '/cotacao-p2p' },
    { name: 'OTC', href: '/otc' },
    { name: 'KYC', href: '/kyc' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Help', href: '/help' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' }
  ];

  const legalLinks = [
    { name: 'Termos de Uso', href: '/termos-de-uso' },
    { name: 'Política de Privacidade', href: '/politica-de-privacidade' },
    { name: 'Acessibilidade', href: '/configuracoes/acessibilidade' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Seção da Empresa */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-xl font-bold text-white">Rio Porto P2P</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">CNPJ</p>
                  <p>11.741.563/0001-57</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="flex items-center space-x-1 text-sm hover:text-white transition-colors duration-200"
                  >
                    <ChevronRight className="w-3 h-3" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informações de Contato */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <address className="text-sm not-italic">
                  Av. Marechal Câmara 160, sala 1107<br />
                  Centro, Rio de Janeiro - RJ
                </address>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a 
                  href="https://wa.me/552120187776"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>+55 21 2018-7776</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Links Legais */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <p className="text-sm text-center sm:text-left">
                © {currentYear} Todos os direitos reservados.
              </p>
              {/* Redes Sociais */}
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/rioportop2p"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/RioPortoP2P/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Twitter/X"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/rioportop2p/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="flex space-x-6">
              <Link 
                href="/termos-de-uso" 
                className="text-sm hover:text-white transition-colors duration-200"
              >
                Termos
              </Link>
              <Link 
                href="/politica-de-privacidade" 
                className="text-sm hover:text-white transition-colors duration-200"
              >
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;