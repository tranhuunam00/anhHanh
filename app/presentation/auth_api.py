from typing import Optional, List
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User
from app.application.auth_service import (
    register_user_account,
    authenticate_user_email,
    authenticate_google_user,
    create_access_token,
    get_current_user,
    require_admin,
)
from app.presentation.security_middleware import limiter

router = APIRouter(prefix='/api/auth', tags=['Authentication'])
from app.application.auth_service import get_google_client_id


@router.get('/config')
async def get_auth_config():
    return {
        'google_client_id': get_google_client_id()
    }


class RegisterRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255, description="Địa chỉ email")
    password: str = Field(..., min_length=6, description="Mật khẩu tối thiểu 6 ký tự")
    name: Optional[str] = ''
    b_trap: Optional[str] = None  # Honeypot field


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255, description="Địa chỉ email")
    password: str = Field(..., description="Mật khẩu")


class GoogleAuthRequest(BaseModel):
    credential: str


@router.post('/register')
@limiter.limit('5/15minute')
async def register(
    request: Request,
    payload: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    user = await register_user_account(
        db=db,
        email=payload.email,
        password=payload.password,
        name=payload.name or '',
        honeypot=payload.b_trap
    )
    token = create_access_token({'sub': user.id, 'email': user.email, 'role': user.role, 'name': user.name})
    return {
        'message': 'Đăng ký tài khoản thành công',
        'access_token': token,
        'token_type': 'bearer',
        'user': user.to_dict()
    }


@router.post('/login')
@limiter.limit('10/15minute')
async def login(
    request: Request,
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user_email(
        db=db,
        email=payload.email,
        password=payload.password
    )
    token = create_access_token({'sub': user.id, 'email': user.email, 'role': user.role, 'name': user.name})
    return {
        'message': 'Đăng nhập thành công',
        'access_token': token,
        'token_type': 'bearer',
        'user': user.to_dict()
    }


@router.post('/google')
async def google_auth(
    request: Request,
    payload: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_google_user(
        db=db,
        credential=payload.credential
    )
    token = create_access_token({'sub': user.id, 'email': user.email, 'role': user.role, 'name': user.name})
    return {
        'message': 'Đăng nhập Google thành công',
        'access_token': token,
        'token_type': 'bearer',
        'user': user.to_dict()
    }


@router.get('/me')
async def get_me(current_user: User = Depends(get_current_user)):
    return {'user': current_user.to_dict()}


@router.get('/admin/users')
async def list_users(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return {
        'total': len(users),
        'users': [u.to_dict() for u in users]
    }
