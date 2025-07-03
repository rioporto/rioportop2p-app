'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import OrderCard from '@/components/orders/OrderCard';
import OrdersFilter from '@/components/orders/OrdersFilter';
import OrderBookSkeleton from '@/components/orders/OrderBookSkeleton';
import EmptyOrdersState from '@/components/orders/EmptyOrdersState';
import OrderDetailModal from '@/components/orders/OrderDetailModal';
import { supabase, Tables } from '@/lib/supabase/typed-client';

interface Order {
  id: string;
  type: 'buy' | 'sell';
  crypto: {
    id?: string;
    symbol: string;
    name: string;
    logo_url?: string;
  };
  user: {
    id: string;
    name: string;
    avatar?: string;
    reputation: number;
    trades: number;
    is_online: boolean;
    last_seen: string;
    kyc_level: string;
  };
  crypto_amount: number;
  fiat_amount: number;
  price_per_unit: number;
  limits: {
    min: number | null;
    max: number | null;
  };
  payment_methods: string[];
  payment_time_limit: number;
  terms?: string;
  is_own: boolean;
  created_at: string;
  expires_at?: string;
}

interface Crypto {
  symbol: string;
  name: string;
  price_brl?: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('BTC');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Fetch available cryptocurrencies
  const fetchCryptos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cryptocurrencies')
        .select('symbol, name')
        .eq('is_active', true)
        .order('symbol');

      if (error) throw error;

      setCryptos(data || []);
      
      // Set default crypto if current selection is not in the list
      if (data && data.length > 0 && !data.find(c => c.symbol === selectedCrypto)) {
        setSelectedCrypto(data[0].symbol);
      }
    } catch (err) {
      console.error('Error fetching cryptos:', err);
    }
  }, [selectedCrypto]);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orders?crypto=${selectedCrypto}&status=open`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError('Erro ao carregar ordens. Tente novamente.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCrypto, router]);

  // Set up real-time subscription for orders
  useEffect(() => {
    // First, get crypto ID for the selected symbol
    const setupSubscription = async () => {
      if (!selectedCrypto) return;

      // Find the crypto ID
      const crypto = cryptos.find(c => c.symbol === selectedCrypto);
      if (!crypto) return;

      const channel = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          (payload) => {
            console.log('Order change:', payload);
            // Refresh orders when there's a change
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupSubscription();
  }, [selectedCrypto, cryptos, fetchOrders]);

  // Initial data fetch
  useEffect(() => {
    fetchCryptos();
  }, [fetchCryptos]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, refreshKey]);

  // Handle order selection
  const handleOrderSelect = (order: Order) => {
    if (order.is_own) {
      // If it's the user's own order, redirect to edit
      router.push(`/orders/${order.id}/edit`);
    } else {
      // Show order detail modal
      setSelectedOrder(order);
      setShowOrderModal(true);
    }
  };

  // Handle order confirmation from modal
  const handleOrderConfirm = async (amount: number) => {
    if (!selectedOrder) return;
    
    // Create transaction with the specified amount
    const params = new URLSearchParams({
      order: selectedOrder.id,
      amount: amount.toString()
    });
    
    router.push(`/transaction/new?${params.toString()}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Separate buy and sell orders
  const buyOrders = orders.filter(order => order.type === 'buy');
  const sellOrders = orders.filter(order => order.type === 'sell');

  if (loading && cryptos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <OrderBookSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Livro de Ofertas</h1>
        <p className="text-slate-400">Encontre as melhores ofertas para comprar ou vender criptomoedas</p>
      </div>

      {/* Filters */}
      <OrdersFilter
        selectedCrypto={selectedCrypto}
        onCryptoChange={setSelectedCrypto}
        onRefresh={handleRefresh}
        cryptos={cryptos}
        loading={loading}
      />

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Orders Grid */}
      {loading ? (
        <OrderBookSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buy Orders */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Ordens de Compra</h2>
              <span className="text-sm text-slate-400">({buyOrders.length})</span>
            </div>
            
            {buyOrders.length > 0 ? (
              <div className="space-y-4">
                {buyOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onSelect={handleOrderSelect}
                  />
                ))}
              </div>
            ) : (
              <EmptyOrdersState type="buy" crypto={selectedCrypto} />
            )}
          </div>

          {/* Sell Orders */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-semibold text-white">Ordens de Venda</h2>
              <span className="text-sm text-slate-400">({sellOrders.length})</span>
            </div>
            
            {sellOrders.length > 0 ? (
              <div className="space-y-4">
                {sellOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onSelect={handleOrderSelect}
                  />
                ))}
              </div>
            ) : (
              <EmptyOrdersState type="sell" crypto={selectedCrypto} />
            )}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">Como funciona?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
          <div>
            <p className="font-medium text-white mb-1">1. Escolha uma oferta</p>
            <p>Selecione uma ordem de compra ou venda que atenda suas necessidades.</p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">2. Inicie a negociação</p>
            <p>Clique na oferta para iniciar uma transação segura com o vendedor.</p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">3. Complete o pagamento</p>
            <p>Siga as instruções e receba suas criptomoedas com segurança.</p>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
          onConfirm={handleOrderConfirm}
        />
      )}
    </div>
  );
}