"""Database models for Study Buddy & Friendship system."""
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Index, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.infrastructure.database.connection import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Friendship(Base):
    """Friendship and study buddy connection between two users."""
    __tablename__ = 'friendships'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    sender_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    receiver_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    status = Column(String(20), default='PENDING', nullable=False)  # PENDING, ACCEPTED, REJECTED
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)

    sender = relationship('User', foreign_keys=[sender_id])
    receiver = relationship('User', foreign_keys=[receiver_id])

    __table_args__ = (
        UniqueConstraint('sender_id', 'receiver_id', name='uq_friendship_sender_receiver'),
        Index('idx_friendships_receiver_status', 'receiver_id', 'status'),
        Index('idx_friendships_sender_status', 'sender_id', 'status'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

