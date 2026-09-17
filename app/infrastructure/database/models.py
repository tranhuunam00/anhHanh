import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Float,
    Boolean,
    DateTime,
    Date,
    ForeignKey,
    JSON,
    func
)
from sqlalchemy.orm import relationship
from app.infrastructure.database.connection import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    google_id = Column(String(100), unique=True, nullable=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(20), default='USER', nullable=False)
    avatar_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    lessons = relationship('UserLesson', back_populates='user', cascade='all, delete-orphan')
    vocabulary = relationship('UserVocabulary', back_populates='user', cascade='all, delete-orphan')
    streak = relationship('UserStreak', back_populates='user', uselist=False, cascade='all, delete-orphan')
    feedbacks = relationship('Feedback', back_populates='user', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Lesson(Base):
    __tablename__ = 'lessons'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    video_id = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(500), nullable=False)
    thumbnail_url = Column(Text, nullable=False)
    total_challenges = Column(Integer, default=0, nullable=False)
    sentences_data = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user_lessons = relationship('UserLesson', back_populates='lesson', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'video_id': self.video_id,
            'title': self.title,
            'thumbnail_url': self.thumbnail_url,
            'total_challenges': self.total_challenges,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class UserLesson(Base):
    __tablename__ = 'user_lessons'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    lesson_id = Column(String(36), ForeignKey('lessons.id', ondelete='CASCADE'), nullable=False, index=True)
    current_position = Column(Integer, default=1, nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    started_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    last_studied_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship('User', back_populates='lessons')
    lesson = relationship('Lesson', back_populates='user_lessons')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'lesson_id': self.lesson_id,
            'current_position': self.current_position,
            'is_completed': self.is_completed,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'last_studied_at': self.last_studied_at.isoformat() if self.last_studied_at else None,
        }


class UserVocabulary(Base):
    __tablename__ = 'user_vocabulary'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    word = Column(String(100), nullable=False, index=True)
    phonetic = Column(String(100), nullable=True)
    meaning = Column(Text, nullable=False)
    context_sentence = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    video_id = Column(String(50), nullable=True)
    video_timestamp = Column(Float, nullable=True)
    status = Column(String(20), default='NEW', nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship('User', back_populates='vocabulary')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'word': self.word,
            'phonetic': self.phonetic,
            'meaning': self.meaning,
            'context_sentence': self.context_sentence,
            'image_url': self.image_url,
            'video_id': self.video_id,
            'video_timestamp': self.video_timestamp,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class UserStreak(Base):
    __tablename__ = 'user_streaks'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False, index=True)
    current_streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    words_today = Column(Integer, default=0, nullable=False)
    last_study_date = Column(Date, nullable=True)

    user = relationship('User', back_populates='streak')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'current_streak': self.current_streak,
            'longest_streak': self.longest_streak,
            'words_today': self.words_today,
            'last_study_date': self.last_study_date.isoformat() if self.last_study_date else None,
        }


class Feedback(Base):
    __tablename__ = 'feedbacks'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    feedback_type = Column(String(50), default='GENERAL', nullable=False)
    rating = Column(Integer, nullable=True)
    content = Column(Text, nullable=False)
    status = Column(String(20), default='PENDING', nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship('User', back_populates='feedbacks')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else None,
            'user_email': self.user.email if self.user else None,
            'feedback_type': self.feedback_type,
            'rating': self.rating,
            'content': self.content,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
