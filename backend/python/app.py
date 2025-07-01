import os
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field, validator
from passlib.context import CryptContext
from jose import JWTError, jwt
from supabase import create_client, Client
import httpx
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24
BITCOIN_API_URL = "https://api.coingecko.com/api/v3/simple/price"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2, max_length=100)
    cpf: str = Field(..., regex="^[0-9]{11}$")
    phone: str = Field(..., regex="^[0-9]{10,11}$")
    
    @validator('password')
    def validate_password(cls, v):
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in v):
            raise ValueError('Password must contain at least one lowercase letter')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    cpf: str
    phone: str
    kyc_level: int
    is_admin: bool
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TransactionCreate(BaseModel):
    type: str = Field(..., regex="^(buy|sell)$")
    amount_brl: float = Field(..., gt=0)
    amount_btc: float = Field(..., gt=0)
    price_per_btc: float = Field(..., gt=0)
    payment_method: str = Field(..., regex="^(pix|bank_transfer)$")
    description: Optional[str] = None

class TransactionResponse(BaseModel):
    id: str
    user_id: str
    type: str
    amount_brl: float
    amount_btc: float
    price_per_btc: float
    payment_method: str
    status: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

class KYCUpdateRequest(BaseModel):
    user_id: str
    kyc_level: int = Field(..., ge=1, le=3)

class BitcoinPriceResponse(BaseModel):
    price_brl: float
    price_usd: float
    last_updated: datetime
    change_24h: float
    volume_24h: float

class PlatformStats(BaseModel):
    total_users: int
    total_transactions: int
    total_volume_brl: float
    total_volume_btc: float
    active_users_24h: int
    transactions_24h: int
    average_transaction_brl: float

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up FastAPI application...")
    yield
    # Shutdown
    logger.info("Shutting down FastAPI application...")

# Create FastAPI app
app = FastAPI(
    title="RioPortoP2P API",
    description="Backend API for P2P Bitcoin trading platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://rioportop2p.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    response = supabase.table("users").select("*").eq("id", user_id).single().execute()
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return response.data

async def get_admin_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Endpoints
@app.get("/")
async def root():
    return {"message": "RioPortoP2P API is running", "version": "1.0.0"}

@app.post("/api/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    try:
        # Check if user already exists
        existing_user = supabase.table("users").select("*").eq("email", user_data.email).execute()
        if existing_user.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if CPF already exists
        existing_cpf = supabase.table("users").select("*").eq("cpf", user_data.cpf).execute()
        if existing_cpf.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CPF already registered"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user
        user_dict = user_data.dict()
        user_dict["password"] = hashed_password
        user_dict["kyc_level"] = 1  # Default KYC level
        user_dict["is_admin"] = False
        user_dict["created_at"] = datetime.now(timezone.utc).isoformat()
        
        response = supabase.table("users").insert(user_dict).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        user = response.data[0]
        
        # Create access token
        access_token = create_access_token(data={"sub": user["id"]})
        
        # Prepare user response
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            cpf=user["cpf"],
            phone=user["phone"],
            kyc_level=user["kyc_level"],
            is_admin=user["is_admin"],
            created_at=user["created_at"]
        )
        
        logger.info(f"New user registered: {user['email']}")
        
        return TokenResponse(access_token=access_token, user=user_response)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    try:
        # Get user by email
        response = supabase.table("users").select("*").eq("email", credentials.email).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = response.data[0]
        
        # Verify password
        if not verify_password(credentials.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token = create_access_token(data={"sub": user["id"]})
        
        # Prepare user response
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            cpf=user["cpf"],
            phone=user["phone"],
            kyc_level=user["kyc_level"],
            is_admin=user["is_admin"],
            created_at=user["created_at"]
        )
        
        logger.info(f"User logged in: {user['email']}")
        
        return TokenResponse(access_token=access_token, user=user_response)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@app.get("/api/bitcoin/price", response_model=BitcoinPriceResponse)
async def get_bitcoin_price():
    try:
        # Fetch from CoinGecko API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                BITCOIN_API_URL,
                params={
                    "ids": "bitcoin",
                    "vs_currencies": "brl,usd",
                    "include_24hr_change": "true",
                    "include_24hr_vol": "true"
                }
            )
            
        if response.status_code != 200:
            # Return mock data if API fails
            logger.warning("Bitcoin API failed, returning mock data")
            return BitcoinPriceResponse(
                price_brl=250000.0,
                price_usd=50000.0,
                last_updated=datetime.now(timezone.utc),
                change_24h=2.5,
                volume_24h=1000000000.0
            )
        
        data = response.json()
        bitcoin_data = data.get("bitcoin", {})
        
        return BitcoinPriceResponse(
            price_brl=bitcoin_data.get("brl", 250000.0),
            price_usd=bitcoin_data.get("usd", 50000.0),
            last_updated=datetime.now(timezone.utc),
            change_24h=bitcoin_data.get("brl_24h_change", 0.0),
            volume_24h=bitcoin_data.get("brl_24h_vol", 0.0)
        )
        
    except Exception as e:
        logger.error(f"Bitcoin price fetch error: {str(e)}")
        # Return mock data on error
        return BitcoinPriceResponse(
            price_brl=250000.0,
            price_usd=50000.0,
            last_updated=datetime.now(timezone.utc),
            change_24h=2.5,
            volume_24h=1000000000.0
        )

@app.post("/api/transactions", response_model=TransactionResponse)
async def create_transaction(
    transaction: TransactionCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        # Check KYC level limits
        kyc_level = current_user.get("kyc_level", 1)
        amount_brl = transaction.amount_brl
        
        # KYC limits (example values)
        kyc_limits = {
            1: 1000.0,    # R$ 1,000 per transaction
            2: 10000.0,   # R$ 10,000 per transaction
            3: 100000.0   # R$ 100,000 per transaction
        }
        
        if amount_brl > kyc_limits.get(kyc_level, 1000.0):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Transaction amount exceeds KYC level {kyc_level} limit"
            )
        
        # Create transaction
        transaction_data = {
            "user_id": current_user["id"],
            "type": transaction.type,
            "amount_brl": transaction.amount_brl,
            "amount_btc": transaction.amount_btc,
            "price_per_btc": transaction.price_per_btc,
            "payment_method": transaction.payment_method,
            "status": "pending",
            "description": transaction.description,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        response = supabase.table("transactions").insert(transaction_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create transaction"
            )
        
        created_transaction = response.data[0]
        
        logger.info(f"Transaction created: {created_transaction['id']} by user {current_user['email']}")
        
        return TransactionResponse(**created_transaction)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Transaction creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create transaction"
        )

@app.get("/api/transactions", response_model=List[TransactionResponse])
async def get_transactions(
    current_user: Dict[str, Any] = Depends(get_current_user),
    limit: int = 50,
    offset: int = 0
):
    try:
        # Get user's transactions
        response = supabase.table("transactions")\
            .select("*")\
            .eq("user_id", current_user["id"])\
            .order("created_at", desc=True)\
            .limit(limit)\
            .offset(offset)\
            .execute()
        
        transactions = response.data or []
        
        return [TransactionResponse(**t) for t in transactions]
        
    except Exception as e:
        logger.error(f"Get transactions error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch transactions"
        )

@app.get("/api/transactions/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        # Get transaction
        response = supabase.table("transactions")\
            .select("*")\
            .eq("id", transaction_id)\
            .single()\
            .execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        
        transaction = response.data
        
        # Check if user owns the transaction or is admin
        if transaction["user_id"] != current_user["id"] and not current_user.get("is_admin", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return TransactionResponse(**transaction)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get transaction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch transaction"
        )

@app.patch("/api/admin/kyc", response_model=Dict[str, str])
async def update_kyc_level(
    kyc_update: KYCUpdateRequest,
    admin_user: Dict[str, Any] = Depends(get_admin_user)
):
    try:
        # Update user's KYC level
        response = supabase.table("users")\
            .update({"kyc_level": kyc_update.kyc_level})\
            .eq("id", kyc_update.user_id)\
            .execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        logger.info(f"KYC level updated for user {kyc_update.user_id} to level {kyc_update.kyc_level} by admin {admin_user['email']}")
        
        return {"message": f"KYC level updated to {kyc_update.kyc_level}"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"KYC update error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update KYC level"
        )

@app.get("/api/admin/stats", response_model=PlatformStats)
async def get_platform_stats(
    admin_user: Dict[str, Any] = Depends(get_admin_user)
):
    try:
        # Get total users
        users_response = supabase.table("users").select("*", count="exact").execute()
        total_users = users_response.count or 0
        
        # Get total transactions
        transactions_response = supabase.table("transactions").select("*", count="exact").execute()
        total_transactions = transactions_response.count or 0
        
        # Get all transactions for volume calculation
        all_transactions = supabase.table("transactions").select("amount_brl, amount_btc").execute()
        
        total_volume_brl = sum(t["amount_brl"] for t in all_transactions.data or [])
        total_volume_btc = sum(t["amount_btc"] for t in all_transactions.data or [])
        
        # Get 24h stats
        yesterday = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
        
        # Active users in last 24h (based on transactions)
        active_users_response = supabase.table("transactions")\
            .select("user_id", count="exact")\
            .gte("created_at", yesterday)\
            .execute()
        active_users_24h = len(set(t["user_id"] for t in active_users_response.data or []))
        
        # Transactions in last 24h
        transactions_24h_response = supabase.table("transactions")\
            .select("*", count="exact")\
            .gte("created_at", yesterday)\
            .execute()
        transactions_24h = transactions_24h_response.count or 0
        
        # Calculate average transaction
        average_transaction_brl = total_volume_brl / total_transactions if total_transactions > 0 else 0
        
        return PlatformStats(
            total_users=total_users,
            total_transactions=total_transactions,
            total_volume_brl=total_volume_brl,
            total_volume_btc=total_volume_btc,
            active_users_24h=active_users_24h,
            transactions_24h=transactions_24h,
            average_transaction_brl=average_transaction_brl
        )
        
    except Exception as e:
        logger.error(f"Platform stats error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch platform statistics"
        )

@app.get("/api/user/profile", response_model=UserResponse)
async def get_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        cpf=current_user["cpf"],
        phone=current_user["phone"],
        kyc_level=current_user["kyc_level"],
        is_admin=current_user.get("is_admin", False),
        created_at=current_user["created_at"]
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Check Supabase connection
        supabase.table("users").select("id").limit(1).execute()
        supabase_status = "healthy"
    except:
        supabase_status = "unhealthy"
    
    return {
        "status": "healthy" if supabase_status == "healthy" else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "api": "healthy",
            "database": supabase_status
        }
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTP error: {exc.status_code} - {exc.detail}")
    return {
        "error": {
            "code": exc.status_code,
            "message": exc.detail,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    }

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {str(exc)}", exc_info=True)
    return {
        "error": {
            "code": 500,
            "message": "Internal server error",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )