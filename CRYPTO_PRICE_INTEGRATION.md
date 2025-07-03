# Crypto Price Integration Documentation

## Overview

The RioPorto P2P platform now has a complete cryptocurrency price integration system that fetches real-time BTC/BRL prices from multiple sources with automatic fallbacks.

## Features

- **Multiple API Providers**: Binance (primary), CoinGecko, and CryptoCompare as fallbacks
- **Real-time Price Updates**: Automatic refresh every minute
- **Price Caching**: In-memory and database caching to reduce API calls
- **Historical Data**: Store and retrieve price history
- **Background Updates**: Cron job runs every 5 minutes to update prices
- **React Hooks**: Easy-to-use hooks for components
- **Error Handling**: Graceful fallbacks and error recovery

## Architecture

### 1. Price Service (`src/lib/crypto-price-service.ts`)
The core service that handles:
- Fetching prices from multiple APIs
- Caching mechanism
- Database operations
- Price formatting

### 2. API Endpoints

#### `/api/crypto-prices`
- `GET /api/crypto-prices?symbol=BTC` - Get single crypto price
- `GET /api/crypto-prices?symbols=BTC,ETH,USDT` - Get multiple prices
- `GET /api/crypto-prices?symbol=BTC&history=true&period=24h` - Get price history

#### `/api/cotacao` (Legacy, updated to use new service)
- Maintains backward compatibility
- Uses the new crypto price service as primary source

#### `/api/cron/update-prices`
- Protected endpoint for periodic price updates
- Called by Vercel Cron every 5 minutes

### 3. Database Schema

```sql
CREATE TABLE crypto_prices (
  id UUID PRIMARY KEY,
  symbol VARCHAR(10),
  price_brl DECIMAL(20, 8),
  price_usd DECIMAL(20, 8),
  percent_change_24h DECIMAL(10, 4),
  percent_change_7d DECIMAL(10, 4),
  volume_24h DECIMAL(20, 2),
  market_cap DECIMAL(20, 2),
  high_24h DECIMAL(20, 8),
  low_24h DECIMAL(20, 8),
  source VARCHAR(50),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

## Usage Examples

### 1. Using the React Hook in a Component

```tsx
import { useCryptoPrice } from '@/hooks/useCryptoPrice'

function BitcoinPrice() {
  const { price, loading, error } = useCryptoPrice({ 
    symbol: 'BTC',
    autoRefresh: true,
    refreshInterval: 60000 // 1 minute
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Bitcoin Price</h2>
      <p>{price?.price} BRL</p>
      <p>{price?.change24h}% (24h)</p>
    </div>
  )
}
```

### 2. Using the Price Card Component

```tsx
import { CryptoPriceCard } from '@/components/crypto/CryptoPriceCard'

function Dashboard() {
  return (
    <div>
      <CryptoPriceCard symbol="BTC" />
      <CryptoPriceCard symbol="ETH" showP2P={false} />
    </div>
  )
}
```

### 3. Using the Price Ticker

```tsx
import { CryptoPriceTicker } from '@/components/crypto/CryptoPriceTicker'

function Header() {
  return (
    <header>
      <CryptoPriceTicker symbols={['BTC', 'ETH', 'USDT']} />
    </header>
  )
}
```

### 4. Direct API Usage

```javascript
// Fetch single price
const response = await fetch('/api/crypto-prices?symbol=BTC')
const data = await response.json()
console.log(data.data.price) // Current BTC price in BRL

// Fetch multiple prices
const response = await fetch('/api/crypto-prices?symbols=BTC,ETH,USDT')
const data = await response.json()
console.log(data.data) // Object with prices for each symbol

// Fetch price history
const response = await fetch('/api/crypto-prices?symbol=BTC&history=true&period=24h')
const data = await response.json()
console.log(data.data.history) // Array of historical prices
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Optional: For Vercel Cron authentication
CRON_SECRET=your-cron-secret-here

# Optional: For manual API endpoint protection
API_SECRET_KEY=your-api-secret-here

# Optional: If you want to use CoinMarketCap as well
COINMARKETCAP_API_KEY=your-coinmarketcap-key
```

## API Providers

### 1. Binance (Primary)
- **No API key required**
- Rate limit: 1200 requests/minute
- Endpoints used:
  - `https://api.binance.com/api/v3/ticker/24hr`
  - `https://api.binance.com/api/v3/ticker/price`

### 2. CoinGecko (Fallback)
- **No API key required** (free tier)
- Rate limit: 10-50 requests/minute
- Endpoint: `https://api.coingecko.com/api/v3/simple/price`

### 3. CryptoCompare (Fallback)
- **No API key required** (free tier)
- Rate limit: 100,000 requests/month
- Endpoint: `https://min-api.cryptocompare.com/data/pricemultifull`

## Deployment

### Vercel Deployment

1. The cron job is already configured in `vercel.json`
2. Deploy to Vercel: `vercel --prod`
3. Set environment variables in Vercel dashboard

### Database Migration

Run the migration to create the crypto_prices table:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL in:
# supabase/migrations/20250103_create_crypto_prices_table.sql
```

## Monitoring

- Check cron job execution in Vercel dashboard under "Functions" → "Cron"
- Monitor API response times and errors in Vercel Analytics
- Database queries can be monitored in Supabase dashboard

## Error Handling

The system has multiple layers of error handling:

1. **API Fallbacks**: If one API fails, it tries the next
2. **Cache Fallback**: Returns cached data if all APIs fail
3. **Database Fallback**: Returns last known price from database
4. **Mock Fallback**: Returns mock data as last resort

## Future Enhancements

1. **WebSocket Integration**: Real-time price updates via WebSocket
2. **More Cryptocurrencies**: Add support for more coins
3. **Price Alerts**: Notify users when prices reach certain thresholds
4. **Advanced Charts**: Integration with charting libraries
5. **P2P Price Aggregation**: Calculate real P2P prices from actual orders

## Troubleshooting

### Prices not updating
1. Check if cron job is running in Vercel dashboard
2. Verify API endpoints are accessible
3. Check Supabase connection and table permissions

### API rate limits
- The system automatically handles rate limits with delays
- If persistent, reduce update frequency or add more API providers

### Database connection issues
- Verify Supabase environment variables
- Check database connection limits
- Review Supabase logs for errors