import uuid
import json
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
    func,
    inspect,
    Index
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
    feedback_messages = relationship('FeedbackMessage', back_populates='user', cascade='all, delete-orphan')

    @property
    def can_use_ai_import(self) -> bool:
        if not self.email:
            return False
        em = self.email.strip().lower()
        handle = em.split('@')[0]
        nm = (self.name or '').strip().lower()
        if handle in {'tranhuunam23022000', 'vuthiquynhtrang', 'vuthiquynhtrangbl6d'}:
            return True
        if 'tranhuunam23022000' in em or 'vuthiquynhtrang' in em or 'vuthiquynhtrangbl6d' in em:
            return True
        if 'tranhuunam23022000' in nm or 'vuthiquynhtrang' in nm or 'vuthiquynhtrangbl6d' in nm:
            return True
        return False

    @property
    def can_use_ai_writing(self) -> bool:
        return self.can_use_ai_import

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'avatar_url': self.avatar_url,
            'can_use_ai_import': self.can_use_ai_import,
            'can_use_ai_writing': self.can_use_ai_writing,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Lesson(Base):
    __tablename__ = 'lessons'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    video_id = Column(String(50), unique=True, nullable=False, index=True)
    youtube_url = Column(Text, nullable=True)
    title = Column(String(500), nullable=False)
    thumbnail_url = Column(Text, nullable=False)
    total_challenges = Column(Integer, default=0, nullable=False)
    sentences_data = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user_lessons = relationship('UserLesson', back_populates='lesson', cascade='all, delete-orphan')
    subtitles = relationship('LessonSubtitle', back_populates='lesson', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'video_id': self.video_id,
            'youtube_url': self.youtube_url,
            'title': self.title,
            'thumbnail_url': self.thumbnail_url,
            'total_challenges': self.total_challenges,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class LessonSubtitle(Base):
    """Raw subtitle cache per video × language, fetched from YouTube."""
    __tablename__ = 'lesson_subtitles'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    lesson_id = Column(String(36), ForeignKey('lessons.id', ondelete='CASCADE'), nullable=False, index=True)
    lang_code = Column(String(20), nullable=False)
    raw_data = Column(JSON, nullable=False, default=list)
    fetched_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    lesson = relationship('Lesson', back_populates='subtitles')

    def to_dict(self):
        return {
            'id': self.id,
            'lesson_id': self.lesson_id,
            'lang_code': self.lang_code,
            'fetched_at': self.fetched_at.isoformat() if self.fetched_at else None,
        }


class UserLesson(Base):
    __tablename__ = 'user_lessons'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    lesson_id = Column(String(36), ForeignKey('lessons.id', ondelete='CASCADE'), nullable=False, index=True)
    source_lang = Column(String(20), nullable=False, default='en')
    target_lang = Column(String(20), nullable=False, default='vi')
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
            'source_lang': self.source_lang,
            'target_lang': self.target_lang,
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
    next_review_at = Column(DateTime(timezone=True), default=func.now(), nullable=True)
    review_interval_days = Column(Integer, default=1, nullable=False)
    mastery_score = Column(Integer, default=0, nullable=False)
    source_lang = Column(String(10), default='en', nullable=True)
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
            'source_lang': self.source_lang or 'en',
            'next_review_at': self.next_review_at.isoformat() if self.next_review_at else None,
            'review_interval_days': self.review_interval_days,
            'mastery_score': self.mastery_score,
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
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=True, index=True)
    sender_name = Column(String(100), default='Ẩn danh', nullable=True)
    sender_email = Column(String(255), nullable=True)
    feedback_type = Column(String(50), default='GENERAL', nullable=False)
    rating = Column(Integer, nullable=True)
    content = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    status = Column(String(20), default='PENDING', nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship('User', back_populates='feedbacks')
    messages = relationship('FeedbackMessage', back_populates='feedback', cascade='all, delete-orphan', order_by='FeedbackMessage.created_at.asc()')

    def to_dict(self):
        user_name = self.sender_name or 'Ẩn danh'
        user_email = self.sender_email or ''
        user_avatar = None
        messages_list = []
        unread_admin_messages = 0
        unread_user_messages = 0
        try:
            ins = inspect(self)
            if "user" in ins.dict and self.user is not None:
                user_name = self.user.name or user_name
                user_email = self.user.email or user_email
                user_avatar = self.user.avatar_url
            if "messages" in ins.dict and self.messages is not None:
                messages_list = [m.to_dict() for m in self.messages]
                unread_admin_messages = sum(1 for m in self.messages if not m.is_read and m.sender_role == 'ADMIN')
                unread_user_messages = sum(1 for m in self.messages if not m.is_read and m.sender_role == 'USER')
        except Exception:
            pass

        user_obj = {
            'id': self.user_id,
            'name': user_name or 'Ẩn danh',
            'email': user_email or '',
            'avatar_url': user_avatar,
        }

        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': user_name,
            'user_email': user_email,
            'user': user_obj,
            'feedback_type': self.feedback_type,
            'rating': self.rating,
            'content': self.content,
            'image_url': self.image_url,
            'status': self.status,
            'messages_count': len(messages_list),
            'unread_replies': unread_admin_messages,
            'unread_user_messages': unread_user_messages,
            'has_unread_messages': unread_user_messages > 0,
            'messages': messages_list,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class FeedbackMessage(Base):
    __tablename__ = 'feedback_messages'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    feedback_id = Column(String(36), ForeignKey('feedbacks.id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    sender_role = Column(String(20), nullable=False)  # 'ADMIN' or 'USER'
    message = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    feedback = relationship('Feedback', back_populates='messages')
    user = relationship('User', back_populates='feedback_messages')

    def to_dict(self):
        user_name = None
        user_avatar = None
        try:
            ins = inspect(self)
            if "user" in ins.dict and self.user is not None:
                user_name = self.user.name
                user_avatar = self.user.avatar_url
        except Exception:
            pass

        return {
            'id': self.id,
            'feedback_id': self.feedback_id,
            'user_id': self.user_id,
            'sender_role': self.sender_role,
            'sender_name': user_name or ('Quản trị viên' if self.sender_role == 'ADMIN' else 'Học viên'),
            'sender_avatar': user_avatar,
            'message': self.message,
            'image_url': self.image_url,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class DictionaryWord(Base):
    """Global dictionary cache table storing single-word definitions, IPA phonetics, and translations.
    Prevents repeated external API calls and delivers instant sub-millisecond lookups.
    """
    __tablename__ = 'dictionary_words'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    word = Column(String(100), unique=True, nullable=False, index=True)
    ipa = Column(String(150), nullable=True)
    ipa_uk = Column(String(150), nullable=True)
    ipa_us = Column(String(150), nullable=True)
    part_of_speech = Column(String(50), nullable=True)
    definition = Column(Text, nullable=True)
    meaning = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)

    def to_dict(self):
        return {
            'word': self.word,
            'ipa': self.ipa,
            'ipa_uk': self.ipa_uk,
            'ipa_us': self.ipa_us,
            'part_of_speech': self.part_of_speech,
            'definition': self.definition,
            'meaning': self.meaning,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class WritingSubmission(Base):
    """User writing practice submissions with AI evaluation, scores, and feedback."""
    __tablename__ = 'writing_submissions'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    topic = Column(Text, nullable=False)
    genre = Column(String(50), nullable=False, default='ielts_task2')  # 'ielts_task2', 'ielts_task1', 'email', 'paragraph', 'free'
    content = Column(Text, nullable=False)
    word_count = Column(Integer, nullable=False, default=0)
    target_band = Column(Float, nullable=True, default=7.0)
    overall_score = Column(Float, nullable=True)
    task_response_score = Column(Float, nullable=True)
    coherence_score = Column(Float, nullable=True)
    lexical_score = Column(Float, nullable=True)
    grammar_score = Column(Float, nullable=True)
    feedback_json = Column(Text, nullable=True)  # JSON-serialized AI feedback
    language = Column(String(10), nullable=False, default='en')  # 'en', 'ja', 'zh', 'ko', 'fr', 'de'
    sub_type = Column(String(50), nullable=True, default='general')  # line_graph, bar_chart, pie_chart, table, process, map, opinion, discussion...
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship('User', backref='writing_submissions')

    def to_dict(self):
        feedback_data = None
        if self.feedback_json:
            try:
                feedback_data = json.loads(self.feedback_json)
            except Exception:
                feedback_data = None

        return {
            'id': self.id,
            'user_id': self.user_id,
            'topic': self.topic,
            'genre': self.genre,
            'sub_type': self.sub_type or 'general',
            'language': self.language or 'en',
            'content': self.content,
            'word_count': self.word_count,
            'target_band': self.target_band,
            'overall_score': self.overall_score,
            'task_response_score': self.task_response_score,
            'coherence_score': self.coherence_score,
            'lexical_score': self.lexical_score,
            'grammar_score': self.grammar_score,
            'feedback': feedback_data,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class SystemVocabBank(Base):
    """System-wide curated vocabulary bank with 30 categories for multi-language learning."""
    __tablename__ = 'system_vocab_bank'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    word = Column(String(255), nullable=False, index=True)
    phonetic = Column(String(100), nullable=True)
    meaning = Column(Text, nullable=False)
    context_sentence = Column(Text, nullable=True)
    source_lang = Column(String(10), nullable=False, default='en', index=True)
    category = Column(String(50), nullable=False, index=True)
    word_type = Column(String(20), nullable=False, default='single_word', index=True)
    level = Column(String(10), nullable=True, default='B1')
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        Index('idx_sys_vocab_lang_cat', 'source_lang', 'category'),
        Index('idx_sys_vocab_lang_type', 'source_lang', 'word_type'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'word': self.word,
            'phonetic': self.phonetic,
            'meaning': self.meaning,
            'context_sentence': self.context_sentence,
            'source_lang': self.source_lang,
            'category': self.category,
            'word_type': self.word_type,
            'level': self.level,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


# Modular re-export for Destination B2
from app.infrastructure.database.destination_b2_models import (
    DestinationB2Unit,
    DestinationB2Exercise,
    DestinationB2Progress,
)
