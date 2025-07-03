# Orders API Documentation

## Overview
Complete CRUD API for managing P2P cryptocurrency orders with authentication, validation, and proper TypeScript types.

## Base URL
`/api/orders`

## Authentication
All endpoints require authentication via Supabase session cookie (`sb-access-token`).

## Endpoints

### 1. GET /api/orders
List orders with filtering, pagination, and joins.

#### Query Parameters
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `type` (string, optional): Filter by order type ('buy' | 'sell')
- `crypto` (string, optional): Filter by cryptocurrency ID
- `user` (string, optional): Filter by user ID
- `status` (string, optional): Filter by status ('open' | 'matched' | 'completed' | 'cancelled' | 'expired')
- `min_amount` (number, optional): Minimum fiat amount filter
- `max_amount` (number, optional): Maximum fiat amount filter

#### Response
```json
{
  "orders": [
    {
      "id": "uuid",
      "type": "buy",
      "status": "open",
      "crypto": {
        "id": "uuid",
        "symbol": "BTC",
        "name": "Bitcoin",
        "logo_url": "https://..."
      },
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "avatar": "https://...",
        "reputation": 4.8,
        "trades": 150,
        "is_online": true,
        "last_seen": "2024-01-15T10:30:00Z",
        "kyc_level": "complete"
      },
      "crypto_amount": 0.001,
      "fiat_amount": 5000,
      "price_per_unit": 5000000,
      "limits": {
        "min": 100,
        "max": 10000
      },
      "payment_methods": ["PIX", "bank_transfer"],
      "payment_time_limit": 30,
      "terms": "Payment instructions...",
      "is_own": false,
      "created_at": "2024-01-15T10:00:00Z",
      "expires_at": "2024-01-16T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### 2. POST /api/orders
Create a new buy or sell order.

#### Request Body
```json
{
  "type": "buy",
  "crypto_id": "uuid",
  "crypto_amount": 0.001,
  "fiat_amount": 5000,
  "price_per_unit": 5000000,
  "payment_methods": ["PIX", "bank_transfer"],
  "payment_time_limit": 30,
  "min_limit": 100,
  "max_limit": 10000,
  "terms": "Payment instructions and terms..."
}
```

#### Validation Rules
- All amounts must be positive numbers
- At least one payment method is required
- Valid payment methods: 'PIX', 'TED', 'bank_transfer', 'cash'
- KYC verification required for orders above R$ 1,000 (for basic KYC level)
- Cryptocurrency must exist and be active

#### Response (201 Created)
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "type": "buy",
    "status": "open",
    "crypto": {
      "symbol": "BTC",
      "name": "Bitcoin",
      "logo_url": "https://..."
    },
    "crypto_amount": 0.001,
    "fiat_amount": 5000,
    "price_per_unit": 5000000,
    "payment_methods": ["PIX", "bank_transfer"],
    "created_at": "2024-01-15T10:00:00Z",
    "expires_at": "2024-01-16T10:00:00Z"
  }
}
```

### 3. PATCH /api/orders
Update an existing order.

#### Request Body
```json
{
  "id": "uuid",
  "status": "cancelled",
  "crypto_amount": 0.002,
  "fiat_amount": 10000,
  "price_per_unit": 5000000,
  "min_limit": 200,
  "max_limit": 20000,
  "payment_methods": ["PIX"],
  "payment_time_limit": 60,
  "terms": "Updated terms..."
}
```

#### Allowed Fields for Update
- `status`
- `crypto_amount`
- `fiat_amount`
- `price_per_unit`
- `min_limit`
- `max_limit`
- `payment_methods`
- `payment_time_limit`
- `terms`

#### Status Transition Rules
- `open` → `matched`, `cancelled`, `expired`
- `matched` → `completed`, `cancelled`
- `completed` → (no transitions allowed)
- `cancelled` → (no transitions allowed)
- `expired` → (no transitions allowed)

#### Response
```json
{
  "message": "Order updated successfully",
  "order": { /* updated order object */ }
}
```

### 4. DELETE /api/orders
Cancel an order.

#### Query Parameters
- `id` (string, required): Order ID to cancel

#### Cancellation Rules
- Only orders with status 'open' or 'matched' can be cancelled
- Cannot cancel orders with active transactions (pending or processing)
- Order owner or admin/moderator can cancel

#### Response
```json
{
  "message": "Order cancelled successfully",
  "order": { /* cancelled order object */ }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required field: type"
}
```

### 401 Unauthorized
```json
{
  "error": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "error": "Not authorized to update this order"
}
```

### 404 Not Found
```json
{
  "error": "Order not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Security Features

1. **Authentication**: All endpoints require valid Supabase session
2. **Authorization**: Users can only update/delete their own orders (except admins)
3. **KYC Checks**: Enforces KYC requirements based on order amounts
4. **Validation**: Comprehensive input validation for all fields
5. **Admin Logging**: All admin actions are logged to admin_logs table

## Best Practices

1. Always check `is_own` field to determine if order belongs to current user
2. Implement proper error handling for all API responses
3. Use pagination for large result sets
4. Check order status before attempting updates
5. Verify payment methods are supported before creating orders