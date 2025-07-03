import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase, queries } from '@/lib/supabase/typed-client'
import { createServiceSupabase } from '@/lib/supabase/typed-client'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar o usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
    }

    // Usar service client para queries administrativas
    const serviceSupabase = createServiceSupabase()

    // Buscar perfil do usuário
    let { data: userProfile, error: profileError } = await serviceSupabase
      .from('users_profile')
      .select('*')
      .eq('id', user.id)
      .single()

    // Se o perfil não existe, criar um
    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await serviceSupabase
        .from('users_profile')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          phone: user.user_metadata?.phone || null,
        })
        .select()
        .single()
      
      if (!createError) {
        userProfile = newProfile
      }
    }

    // Buscar transações do usuário
    const { data: transactions, error: txError } = await serviceSupabase
      .from('transactions')
      .select(`
        *,
        crypto:crypto_id(symbol, name)
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (txError) {
      console.error('Error fetching transactions:', txError)
    }

    // Calcular estatísticas
    const stats = {
      totalTransactions: 0,
      totalVolume: 0,
      completedTransactions: 0,
      pendingTransactions: 0,
      cancelledTransactions: 0,
      totalFees: 0,
      cryptoVolumes: {} as Record<string, number>,
      favoritesCrypto: 'BTC',
      monthlyVolume: 0,
      weeklyVolume: 0,
      successRate: 0
    }

    if (transactions && transactions.length > 0) {
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      stats.totalTransactions = transactions.length

      transactions.forEach((tx) => {
        // Volume total
        stats.totalVolume += Number(tx.total_amount)

        // Taxas (apenas para transações onde o usuário foi o comprador)
        if (tx.buyer_id === user.id) {
          stats.totalFees += Number(tx.fee_amount)
        }

        // Status das transações
        switch (tx.status) {
          case 'completed':
            stats.completedTransactions++
            break
          case 'pending':
          case 'processing':
            stats.pendingTransactions++
            break
          case 'cancelled':
          case 'failed':
            stats.cancelledTransactions++
            break
        }

        // Volume por criptomoeda
        const cryptoSymbol = tx.crypto?.symbol || 'UNKNOWN'
        stats.cryptoVolumes[cryptoSymbol] = (stats.cryptoVolumes[cryptoSymbol] || 0) + 1

        // Volume semanal e mensal
        const txDate = new Date(tx.created_at)
        const txAmount = Number(tx.total_amount)
        
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

      // Taxa de sucesso
      stats.successRate = (stats.completedTransactions / stats.totalTransactions) * 100
    }

    // Buscar notificações não lidas
    const { count: unreadCount } = await serviceSupabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

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
        successRate: stats.successRate.toFixed(1)
      },
      user: {
        id: user.id,
        email: user.email || '',
        name: userProfile?.full_name || user.user_metadata?.full_name || 'Usuário',
        phone: userProfile?.phone || '',
        cpf: userProfile?.cpf || null,
        avatarUrl: userProfile?.avatar_url || null,
        kycLevel: userProfile?.kyc_level || 'basic',
        kycVerified: userProfile?.kyc_verified_at ? true : false,
        createdAt: user.created_at,
        role: userProfile?.role || 'user',
        reputationScore: userProfile?.reputation_score || 0,
        totalTrades: userProfile?.total_trades || 0,
        volumeTraded: userProfile?.volume_traded || 0,
        unreadNotifications: unreadCount || 0
      }
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}