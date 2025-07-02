import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
    }

    // Buscar todas as transações do usuário para calcular estatísticas
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching stats:', error)
      return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 })
    }

    // Calcular estatísticas
    const stats = {
      totalTransactions: transactions?.length || 0,
      totalVolume: 0,
      completedTransactions: 0,
      pendingTransactions: 0,
      cancelledTransactions: 0,
      totalFees: 0,
      cryptoVolumes: {} as Record<string, number>,
      favoritesCrypto: 'BTC',
      monthlyVolume: 0,
      weeklyVolume: 0
    }

    if (transactions && transactions.length > 0) {
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      transactions.forEach((tx: any) => {
        // Volume total em BRL
        if (tx.type === 'buy') {
          stats.totalVolume += tx.from_amount
        } else if (tx.type === 'sell') {
          stats.totalVolume += tx.to_amount
        }

        // Taxas totais
        stats.totalFees += tx.fee_amount || 0

        // Status
        switch (tx.status) {
          case 'completed':
            stats.completedTransactions++
            break
          case 'pending':
          case 'processing':
            stats.pendingTransactions++
            break
          case 'cancelled':
            stats.cancelledTransactions++
            break
        }

        // Volume por crypto
        const crypto = tx.type === 'buy' ? tx.to_currency : tx.from_currency
        if (crypto !== 'BRL') {
          stats.cryptoVolumes[crypto] = (stats.cryptoVolumes[crypto] || 0) + 1
        }

        // Volume semanal e mensal
        const txDate = new Date(tx.created_at)
        const txAmount = tx.type === 'buy' ? tx.from_amount : tx.to_amount
        
        if (txDate >= oneWeekAgo) {
          stats.weeklyVolume += txAmount
        }
        if (txDate >= oneMonthAgo) {
          stats.monthlyVolume += txAmount
        }
      })

      // Determinar crypto favorita
      const sortedCryptos = Object.entries(stats.cryptoVolumes)
        .sort(([, a], [, b]) => b - a)
      
      if (sortedCryptos.length > 0) {
        stats.favoritesCrypto = sortedCryptos[0][0]
      }
    }

    // Buscar informações do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
    }

    return NextResponse.json({
      stats: {
        totalTransactions: stats.totalTransactions,
        totalVolume: stats.totalVolume,
        completedTransactions: stats.completedTransactions,
        pendingTransactions: stats.pendingTransactions,
        favoritesCrypto: stats.favoritesCrypto,
        totalFees: stats.totalFees,
        monthlyVolume: stats.monthlyVolume,
        weeklyVolume: stats.weeklyVolume,
        successRate: stats.totalTransactions > 0 
          ? (stats.completedTransactions / stats.totalTransactions * 100).toFixed(1)
          : '0'
      },
      user: {
        email: user.email,
        name: userData?.full_name || user.user_metadata?.full_name || 'Usuário',
        phone: userData?.phone || user.user_metadata?.phone || '',
        kycLevel: userData?.kyc_level || 1,
        kycVerified: userData?.kyc_verified_at ? true : false,
        createdAt: user.created_at
      }
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}