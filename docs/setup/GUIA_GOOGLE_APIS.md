# Guia de Configuração - Google Maps e Analytics

## 1. Google Maps API

### Passo 1: Acessar o Console
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Faça login com sua conta Google

### Passo 2: Criar Projeto
1. No topo, clique em "Select a project" → "New Project"
2. Nome do projeto: `Rio Porto P2P`
3. Clique em "Create"
4. Aguarde a criação (cerca de 30 segundos)

### Passo 3: Ativar APIs Necessárias
1. No menu lateral, vá em "APIs & Services" → "Library"
2. Procure e ative estas APIs:
   - **Maps JavaScript API** (para mostrar mapa)
   - **Places API** (para buscar lugares e reviews)
   - **Geocoding API** (opcional, para converter endereços)

### Passo 4: Criar Credenciais
1. Vá em "APIs & Services" → "Credentials"
2. Clique em "+ CREATE CREDENTIALS" → "API Key"
3. A chave será criada automaticamente

### Passo 5: Configurar Restrições (IMPORTANTE!)
1. Clique na API Key criada
2. Em "Application restrictions":
   - Selecione "HTTP referrers (web sites)"
3. Em "Website restrictions", adicione:
   ```
   https://rioportop2p-app.vercel.app/*
   https://*.vercel.app/*
   http://localhost:3000/*
   http://localhost:*
   ```
4. Em "API restrictions":
   - Selecione "Restrict key"
   - Marque apenas: Maps JavaScript API, Places API
5. Clique em "SAVE"

### Passo 6: Copiar a Chave
Sua chave aparecerá como: `AIzaSy...` (começa com AIza)

### Adicionar no .env.local:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza[sua-chave-aqui]
```

## 2. Google Analytics 4

### Passo 1: Criar Conta
1. Acesse [analytics.google.com](https://analytics.google.com)
2. Clique em "Start measuring"

### Passo 2: Configurar Conta
1. **Account setup**:
   - Account name: `Rio Porto`
   - Marque todas as opções de compartilhamento
2. **Property setup**:
   - Property name: `Rio Porto P2P`
   - Timezone: `(GMT-03:00) Brazil Time`
   - Currency: `Brazilian Real (R$)`

### Passo 3: Detalhes do Negócio
1. Industry category: `Finance`
2. Business size: Selecione o apropriado
3. Como pretende usar: Marque todas relevantes

### Passo 4: Criar Data Stream
1. Plataforma: "Web"
2. Website URL: `https://rioportop2p-app.vercel.app`
3. Stream name: `Rio Porto P2P Web`
4. Enhanced measurement: Deixe TUDO ativado

### Passo 5: Obter Measurement ID
Após criar, você verá:
- **Measurement ID**: `G-XXXXXXXXXX`
- **Stream ID**: (número longo)

### Adicionar no .env.local:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 3. Implementação no Código

### Google Analytics (já temos o componente):
O arquivo `src/components/GoogleAnalytics.tsx` já está pronto para usar.

### Google Maps - Exemplo de Uso:
```tsx
// Em qualquer componente
<Script
  src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
  strategy="lazyOnload"
/>

// Componente de Mapa
function MapComponent() {
  useEffect(() => {
    if (window.google) {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
        zoom: 15,
      });
      
      // Adicionar marcador
      new google.maps.Marker({
        position: { lat: -22.9068, lng: -43.1729 },
        map,
        title: "Rio Porto P2P"
      });
    }
  }, []);
  
  return <div id="map" style={{ height: "400px", width: "100%" }} />;
}
```

### Para mostrar Reviews do Google:
```tsx
// Usar Places API para buscar reviews
async function getGoogleReviews() {
  const service = new google.maps.places.PlacesService(
    document.createElement('div')
  );
  
  const request = {
    placeId: 'SEU_PLACE_ID', // Precisa encontrar o Place ID da empresa
    fields: ['reviews', 'rating', 'user_ratings_total']
  };
  
  service.getDetails(request, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(place.reviews); // Array de reviews
      console.log(place.rating); // Nota média
    }
  });
}
```

## 4. Encontrar Place ID da Empresa

1. Acesse [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Procure pelo endereço da empresa
3. Copie o Place ID (formato: `ChIJ...`)

## 5. Custos

### Google Maps:
- **Gratuito**: $200/mês de crédito
- **Maps JavaScript**: $7 por 1000 carregamentos
- **Places Details**: $17 por 1000 requisições

### Google Analytics:
- **Totalmente gratuito** para até 10 milhões de eventos/mês

## 6. Monitoramento

### Maps:
- Console → APIs & Services → Metrics
- Veja uso e custos em tempo real

### Analytics:
- Dados aparecem em 24-48h
- Tempo real disponível no dashboard

## 7. Variáveis Finais para Vercel

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Próximos Passos
1. Criar as APIs seguindo os guias
2. Adicionar as chaves no .env.local
3. Adicionar no Vercel
4. Implementar mapa na página de contato
5. Analytics já funcionará automaticamente!