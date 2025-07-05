# BTG Pactual PIX Integration Guide

## Overview

This document describes the BTG Pactual PIX payment integration for the Rio Porto P2P platform.

## Environment Variables

Add the following to your `.env.local`:

```bash
# BTG Pactual PIX Integration
BTG_CLIENT_ID=your_btg_client_id
BTG_CLIENT_SECRET=your_btg_client_secret
BTG_PIX_KEY=your_company_pix_key
```

## API Endpoints

### 1. Create PIX Payment
- **Endpoint**: `POST /api/pix/create-payment`
- **Purpose**: Creates a new PIX payment request
- **Request Body**:
  ```json
  {
    "amount": 100.00,
    "description": "Payment description",
    "customerName": "John Doe",
    "customerDocument": "123.456.789-00",
    "transactionId": "uuid-here"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "payment": {
      "id": "txid",
      "qrCode": "base64-qr-code",
      "qrCodeText": "pix-copy-paste-string",
      "amount": 100.00,
      "expiresAt": "2025-01-06T12:00:00Z"
    }
  }
  ```

### 2. Check Payment Status
- **Endpoint**: `GET /api/pix/status/[txid]`
- **Purpose**: Check the status of a PIX payment
- **Response**:
  ```json
  {
    "success": true,
    "payment": {
      "id": "txid",
      "status": "pending|completed|cancelled",
      "amount": 100.00,
      "expiresAt": "2025-01-06T12:00:00Z"
    }
  }
  ```

### 3. Webhook Endpoint
- **Endpoint**: `POST /api/webhooks/btg-pix`
- **Purpose**: Receives payment confirmations from BTG
- **Headers**: BTG will send authentication headers
- **Body**: BTG webhook payload format

## Components

### PixQRCodeDisplay
```tsx
import { PixQRCodeDisplay } from '@/components/pix/PixQRCodeDisplay'

<PixQRCodeDisplay
  qrCode="base64-qr-code"
  qrCodeText="pix-copy-paste"
  amount={100.00}
  expiresAt="2025-01-06T12:00:00Z"
  onPaymentConfirmed={() => console.log('Payment confirmed!')}
/>
```

### usePixPayment Hook
```tsx
import { usePixPayment } from '@/hooks/usePixPayment'

const { payment, loading, error, retry } = usePixPayment({
  transactionId: 'uuid',
  amount: 100.00,
  customerName: 'John Doe',
  customerDocument: '123.456.789-00',
  onPaymentConfirmed: () => {
    // Handle payment confirmation
  }
})
```

## Database Schema

The `pix_payments` table stores all PIX payment records:

```sql
CREATE TABLE pix_payments (
  id UUID PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  pix_id TEXT UNIQUE,
  amount DECIMAL(10, 2),
  status TEXT,
  qr_code TEXT,
  qr_code_text TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Security Considerations

1. **OAuth2 Authentication**: All API calls use OAuth2 client credentials flow
2. **Webhook Validation**: Implement signature validation for webhooks (TODO)
3. **Rate Limiting**: API calls are rate-limited to prevent abuse
4. **HTTPS Only**: All communication with BTG APIs must use HTTPS

## Testing

### Sandbox Environment
- BTG provides a sandbox environment for testing
- Use `environment: 'sandbox'` in the BTG provider configuration
- Sandbox URL: `https://api-sandbox.empresas.btgpactual.com`

### Test Flow
1. Create a test transaction
2. Generate PIX payment
3. Simulate payment confirmation (sandbox)
4. Verify webhook reception
5. Check transaction status update

## Error Handling

Common errors and solutions:

1. **Authentication Failed**: Check client credentials
2. **Invalid PIX Key**: Verify BTG_PIX_KEY format
3. **Timeout**: Implement retry logic with exponential backoff
4. **Invalid CPF/CNPJ**: Validate document before sending

## Next Steps

1. **Production Setup**:
   - Obtain production credentials from BTG
   - Configure webhook URL in BTG dashboard
   - Implement webhook signature validation

2. **Monitoring**:
   - Add error tracking for failed payments
   - Monitor webhook delivery
   - Track payment conversion rates

3. **Improvements**:
   - Add support for scheduled payments
   - Implement refund functionality
   - Add payment receipt generation

## Support

For BTG API support:
- Documentation: [BTG Developer Portal]
- Support Email: [BTG API Support]
- Phone: [BTG Business Support]

For platform issues:
- GitHub Issues: [Project Repository]
- Email: contato@rioporto.com