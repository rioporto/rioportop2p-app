# PIX Payment System Documentation

## Overview

The RioPorto P2P platform now includes a complete PIX payment system for cryptocurrency transactions. This system allows users to pay via PIX when buying crypto and receive PIX payments when selling.

## Features

### 1. PIX Key Management
- Users can add multiple PIX keys (CPF, CNPJ, Email, Phone, Random)
- Key validation and verification system
- Admin interface for managing and verifying PIX keys
- Support for multiple banks

### 2. Payment Flow

#### For Buyers:
1. Select PIX as payment method
2. View seller's PIX details (QR Code or copy-paste key)
3. Make payment through their bank
4. Upload payment proof
5. Wait for seller confirmation

#### For Sellers:
1. Register PIX keys in settings
2. Receive payment notification
3. Verify payment in bank account
4. Release cryptocurrency

### 3. Components

#### PIX Components (`/src/components/pix/`)
- `PixQRCodeDisplay.tsx` - Displays QR code and PIX details
- `PixKeyManager.tsx` - Manage user's PIX keys
- `PixPaymentInstructions.tsx` - Complete payment instructions
- `PixPaymentConfirmation.tsx` - Upload payment proof

#### Database Tables
- `pix_keys` - Stores user PIX keys
- `pix_payment_details` - Transaction-specific PIX information
- `pix_webhooks` - Webhook logs for payment confirmations

### 4. API Endpoints

#### PIX Payment Creation
```
POST /api/pix/create-payment
Authorization: Bearer <token>
Body: { transactionId: string }
```

#### PIX Webhook Handler
```
POST /api/webhooks/pix?provider=<provider>
```

Supports providers:
- MercadoPago
- PagSeguro
- Gerencianet/Efí
- Manual confirmation

### 5. Provider Integration

The system is designed to work with multiple PIX payment providers:

```typescript
import { createPixProvider } from '@/lib/pix/providers'

const provider = createPixProvider('mercadopago', {
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
})

const payment = await provider.createPayment({
  amount: 100.00,
  description: 'Buy 0.001 BTC',
  externalReference: 'transaction-id'
})
```

### 6. Security Features

- PIX key ownership verification
- Payment proof upload with file validation
- Transaction timeout system
- Webhook signature verification
- Admin verification for PIX keys

## Configuration

### Environment Variables

```env
# PIX Provider (mercadopago, pagseguro, gerencianet, manual)
PIX_PROVIDER=manual

# Provider-specific credentials
MERCADOPAGO_ACCESS_TOKEN=your_token
PAGSEGURO_EMAIL=your_email
PAGSEGURO_TOKEN=your_token
GERENCIANET_CLIENT_ID=your_client_id
GERENCIANET_CLIENT_SECRET=your_client_secret

# Webhook secrets
PIX_WEBHOOK_SECRET_MERCADOPAGO=your_secret
PIX_WEBHOOK_SECRET_PAGSEGURO=your_secret
PIX_WEBHOOK_SECRET_GERENCIANET=your_secret
```

### Database Setup

Run the migrations:
```bash
supabase migration up
```

This will create:
- PIX-related tables
- Storage bucket for payment proofs
- Row Level Security policies

## Usage

### Adding PIX Keys (User)

1. Navigate to Dashboard → PIX Settings
2. Click "Add PIX Key"
3. Select key type and enter details
4. Save the key

### Processing Transactions

1. **Buyer creates order** with PIX payment method
2. **System generates PIX payment details** from seller's active key
3. **Buyer makes payment** using QR code or PIX key
4. **Buyer uploads proof** of payment
5. **Seller verifies payment** in their bank
6. **Seller releases cryptocurrency**
7. **Transaction completed**

### Admin Management

1. Navigate to Admin → Financial → PIX Keys
2. View all registered PIX keys
3. Verify keys manually
4. Enable/disable keys
5. View key details and history

## Integration with Payment Providers

### MercadoPago Integration

```typescript
// Configure in environment
PIX_PROVIDER=mercadopago
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxx

// Webhook URL
https://your-domain.com/api/webhooks/pix?provider=mercadopago
```

### Manual PIX (Default)

For manual PIX transactions:
- System generates QR codes locally
- Users confirm payments manually
- No external API required

## Troubleshooting

### Common Issues

1. **QR Code not generating**
   - Check if transaction has seller's PIX key
   - Verify PIX key is active

2. **Payment proof upload failing**
   - Check file size (max 5MB)
   - Verify file type (JPG, PNG, PDF)

3. **Webhook not processing**
   - Verify webhook secret in environment
   - Check provider configuration

## Future Enhancements

1. Automatic payment verification via bank APIs
2. Support for PIX scheduling
3. Integration with more payment providers
4. PIX key rotation system
5. Advanced fraud detection