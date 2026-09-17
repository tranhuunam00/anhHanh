import os
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
from dotenv import load_dotenv
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, Header, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, UserStreak
from app.infrastructure.database.seed import hash_password, verify_password

load_dotenv()
logger = logging.getLogger(__name__)

ADMIN_EMAIL_ADDRESS = os.getenv('ADMIN_EMAIL_ADDRESS', 'admin@example.com').strip().lower()
JWT_SECRET = os.getenv('JWT_SECRET')
if not JWT_SECRET:
    if os.getenv('NODE_ENV') == 'production':
        raise RuntimeError("CRITICAL SECURITY ERROR: JWT_SECRET must be configured in environment variables for production!")
    JWT_SECRET = 'dev_secret_key_daily_dictation_insecure_fallback_2026'
    logger.warning("JWT_SECRET environment variable not configured. Using temporary dev fallback secret.")

JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', '12'))


def get_google_client_id() -> str:
    return os.getenv('GOOGLE_CLIENT_ID', '1010771231278-42hd59gesjf8ts5ta7nra9qrfkmobgrt.apps.googleusercontent.com').strip()


GOOGLE_CLIENT_ID = get_google_client_id()

security_bearer = HTTPBearer(auto_error=False)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({'exp': expire, 'iat': now})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


async def verify_google_credential(credential: str) -> dict:
    try:
        request = google_requests.Request()
        active_client_id = get_google_client_id() or GOOGLE_CLIENT_ID
        id_info = id_token.verify_oauth2_token(credential, request, active_client_id)
        return id_info
    except Exception as e:
        logger.warning(f'Google token verification failed: {e}')
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid Google authentication token'
        )


async def register_user_account(
    db: AsyncSession,
    email: str,
    password: str,
    name: str,
    honeypot: Optional[str] = None
) -> User:
    if honeypot and honeypot.strip():
        logger.warning(f'Bot detected via Honeypot trap on email {email}. Request dropped.')
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Registration rejected')

    cleaned_email = email.strip().lower()
    if len(password) < 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Mật khẩu phải có ít nhất 6 ký tự')

    result = await db.execute(select(User).where(User.email == cleaned_email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email này đã được đăng ký')

    role = 'ADMIN' if cleaned_email == ADMIN_EMAIL_ADDRESS else 'USER'
    new_user = User(
        email=cleaned_email,
        password_hash=hash_password(password),
        name=name.strip() or cleaned_email.split('@')[0],
        role=role
    )
    db.add(new_user)
    await db.flush()

    streak = UserStreak(user_id=new_user.id, current_streak=0, longest_streak=0, words_today=0)
    db.add(streak)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def authenticate_user_email(db: AsyncSession, email: str, password: str) -> User:
    cleaned_email = email.strip().lower()
    result = await db.execute(select(User).where(User.email == cleaned_email))
    user = result.scalar_one_or_none()

    if not user or not user.password_hash:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Email hoặc mật khẩu không chính xác')

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Email hoặc mật khẩu không chính xác')

    return user


async def authenticate_google_user(db: AsyncSession, credential: str) -> User:
    id_info = await verify_google_credential(credential)
    google_id = id_info.get('sub')
    email = id_info.get('email', '').strip().lower()
    name = id_info.get('name', '') or email.split('@')[0]
    picture = id_info.get('picture')

    if not email or not google_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid Google token payload')

    result = await db.execute(select(User).where((User.google_id == google_id) | (User.email == email)))
    user = result.scalar_one_or_none()

    if user:
        if not user.google_id:
            user.google_id = google_id
        if picture and not user.avatar_url:
            user.avatar_url = picture
        if email == ADMIN_EMAIL_ADDRESS and user.role != 'ADMIN':
            user.role = 'ADMIN'
        await db.commit()
        await db.refresh(user)
        return user

    role = 'ADMIN' if email == ADMIN_EMAIL_ADDRESS else 'USER'
    user = User(
        email=email,
        google_id=google_id,
        name=name,
        role=role,
        avatar_url=picture
    )
    db.add(user)
    await db.flush()

    streak = UserStreak(user_id=user.id, current_streak=0, longest_streak=0, words_today=0)
    db.add(streak)
    await db.commit()
    await db.refresh(user)
    return user


async def get_current_user_optional(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    if not auth or not auth.credentials:
        return None

    payload = decode_access_token(auth.credentials)
    if not payload or 'sub' not in payload:
        return None

    user_id = payload['sub']
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_current_user(
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Vui lòng đăng nhập để thực hiện chức năng này',
            headers={'WWW-Authenticate': 'Bearer'}
        )
    return current_user


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != 'ADMIN':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Quyền truy cập bị từ chối: Chỉ dành cho Quản trị viên'
        )
    return current_user
