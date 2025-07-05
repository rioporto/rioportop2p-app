# RioPorto P2P - API Documentation

This document provides comprehensive documentation for all API endpoints in the RioPorto P2P platform.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [User Management](#user-management)
   - [KYC Endpoints](#kyc-endpoints)
   - [Trading Endpoints](#trading-endpoints)
   - [Payment Endpoints](#payment-endpoints)
   - [Notification Endpoints](#notification-endpoints)
   - [Content Management](#content-management)
   - [Admin Endpoints](#admin-endpoints)
   - [System Endpoints](#system-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Webhooks](#webhooks)

## Overview

- **Base URL**: `https://rioportop2p.vercel.app` (current) or `https://rioporto.com` (pending) or `http://localhost:3000` (development)
- **API Version**: v1
- **Authentication**: Bearer token (Stack Auth)
- **Content-Type**: `application/json`

**Last Updated**: 2025-07-04

## Authentication

Most endpoints require authentication via Bearer token:

```
Authorization: Bearer <token>
```

Tokens are obtained through the Stack Auth authentication flow. Authentication is handled by Stack Auth with session management via HTTP-only cookies.

## API Endpoints

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "phone": "+5521999999999"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "token": "jwt-token"
}
```

#### Sign In
```http
POST /api/auth/signin
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "requires2FA": false
  },
  "token": "jwt-token"
}
```

#### Sign Out
```http
POST /api/auth/signout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### OAuth Callback
```http
GET /api/auth/callback?code=<code>&state=<state>
```

Handles OAuth provider callbacks (Google, etc.)

### Two-Factor Authentication

#### Setup 2FA
```http
POST /api/auth/2fa/setup
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "secret": "base32-secret",
  "qrCode": "data:image/png;base64,...",
  "backupCodes": ["code1", "code2", "..."]
}
```

#### Verify 2FA
```http
POST /api/auth/2fa/verify
```

**Request Body:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA verified successfully"
}
```

#### Complete 2FA Login
```http
POST /api/auth/2fa/complete-login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "jwt-token"
}
```

### User Management

#### Get User Profile
```http
GET /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "+5521999999999",
  "kycLevel": 1,
  "kycVerifiedAt": null,
  "isAdmin": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Update User Profile
```http
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "phone": "+5521888888888"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "fullName": "John Doe Updated",
    "phone": "+5521888888888"
  }
}
```

### KYC Endpoints

#### Upload KYC Documents
```http
POST /api/kyc/upload
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `documentType`: `identity` | `proof_of_address` | `selfie`
- `file`: Binary file data
- `level`: `1` | `2` | `3`

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "uuid",
    "type": "identity",
    "url": "https://cloudinary.com/...",
    "status": "pending"
  }
}
```

#### Get KYC Status
```http
GET /api/users/kyc
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "level": 1,
  "status": "verified",
  "documents": [
    {
      "type": "identity",
      "status": "approved",
      "uploadedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "verifiedAt": "2024-01-02T00:00:00Z"
}
```

#### Admin: Update KYC Status
```http
POST /api/kyc/notify
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "userId": "user-uuid",
  "status": "approved" | "rejected",
  "level": 2,
  "reason": "Document unclear" // if rejected
}
```

### Trading Endpoints

#### Get Cryptocurrency List
```http
GET /api/crypto-list
```

**Response:**
```json
{
  "cryptocurrencies": [
    {
      "id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "image": "https://...",
      "currentPrice": 50000.00,
      "priceChange24h": 2.5
    }
  ]
}
```

#### Get Current Prices
```http
GET /api/crypto-prices?symbols=BTC,ETH,USDT
```

**Query Parameters:**
- `symbols`: Comma-separated list of cryptocurrency symbols

**Response:**
```json
{
  "prices": {
    "BTC": {
      "usd": 50000.00,
      "brl": 250000.00,
      "change24h": 2.5
    },
    "ETH": {
      "usd": 3000.00,
      "brl": 15000.00,
      "change24h": -1.2
    }
  },
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Get Exchange Rate (Cotação)
```http
GET /api/cotacao?crypto=BTC&amount=1&currency=BRL
```

**Query Parameters:**
- `crypto`: Cryptocurrency symbol
- `amount`: Amount to convert
- `currency`: Target currency (BRL, USD)

**Response:**
```json
{
  "crypto": "BTC",
  "amount": 1,
  "currency": "BRL",
  "rate": 250000.00,
  "total": 250000.00,
  "fee": 500.00,
  "finalAmount": 250500.00,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Order Management

#### Create Order
```http
POST /api/orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "buy" | "sell",
  "cryptocurrency": "BTC",
  "amount": 0.001,
  "price": 250000.00,
  "paymentMethod": "pix",
  "minAmount": 100.00,
  "maxAmount": 10000.00
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "type": "buy",
    "status": "active",
    "cryptocurrency": "BTC",
    "amount": 0.001,
    "price": 250000.00,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Orders
```http
GET /api/orders?status=active&type=buy&cryptocurrency=BTC
```

**Query Parameters:**
- `status`: `active` | `completed` | `cancelled`
- `type`: `buy` | `sell`
- `cryptocurrency`: Cryptocurrency symbol
- `userId`: Filter by user (admin only)

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "type": "buy",
      "status": "active",
      "cryptocurrency": "BTC",
      "amount": 0.001,
      "price": 250000.00,
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "rating": 4.8,
        "completedTrades": 150
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Transaction Endpoints

#### Create Transaction
```http
POST /api/transactions
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "order-uuid",
  "type": "buy",
  "cryptocurrency": "BTC",
  "amount": 0.001,
  "price": 250000.00,
  "total": 250.00,
  "paymentMethod": "pix"
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "uuid",
    "status": "pending_payment",
    "expiresAt": "2024-01-01T00:30:00Z"
  }
}
```

#### Get Transaction Details
```http
GET /api/transactions/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "type": "buy",
  "status": "pending_payment",
  "cryptocurrency": "BTC",
  "amount": 0.001,
  "price": 250000.00,
  "total": 250.00,
  "paymentMethod": "pix",
  "buyer": {
    "id": "uuid",
    "name": "John Doe"
  },
  "seller": {
    "id": "uuid",
    "name": "Jane Smith"
  },
  "pixKey": "12345678900",
  "timeline": [
    {
      "status": "created",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "status": "pending_payment",
      "timestamp": "2024-01-01T00:01:00Z"
    }
  ],
  "chat": {
    "enabled": true,
    "messages": []
  }
}
```

#### Update Transaction Status
```http
PUT /api/transactions/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "action": "confirm_payment" | "release_crypto" | "cancel" | "dispute",
  "paymentProof": "cloudinary-url", // if confirming payment
  "reason": "Payment not received" // if disputing
}
```

### Payment Endpoints

#### Create PIX Payment
```http
POST /api/pix/create-payment
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "transactionId": "transaction-uuid",
  "amount": 250.00,
  "pixKey": "12345678900"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "payment-uuid",
    "qrCode": "00020126330014BR.GOV.BCB.PIX...",
    "qrCodeImage": "data:image/png;base64,...",
    "expiresAt": "2024-01-01T00:30:00Z"
  }
}
```

#### PIX Webhook
```http
POST /api/webhooks/pix
```

**Headers:**
```
X-Webhook-Secret: <webhook-secret>
```

**Request Body:**
```json
{
  "event": "payment.confirmed",
  "paymentId": "payment-uuid",
  "transactionId": "transaction-uuid",
  "amount": 250.00,
  "paidAt": "2024-01-01T00:15:00Z"
}
```

### Notification Endpoints

#### Get Notifications
```http
GET /api/notifications?read=false&limit=20
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `read`: Filter by read status
- `type`: Filter by notification type
- `limit`: Number of notifications
- `offset`: Pagination offset

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "transaction_update",
      "title": "Payment Received",
      "message": "The buyer has confirmed the payment",
      "data": {
        "transactionId": "transaction-uuid"
      },
      "read": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "unreadCount": 5,
  "total": 25
}
```

#### Mark Notification as Read
```http
PUT /api/notifications/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "id": "uuid",
    "read": true
  }
}
```

#### Mark All as Read
```http
POST /api/notifications/mark-all-read
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "updated": 5
}
```

### Content Management

#### Get Blog Posts
```http
GET /api/blog?category=bitcoin&featured=true&limit=10
```

**Query Parameters:**
- `category`: Filter by category
- `featured`: Show only featured posts
- `search`: Search in title and content
- `limit`: Number of posts
- `page`: Page number

**Response:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "Understanding Bitcoin Mining",
      "slug": "understanding-bitcoin-mining",
      "excerpt": "A comprehensive guide...",
      "category": "bitcoin",
      "author": {
        "name": "John Doe",
        "avatar": "https://..."
      },
      "imageUrl": "https://...",
      "publishedAt": "2024-01-01T00:00:00Z",
      "readTime": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

#### Get Courses
```http
GET /api/courses?level=beginner&category=trading
```

**Query Parameters:**
- `level`: `beginner` | `intermediate` | `advanced`
- `category`: Filter by category
- `featured`: Show only featured courses

**Response:**
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "P2P Trading Basics",
      "slug": "p2p-trading-basics",
      "description": "Learn the fundamentals...",
      "level": "beginner",
      "duration": 4,
      "price": 0,
      "instructor": "Jane Smith",
      "imageUrl": "https://...",
      "enrollments": 1250
    }
  ]
}
```

#### Get FAQs
```http
GET /api/faqs?category=trading
```

**Query Parameters:**
- `category`: Filter by category

**Response:**
```json
{
  "faqs": [
    {
      "id": "uuid",
      "question": "How do I start trading?",
      "answer": "To start trading on our platform...",
      "category": "trading",
      "order": 1
    }
  ]
}
```

### Admin Endpoints

#### Dashboard Statistics
```http
GET /api/dashboard/stats
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "users": {
    "total": 10000,
    "active": 8500,
    "new30Days": 1200,
    "kycVerified": {
      "level1": 8000,
      "level2": 5000,
      "level3": 2000
    }
  },
  "transactions": {
    "total": 50000,
    "volume24h": 2500000.00,
    "volume30d": 75000000.00,
    "pending": 25,
    "disputed": 3
  },
  "revenue": {
    "fees24h": 25000.00,
    "fees30d": 750000.00
  }
}
```

#### Admin: Get All Users
```http
GET /api/admin/users?kycLevel=2&search=john
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `kycLevel`: Filter by KYC level
- `isAdmin`: Filter admin users
- `search`: Search by name or email
- `page`: Page number
- `limit`: Results per page

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "john@example.com",
      "fullName": "John Doe",
      "kycLevel": 2,
      "isAdmin": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLogin": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

#### Admin: Get All Transactions
```http
GET /api/dashboard/transactions?status=disputed
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `status`: Filter by status
- `userId`: Filter by user
- `dateFrom`: Start date
- `dateTo`: End date

**Response:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "buy",
      "status": "disputed",
      "amount": 0.001,
      "total": 250.00,
      "buyer": {
        "id": "uuid",
        "name": "John Doe"
      },
      "seller": {
        "id": "uuid",
        "name": "Jane Smith"
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "disputeReason": "Payment not received"
    }
  ]
}
```

### System Endpoints

#### Health Check
```http
GET /api/system-check
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "database": {
      "status": "connected",
      "latency": 12
    },
    "auth": {
      "status": "operational"
    },
    "email": {
      "status": "operational"
    },
    "storage": {
      "status": "operational"
    },
    "payment": {
      "status": "operational"
    }
  },
  "version": "1.0.0"
}
```

#### Test Email Service
```http
POST /api/test-email
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "to": "test@example.com",
  "template": "welcome"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "email-id"
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Error Codes

- `AUTHENTICATION_REQUIRED`: Missing or invalid authentication
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict (e.g., duplicate email)
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Anonymous requests**: 10 requests per minute
- **Authenticated requests**: 100 requests per minute
- **Admin requests**: 1000 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

### PIX Payment Webhook (Pending Configuration)

**Endpoint**: Configure in PIX provider dashboard
**URL**: `https://rioportop2p.vercel.app/api/webhooks/pix`

**Note**: PIX integration is pending as of 2025-07-04.

**Security**: Validate webhook signature:
```javascript
const signature = request.headers['x-webhook-signature'];
const payload = JSON.stringify(request.body);
const expectedSignature = crypto
  .createHmac('sha256', process.env.PIX_WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

if (signature !== expectedSignature) {
  throw new Error('Invalid webhook signature');
}
```

### Notification Webhook (WebSocket)

Connect to real-time notifications:

```javascript
const ws = new WebSocket('wss://api.rioportop2p.com/notifications');

ws.on('message', (data) => {
  const notification = JSON.parse(data);
  console.log('New notification:', notification);
});
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import { RioPortoAPI } from '@rioporto/sdk';

const api = new RioPortoAPI({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Get current Bitcoin price
const price = await api.crypto.getPrice('BTC');

// Create a buy order
const order = await api.orders.create({
  type: 'buy',
  cryptocurrency: 'BTC',
  amount: 0.001,
  price: 250000
});
```

### cURL Examples

```bash
# Get cryptocurrency prices
curl -X GET "https://api.rioportop2p.com/api/crypto-prices?symbols=BTC,ETH" \
  -H "Accept: application/json"

# Create transaction
curl -X POST "https://api.rioportop2p.com/api/transactions" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-uuid",
    "type": "buy",
    "cryptocurrency": "BTC",
    "amount": 0.001
  }'
```

## API Versioning

The API uses URL versioning. The current version is v1. When breaking changes are introduced, a new version will be created.

Future versions will be accessible at:
- `https://api.rioportop2p.com/v2/...`

## API Status (2025-07-04)

### ✅ Working Endpoints
- All authentication endpoints (Stack Auth)
- User profile management
- KYC upload and status
- Cryptocurrency prices and listings
- Blog and course content
- FAQ management
- Contact form
- Email notifications (Resend)
- System health checks

### 🔧 In Development
- PIX payment endpoints
- Transaction chat system
- Advanced order matching

### ⚠️ Known Limitations
- WhatsApp integration not available
- CPF validation pending implementation

## Support

For API support:
- Email: contato@rioporto.com
- WhatsApp: +55 21 2018-7776 (manual support only)