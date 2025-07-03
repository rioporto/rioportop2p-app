# 🚀 Rio Porto P2P

**A comprehensive cryptocurrency P2P trading platform built with Next.js, Supabase, and modern web technologies.**

## 🎯 Overview

Rio Porto P2P is a full-featured cryptocurrency peer-to-peer trading platform that enables users to buy and sell cryptocurrencies using PIX payments. The platform includes advanced features like KYC verification, real-time notifications, price tracking, and a complete admin dashboard.

## ✨ Key Features

### 🔐 Authentication & Security
- **Multi-factor Authentication**: Email/password, Google OAuth, TOTP 2FA
- **KYC Verification**: Multi-level verification system with document upload
- **Secure Sessions**: JWT-based authentication with refresh tokens
- **Row Level Security**: Database-level security with Supabase RLS

### 💱 Trading Features
- **P2P Trading**: Direct peer-to-peer cryptocurrency trading
- **Real-time Prices**: Live cryptocurrency prices from multiple APIs
- **PIX Integration**: Complete PIX payment system with QR codes
- **Transaction History**: Detailed transaction tracking and history
- **Price Alerts**: Customizable price alert notifications

### 📱 User Experience
- **Real-time Notifications**: WebSocket-based notification system
- **Responsive Design**: Mobile-first responsive interface
- **Dark Mode**: Complete dark mode support
- **Multi-language**: Portuguese and English support

### 🛠 Admin Features
- **User Management**: Complete user administration
- **KYC Management**: Review and approve KYC applications
- **Content Management**: Blog and course management
- **Analytics Dashboard**: Trading statistics and platform metrics
- **PIX Key Management**: Admin oversight of PIX keys

## 🛠 Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Modern icon library
- **Chart.js**: Interactive charts and graphs

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Vercel**: Deployment and hosting platform
- **Cron Jobs**: Automated price updates and notifications

### Integrations
- **PIX APIs**: MercadoPago, PagSeguro, Gerencianet
- **Crypto APIs**: Binance, CoinGecko, CryptoCompare
- **Authentication**: Supabase Auth with Google OAuth

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/rioportop2p-app.git
cd rioportop2p-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure your environment**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Vercel Configuration (optional)
VERCEL_TOKEN=your_vercel_token
VERCEL_PROJECT_ID=your_project_id
VERCEL_TEAM_ID=your_team_id

# PIX Configuration (optional)
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_token
PAGSEGURO_TOKEN=your_pagseguro_token
```

5. **Run database migrations**
```bash
npx supabase db push
```

6. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Detailed setup instructions
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Complete API reference
- **[Database Schema](./docs/DATABASE_SCHEMA.md)** - Database structure
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - How to contribute

## 🏗 Project Structure

```
rioportop2p-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   └── dashboard/      # User dashboard
│   ├── components/         # React components
│   │   ├── admin/          # Admin components
│   │   ├── auth/           # Auth components
│   │   ├── crypto/         # Crypto-related components
│   │   └── ui/             # UI components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities and configurations
│   └── types/              # TypeScript type definitions
├── supabase/
│   ├── migrations/         # Database migrations
│   └── seed.sql           # Sample data
├── docs/                   # Documentation
└── public/                 # Static assets
```

## 🔧 Development

### Running Tests
```bash
npm run test
```

### Code Quality
```bash
npm run lint
npm run typecheck
```

### Database Management
```bash
# Reset database
npx supabase db reset

# Generate types
npx supabase gen types typescript --local > src/lib/database.types.ts
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
Set these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Additional PIX and crypto API keys as needed

## 📊 Features in Detail

### User Authentication
- Email/password registration and login
- Google OAuth integration
- Two-factor authentication with TOTP
- Password reset functionality

### KYC Verification
- Multi-level verification (Basic, Intermediate, Complete)
- Document upload and verification
- CPF validation
- Phone number verification
- Address verification

### P2P Trading
- Buy/sell cryptocurrency orders
- Real-time price matching
- PIX payment integration
- Transaction tracking
- Dispute resolution system

### Admin Dashboard
- User management and analytics
- KYC application review
- Content management (blog, courses)
- Financial overview and reports
- System configuration

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details on how to get started.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

For support, please contact:
- Email: contato@rioporto.com
- WhatsApp: +55 21 2018-7776

## 🙏 Acknowledgments

- Built with ❤️ by the Rio Porto team
- Special thanks to the open-source community
- Powered by Supabase and Vercel

---

**Made with ❤️ in Rio de Janeiro, Brazil** 🇧🇷