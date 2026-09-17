import os
import logging
import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database.models import User, UserStreak

logger = logging.getLogger(__name__)


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False


async def seed_super_admin(session: AsyncSession) -> None:
    admin_email = os.getenv('ADMIN_EMAIL_ADDRESS', '').strip().lower()
    admin_password = os.getenv('ADMIN_DEFAULT_PASSWORD', '')

    if not admin_email or not admin_password:
        logger.info('ADMIN_EMAIL_ADDRESS or ADMIN_DEFAULT_PASSWORD not configured. Skipping admin auto-seed.')
        return

    result = await session.execute(select(User).where(User.email == admin_email))
    existing_admin = result.scalar_one_or_none()

    if not existing_admin:
        logger.info(f'Seeding Super Admin: {admin_email}')
        new_admin = User(
            email=admin_email,
            password_hash=hash_password(admin_password),
            name='Super Admin',
            role='ADMIN',
            avatar_url=None
        )
        session.add(new_admin)
        await session.flush()

        streak = UserStreak(
            user_id=new_admin.id,
            current_streak=0,
            longest_streak=0,
            words_today=0
        )
        session.add(streak)
        await session.commit()
        logger.info('Super Admin seeded successfully.')
    else:
        if existing_admin.role != 'ADMIN':
            existing_admin.role = 'ADMIN'
            await session.commit()
            logger.info(f'Updated {admin_email} to ADMIN role.')
