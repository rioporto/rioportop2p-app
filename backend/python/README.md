# RioPortoP2P Backend API

Production-ready FastAPI backend for the P2P Bitcoin trading platform.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Registration & Login**: Email/password authentication with CPF validation
- **Bitcoin Price Quotes**: Real-time BTC prices from CoinGecko API (with fallback)
- **Transaction Management**: Create, view, and manage P2P transactions
- **KYC Level System**: 3-tier KYC with transaction limits
- **Admin Functions**: KYC level updates and platform statistics
- **Supabase Integration**: PostgreSQL database via Supabase
- **Security**: CORS, password validation, JWT tokens, input validation
- **Error Handling**: Comprehensive error handling with logging
- **Health Checks**: API and database health monitoring

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon key
- `JWT_SECRET_KEY`: Strong secret key for JWT tokens

### 3. Database Setup

Create the following tables in Supabase:

#### Users Table
```sql
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    phone VARCHAR(11) NOT NULL,
    kyc_level INTEGER DEFAULT 1 CHECK (kyc_level >= 1 AND kyc_level <= 3),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Transactions Table
```sql
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(10) CHECK (type IN ('buy', 'sell')),
    amount_brl DECIMAL(10, 2) NOT NULL,
    amount_btc DECIMAL(10, 8) NOT NULL,
    price_per_btc DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('pix', 'bank_transfer')),
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Run the Application

Development:
```bash
python app.py
```

Production with Docker:
```bash
docker build -t rioportop2p-backend .
docker run -p 8000:8000 --env-file .env rioportop2p-backend
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Bitcoin Price
- `GET /api/bitcoin/price` - Get current BTC price

### Transactions
- `POST /api/transactions` - Create new transaction (auth required)
- `GET /api/transactions` - List user transactions (auth required)
- `GET /api/transactions/{id}` - Get transaction details (auth required)

### User
- `GET /api/user/profile` - Get user profile (auth required)

### Admin
- `PATCH /api/admin/kyc` - Update user KYC level (admin only)
- `GET /api/admin/stats` - Platform statistics (admin only)

### Health
- `GET /health` - API health check

## KYC Levels and Limits

- **Level 1**: R$ 1,000 per transaction
- **Level 2**: R$ 10,000 per transaction  
- **Level 3**: R$ 100,000 per transaction

## Security Features

- Bcrypt password hashing
- JWT token authentication
- CORS protection
- Input validation with Pydantic
- SQL injection protection via Supabase
- Rate limiting (configure in production)
- Comprehensive error logging

## API Documentation

Once running, access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc