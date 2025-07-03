import { NotificationType, NotificationMetadata } from '@/types/notification'
import { supabase } from './supabase'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  metadata?: NotificationMetadata
}

/**
 * Creates a notification in the database
 * This should be used server-side or in API routes
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  metadata
}: CreateNotificationParams) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        metadata: metadata || null,
        read: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error }
  }
}

/**
 * Creates a notification via API endpoint
 * This should be used client-side
 */
export async function createNotificationViaAPI(params: CreateNotificationParams) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        metadata: params.metadata
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error }
    }

    const data = await response.json()
    return { success: true, data: data.notification }
  } catch (error) {
    console.error('Error creating notification via API:', error)
    return { success: false, error }
  }
}

/**
 * Helper functions to create specific types of notifications
 */

export async function notifyTransaction(
  userId: string,
  transactionType: 'buy' | 'sell' | 'exchange',
  amount: number,
  currency: string,
  status: string,
  transactionId: string
) {
  const titles = {
    buy: 'Compra Realizada',
    sell: 'Venda Realizada',
    exchange: 'Troca Realizada'
  }

  const messages = {
    buy: `Sua compra de ${amount} ${currency} foi ${status === 'completed' ? 'concluída' : 'processada'}.`,
    sell: `Sua venda de ${amount} ${currency} foi ${status === 'completed' ? 'concluída' : 'processada'}.`,
    exchange: `Sua troca de ${currency} foi ${status === 'completed' ? 'concluída' : 'processada'}.`
  }

  return createNotification({
    userId,
    type: 'transaction',
    title: titles[transactionType],
    message: messages[transactionType],
    metadata: {
      transactionId,
      transactionType,
      amount,
      currency,
      status,
      url: `/dashboard/transactions/${transactionId}`
    }
  })
}

export async function notifyKYC(
  userId: string,
  kycLevel: number,
  status: 'approved' | 'rejected' | 'pending'
) {
  const titles = {
    approved: 'Verificação KYC Aprovada',
    rejected: 'Verificação KYC Rejeitada',
    pending: 'Verificação KYC em Análise'
  }

  const messages = {
    approved: `Parabéns! Sua verificação de nível ${kycLevel} foi aprovada.`,
    rejected: `Sua verificação de nível ${kycLevel} foi rejeitada. Por favor, revise os documentos.`,
    pending: `Sua verificação de nível ${kycLevel} está em análise.`
  }

  return createNotification({
    userId,
    type: 'kyc',
    title: titles[status],
    message: messages[status],
    metadata: {
      kycLevel,
      kycStatus: status,
      url: '/dashboard/profile'
    }
  })
}

export async function notifyCourseEnrollment(
  userId: string,
  courseId: string,
  courseTitle: string
) {
  return createNotification({
    userId,
    type: 'course',
    title: 'Inscrição em Curso',
    message: `Você foi inscrito no curso "${courseTitle}".`,
    metadata: {
      courseId,
      courseTitle,
      url: `/courses/${courseId}`
    }
  })
}

export async function notifyP2PTrade(
  userId: string,
  tradeId: string,
  tradeAmount: number,
  tradeCurrency: string,
  tradePartner: string,
  action: 'new_offer' | 'accepted' | 'rejected' | 'completed'
) {
  const titles = {
    new_offer: 'Nova Oferta P2P',
    accepted: 'Oferta P2P Aceita',
    rejected: 'Oferta P2P Rejeitada',
    completed: 'Negociação P2P Concluída'
  }

  const messages = {
    new_offer: `${tradePartner} enviou uma oferta de ${tradeAmount} ${tradeCurrency}.`,
    accepted: `Sua oferta de ${tradeAmount} ${tradeCurrency} foi aceita por ${tradePartner}.`,
    rejected: `Sua oferta de ${tradeAmount} ${tradeCurrency} foi rejeitada por ${tradePartner}.`,
    completed: `Negociação de ${tradeAmount} ${tradeCurrency} com ${tradePartner} foi concluída.`
  }

  return createNotification({
    userId,
    type: 'p2p_trade',
    title: titles[action],
    message: messages[action],
    metadata: {
      tradeId,
      tradeAmount,
      tradeCurrency,
      tradePartner,
      url: `/p2p/trades/${tradeId}`
    }
  })
}

export async function notifyPriceAlert(
  userId: string,
  alertId: string,
  currency: string,
  targetPrice: number,
  currentPrice: number,
  condition: 'above' | 'below'
) {
  const message = condition === 'above'
    ? `${currency} ultrapassou R$ ${targetPrice.toLocaleString('pt-BR')} - Preço atual: R$ ${currentPrice.toLocaleString('pt-BR')}`
    : `${currency} caiu abaixo de R$ ${targetPrice.toLocaleString('pt-BR')} - Preço atual: R$ ${currentPrice.toLocaleString('pt-BR')}`

  return createNotification({
    userId,
    type: 'price_alert',
    title: `Alerta de Preço - ${currency}`,
    message,
    metadata: {
      alertId,
      alertPrice: targetPrice,
      currentPrice,
      url: '/dashboard'
    }
  })
}

export async function notifySystem(
  userId: string,
  title: string,
  message: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  action?: string
) {
  return createNotification({
    userId,
    type: 'system',
    title,
    message,
    metadata: {
      priority,
      action
    }
  })
}