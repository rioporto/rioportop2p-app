// Configuração da API CoinMarketCap para cotações de criptomoedas

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY || '';
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

interface CryptoQuote {
  id: number;
  name: string;
  symbol: string;
  price_brl: number;
  percent_change_24h: number;
  market_cap_brl: number;
  volume_24h_brl: number;
}

// Buscar cotação de uma cripto específica em BRL
export async function getCryptoQuote(symbol: string): Promise<CryptoQuote | null> {
  try {
    const response = await fetch(
      `${CMC_BASE_URL}/cryptocurrency/quotes/latest?symbol=${symbol}&convert=BRL`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        },
        next: { revalidate: 60 } // Cache por 1 minuto
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const crypto = data.data[symbol];
    
    if (!crypto) return null;

    return {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      price_brl: crypto.quote.BRL.price,
      percent_change_24h: crypto.quote.BRL.percent_change_24h,
      market_cap_brl: crypto.quote.BRL.market_cap,
      volume_24h_brl: crypto.quote.BRL.volume_24h
    };
  } catch (error) {
    console.error('Erro ao buscar cotação:', error);
    return null;
  }
}

// Buscar top 300 criptomoedas por market cap
export async function getTop300Cryptos(): Promise<Array<{ symbol: string; name: string; price_brl?: number; percent_change_24h?: number }>> {
  try {
    const response = await fetch(
      `${CMC_BASE_URL}/cryptocurrency/listings/latest?limit=300&convert=BRL&sort=market_cap&sort_dir=desc`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        },
        next: { revalidate: 300 } // Cache por 5 minutos
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data.map((crypto: any) => ({
      symbol: crypto.symbol,
      name: crypto.name,
      price_brl: crypto.quote?.BRL?.price,
      percent_change_24h: crypto.quote?.BRL?.percent_change_24h
    }));
  } catch (error) {
    console.error('Erro ao buscar top 300:', error);
    return [];
  }
}

// Buscar múltiplas cotações de uma vez
export async function getMultipleCryptoQuotes(symbols: string[]): Promise<Record<string, CryptoQuote>> {
  try {
    const symbolsStr = symbols.join(',');
    const response = await fetch(
      `${CMC_BASE_URL}/cryptocurrency/quotes/latest?symbol=${symbolsStr}&convert=BRL`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        },
        next: { revalidate: 60 }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result: Record<string, CryptoQuote> = {};

    for (const symbol of symbols) {
      const crypto = data.data[symbol];
      if (crypto) {
        result[symbol] = {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          price_brl: crypto.quote.BRL.price,
          percent_change_24h: crypto.quote.BRL.percent_change_24h,
          market_cap_brl: crypto.quote.BRL.market_cap,
          volume_24h_brl: crypto.quote.BRL.volume_24h
        };
      }
    }

    return result;
  } catch (error) {
    console.error('Erro ao buscar múltiplas cotações:', error);
    return {};
  }
}

// Formatar preço em BRL
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Formatar porcentagem
export function formatPercent(value: number): string {
  const formatted = value.toFixed(2);
  return value >= 0 ? `+${formatted}%` : `${formatted}%`;
}