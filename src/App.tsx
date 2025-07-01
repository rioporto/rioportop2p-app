import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout'
import Home from '@/pages/Home'
import Cotacao from '@/pages/Cotacao'
import OTC from '@/pages/OTC'
import KYC from '@/pages/KYC'
import Blog from '@/pages/Blog'
import Cursos from '@/pages/Cursos'
import FAQ from '@/pages/FAQ'
import Sobre from '@/pages/Sobre'
import Contato from '@/pages/Contato'
import Termos from '@/pages/Termos'
import Privacidade from '@/pages/Privacidade'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="cotacao" element={<Cotacao />} />
          <Route path="otc" element={<OTC />} />
          <Route path="kyc" element={<KYC />} />
          <Route path="blog" element={<Blog />} />
          <Route path="cursos" element={<Cursos />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="contato" element={<Contato />} />
          <Route path="termos" element={<Termos />} />
          <Route path="privacidade" element={<Privacidade />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App