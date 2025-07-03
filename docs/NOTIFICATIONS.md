# Real-time Notification System Documentation

## Overview

This document describes the real-time notification system implemented for the RioPorto P2P cryptocurrency platform. The system uses Supabase for real-time updates and persistent storage.

## Features

- **Real-time Updates**: Notifications appear instantly using Supabase's real-time subscriptions
- **Persistent Storage**: All notifications are stored in the database
- **Toast Notifications**: Temporary UI notifications for immediate feedback
- **Unread Counter**: Real-time badge updates on the notification bell
- **Type-based Styling**: Different notification types have distinct colors and icons
- **Mark as Read**: Individual or bulk marking of notifications
- **Delete Notifications**: Users can remove notifications they no longer need

## Setup Instructions

### 1. Database Setup

Run the SQL migration file to create the notifications table:

```sql
-- Execute the contents of: /supabase/migrations/create_notifications_table.sql
```

### 2. Environment Variables

Ensure your Supabase environment variables are properly configured:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Add NotificationBell to Your Layout

Add the notification bell component to your navigation bar:

```tsx
import NotificationBell from '@/components/notifications/NotificationBell'

// In your navbar component
<NotificationBell />
```

## Usage

### Sending Notifications

Use the notification helper functions to send notifications from your API routes or server-side code:

```typescript
import { 
  notifyTransaction, 
  notifyKYC, 
  notifyCourseEnrollment,
  notifyP2PTrade,
  notifyPriceAlert,
  notifySystem 
} from '@/lib/notifications'

// Transaction notification
await notifyTransaction(
  userId,
  'buy', // or 'sell', 'exchange'
  0.001,
  'BTC',
  'completed',
  'transaction-123'
)

// KYC notification
await notifyKYC(
  userId,
  2, // KYC level
  'approved' // or 'rejected', 'pending'
)

// Course enrollment
await notifyCourseEnrollment(
  userId,
  'course-123',
  'Trading Avançado de Criptomoedas'
)

// P2P Trade
await notifyP2PTrade(
  userId,
  'trade-456',
  500,
  'USDT',
  'João Silva',
  'new_offer' // or 'accepted', 'rejected', 'completed'
)

// Price Alert
await notifyPriceAlert(
  userId,
  'alert-789',
  'BTC',
  350000,
  352000,
  'above' // or 'below'
)

// System notification
await notifySystem(
  userId,
  'Manutenção Programada',
  'O sistema passará por manutenção...',
  'high', // priority: 'low', 'medium', 'high'
  'maintenance'
)
```

### Using Toast Notifications

For temporary UI feedback, use toast notifications:

```typescript
import { useNotification } from '@/contexts/NotificationContext'

const { addToastNotification } = useNotification()

// Success
addToastNotification({
  type: 'success',
  title: 'Operação Concluída',
  message: 'Sua transação foi processada com sucesso!'
})

// Error
addToastNotification({
  type: 'error',
  title: 'Erro',
  message: 'Não foi possível processar sua solicitação'
})

// Warning
addToastNotification({
  type: 'warning',
  title: 'Atenção',
  message: 'Verifique os dados informados'
})

// Info
addToastNotification({
  type: 'info',
  title: 'Informação',
  message: 'Nova funcionalidade disponível'
})
```

### Managing Notifications

The notification context provides several methods for managing notifications:

```typescript
import { useNotification } from '@/contexts/NotificationContext'

const { 
  notifications,        // Array of notifications
  unreadCount,         // Number of unread notifications
  isLoading,           // Loading state
  fetchNotifications,  // Fetch notifications (with pagination)
  markAsRead,          // Mark single notification as read
  markAllAsRead,       // Mark all as read
  deleteNotification   // Delete a notification
} = useNotification()

// Fetch notifications with pagination
await fetchNotifications(20, 0) // limit, offset

// Mark as read
await markAsRead('notification-id')

// Mark all as read
await markAllAsRead()

// Delete notification
await deleteNotification('notification-id')
```

## Notification Types

The system supports 6 types of notifications:

1. **transaction**: Buy/sell/exchange transactions
2. **kyc**: KYC verification updates
3. **course**: Course enrollments and updates
4. **system**: System-wide announcements
5. **p2p_trade**: P2P trading notifications
6. **price_alert**: Cryptocurrency price alerts

## Testing

Visit `/test-notifications` to access the notification testing page where you can:

1. Create different types of notifications
2. Test real-time updates
3. Verify the notification bell counter
4. Test toast notifications

## API Endpoints

### GET /api/notifications
Fetch user notifications with optional filters

Query parameters:
- `types`: Comma-separated list of notification types
- `read`: Filter by read status (true/false)
- `limit`: Number of notifications to fetch (default: 20)
- `offset`: Pagination offset (default: 0)

### POST /api/notifications
Create a new notification (admin only)

Body:
```json
{
  "user_id": "uuid",
  "type": "transaction",
  "title": "Notification Title",
  "message": "Notification message",
  "metadata": {}
}
```

### PATCH /api/notifications/[id]
Mark notification as read/unread

Body:
```json
{
  "read": true
}
```

### DELETE /api/notifications/[id]
Delete a notification

### POST /api/notifications/mark-all-read
Mark all notifications as read

## Security

- Row Level Security (RLS) ensures users can only access their own notifications
- Admin privileges required to create notifications via API
- Real-time subscriptions are filtered by user ID

## Best Practices

1. **Use appropriate notification types** for better organization and filtering
2. **Include relevant metadata** for action URLs and additional context
3. **Keep messages concise** and actionable
4. **Use toast notifications** for immediate feedback, database notifications for persistent messages
5. **Implement cleanup** for old notifications to maintain performance

## Troubleshooting

1. **Notifications not appearing in real-time**:
   - Check Supabase real-time settings
   - Verify the notifications table has real-time enabled
   - Check browser console for WebSocket errors

2. **Cannot create notifications**:
   - Verify user has admin privileges
   - Check API endpoint authentication
   - Review database RLS policies

3. **Performance issues**:
   - Implement pagination for large notification lists
   - Add database indexes if needed
   - Clean up old notifications periodically