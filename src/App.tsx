import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout'
import Home from '@/pages/Home'
import Cotacao from '@/pages/Cotacao'
import OTC from '@/pages/OTC'
import KYC from '@/pages/KYC'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="cotacao" element={<Cotacao />} />
          <Route path="otc" element={<OTC />} />
          <Route path="kyc" element={<KYC />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App