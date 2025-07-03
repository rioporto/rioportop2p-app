import { Tables, Enums } from '@/lib/database.types'

export type DatabaseNotification = Tables<'notifications'>
export type NotificationType = Enums<'notification_type'>

export interface NotificationMetadata {
  // Transaction notifications
  transactionId?: string
  transactionType?: 'buy' | 'sell' | 'exchange'
  amount?: number
  currency?: string
  status?: string
  
  // KYC notifications
  kycLevel?: number
  kycStatus?: 'approved' | 'rejected' | 'pending'
  
  // Course notifications
  courseId?: string
  courseTitle?: string
  
  // P2P Trade notifications
  tradeId?: string
  tradeAmount?: number
  tradeCurrency?: string
  tradePartner?: string
  
  // Price Alert notifications
  alertId?: string
  alertPrice?: number
  currentPrice?: number
  
  // System notifications
  action?: string
  priority?: 'low' | 'medium' | 'high'
  
  // Common fields
  url?: string
}

export interface NotificationAction {
  label: string
  url?: string
  onClick?: () => void
}

export interface EnhancedNotification extends DatabaseNotification {
  actions?: NotificationAction[]
}

export interface NotificationFilters {
  types?: NotificationType[]
  read?: boolean
  startDate?: Date
  endDate?: Date
}

export interface NotificationStats {
  total: number
  unread: number
  byType: Record<NotificationType, number>
}