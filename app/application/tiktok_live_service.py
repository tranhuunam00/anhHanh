"""TikTok LIVE Interactive Classroom Service.

Manages real-time room sessions, TikTokLive connection listeners,
answer grading, leaderboards, and simulation testing.
"""
import asyncio
import logging
import re
from typing import Dict, List, Optional, Any
from datetime import datetime

logger = logging.getLogger(__name__)

# Sample question bank for interactive live sessions
DEFAULT_LIVE_QUESTIONS = [
    {
        "id": "q1",
        "type": "quiz",
        "question": "Which word is a synonym for 'meticulous'?",
        "options": ["A. Careless", "B. Thorough", "C. Fast", "D. Lazy"],
        "answer": "B",
        "explanation": "'Meticulous' có nghĩa là tỉ mỉ, cẩn thận từng chi tiết = 'Thorough'.",
        "timer_seconds": 20
    },
    {
        "id": "q2",
        "type": "quiz",
        "question": "Choose the correct preposition: 'She is capable ___ handling this project.'",
        "options": ["A. with", "B. to", "C. of", "D. in"],
        "answer": "C",
        "explanation": "Cấu trúc: capable OF doing something (có khả năng làm gì).",
        "timer_seconds": 20
    },
    {
        "id": "q3",
        "type": "quiz",
        "question": "Find the OPPOSITE of 'ubiquitous':",
        "options": ["A. Common", "B. Rare", "C. Popular", "D. Omnipresent"],
        "answer": "B",
        "explanation": "'Ubiquitous' = phổ biến khắp nơi. Trái nghĩa là 'Rare' (hiếm gặp).",
        "timer_seconds": 20
    },
    {
        "id": "q4",
        "type": "quiz",
        "question": "What does the idiom 'hit the sack' mean?",
        "options": ["A. Go to sleep", "B. Punch someone", "C. Go shopping", "D. Start working"],
        "answer": "A",
        "explanation": "'Hit the sack' / 'Hit the hay' là thành ngữ chỉ việc đi ngủ.",
        "timer_seconds": 20
    },
    {
        "id": "q5",
        "type": "quiz",
        "question": "Destination B2: 'He was accused ___ committing the fraud.'",
        "options": ["A. with", "B. for", "C. of", "D. about"],
        "answer": "C",
        "explanation": "Cấu trúc Collocation chuẩn: accused OF something / doing something.",
        "timer_seconds": 20
    },
    {
        "id": "q6",
        "type": "quiz",
        "question": "Which syllable is stressed in 'PHOTOGRAPH'?",
        "options": ["A. 1st (PHO-)", "B. 2nd (-TO-)", "C. 3rd (-GRAPH)"],
        "answer": "A",
        "explanation": "Danh từ 'photograph' trọng âm rơi vào âm tiết thứ nhất: /ˈfoʊ.tə.ɡræf/.",
        "timer_seconds": 15
    },
    {
        "id": "q7",
        "type": "quiz",
        "question": "IELTS Academic: 'The government should take measures to ___ emissions.'",
        "options": ["A. enlarge", "B. curb", "C. promote", "D. elevate"],
        "answer": "B",
        "explanation": "'Curb emissions' = kiểm soát, cắt giảm khí thải (Collocation Band 7.5+).",
        "timer_seconds": 20
    }
]


def normalize_answer_input(raw: str) -> str:
    """Extract clean answer letter (A, B, C, D) or normalized text."""
    if not raw:
        return ""
    cleaned = raw.strip().upper()
    # Check if starts with A, B, C, D (e.g., "A", "A.", "DAP AN B", "Chon C")
    match = re.search(r"\b([A-D])\b|^([A-D])[.\s\)]", cleaned)
    if match:
        return match.group(1) or match.group(2)
    return cleaned


class TikTokLiveSession:
    """Session state for an interactive TikTok LIVE classroom."""

    def __init__(self, room_id: str = "default"):
        self.room_id = room_id
        self.unique_id: str = ""
        self.status: str = "disconnected"  # disconnected, connecting, connected, error
        self.error_message: str = ""
        self.client: Optional[Any] = None
        self.listen_task: Optional[asyncio.Task] = None

        # Game state
        self.questions: List[Dict[str, Any]] = list(DEFAULT_LIVE_QUESTIONS)
        self.current_question_index: int = 0
        self.is_round_active: bool = False
        self.round_start_time: Optional[datetime] = None
        self.answered_users_this_round: Dict[str, Dict[str, Any]] = {}  # user_id -> info
        self.vote_counts: Dict[str, int] = {"A": 0, "B": 0, "C": 0, "D": 0}

        # Stats & Leaderboard
        self.leaderboard: Dict[str, Dict[str, Any]] = {}  # user_id -> stats
        self.total_comments: int = 0
        self.total_likes: int = 0
        self.total_gifts: int = 0
        self.recent_events: List[Dict[str, Any]] = []

        # Listeners (WebSocket queues for browser clients)
        self.subscribers: List[asyncio.Queue] = []

    def get_current_question(self) -> Optional[Dict[str, Any]]:
        """Return current active question or None."""
        if 0 <= self.current_question_index < len(self.questions):
            return self.questions[self.current_question_index]
        return None

    def start_round(self) -> Dict[str, Any]:
        """Start a new question round."""
        q = self.get_current_question()
        if not q:
            return {}
        self.is_round_active = True
        self.round_start_time = datetime.now()
        self.answered_users_this_round.clear()
        self.vote_counts = {"A": 0, "B": 0, "C": 0, "D": 0}

        event = {
            "type": "ROUND_START",
            "question": q,
            "question_index": self.current_question_index,
            "total_questions": len(self.questions),
            "timer_seconds": q.get("timer_seconds", 20)
        }
        self.broadcast(event)
        return event

    def end_round(self) -> Dict[str, Any]:
        """End current question round and announce answer."""
        q = self.get_current_question()
        self.is_round_active = False

        winners = [
            u for u in self.answered_users_this_round.values()
            if u.get("is_correct")
        ]
        # Sort winners by timestamp
        winners.sort(key=lambda x: x.get("timestamp", ""))

        event = {
            "type": "ROUND_END",
            "question": q,
            "correct_answer": q.get("answer") if q else "",
            "explanation": q.get("explanation") if q else "",
            "vote_counts": dict(self.vote_counts),
            "winners_count": len(winners),
            "first_winner": winners[0] if winners else None
        }
        self.broadcast(event)
        return event

    def next_question(self) -> Dict[str, Any]:
        """Advance to next question."""
        if self.current_question_index < len(self.questions) - 1:
            self.current_question_index += 1
        else:
            self.current_question_index = 0
        return self.start_round()

    def process_comment(
        self,
        user_id: str,
        nickname: str,
        comment: str,
        avatar_url: str = ""
    ) -> Dict[str, Any]:
        """Process incoming comment from TikTok or simulator."""
        self.total_comments += 1
        clean_ans = normalize_answer_input(comment)

        # Track vote if in A, B, C, D
        if clean_ans in self.vote_counts:
            self.vote_counts[clean_ans] = self.vote_counts.get(clean_ans, 0) + 1

        is_correct = False
        points_awarded = 0
        q = self.get_current_question()

        if self.is_round_active and q and user_id not in self.answered_users_this_round:
            target_answer = q.get("answer", "").strip().upper()
            if clean_ans == target_answer:
                is_correct = True
                # Fast answer bonus
                already_correct = sum(
                    1 for u in self.answered_users_this_round.values() if u.get("is_correct")
                )
                if already_correct == 0:
                    points_awarded = 100  # 1st place
                elif already_correct == 1:
                    points_awarded = 80   # 2nd place
                elif already_correct == 2:
                    points_awarded = 60   # 3rd place
                else:
                    points_awarded = 40   # Runner up

                # Update leaderboard
                user_stat = self.leaderboard.setdefault(user_id, {
                    "user_id": user_id,
                    "nickname": nickname or user_id,
                    "avatar_url": avatar_url,
                    "score": 0,
                    "correct_count": 0,
                    "streak": 0
                })
                user_stat["nickname"] = nickname or user_stat["nickname"]
                if avatar_url:
                    user_stat["avatar_url"] = avatar_url
                user_stat["score"] += points_awarded
                user_stat["correct_count"] += 1
                user_stat["streak"] += 1

            self.answered_users_this_round[user_id] = {
                "user_id": user_id,
                "nickname": nickname,
                "avatar_url": avatar_url,
                "answer": clean_ans,
                "is_correct": is_correct,
                "points": points_awarded,
                "timestamp": datetime.now().isoformat()
            }

        comment_event = {
            "type": "NEW_COMMENT",
            "user_id": user_id,
            "nickname": nickname,
            "comment": comment,
            "avatar_url": avatar_url,
            "clean_answer": clean_ans,
            "is_correct": is_correct,
            "points": points_awarded,
            "timestamp": datetime.now().isoformat(),
            "vote_counts": dict(self.vote_counts)
        }
        self.add_recent_event(comment_event)
        self.broadcast(comment_event)
        return comment_event

    def process_like(self, user_id: str, nickname: str, count: int = 1) -> Dict[str, Any]:
        """Process like event."""
        self.total_likes += count
        event = {
            "type": "NEW_LIKE",
            "user_id": user_id,
            "nickname": nickname,
            "count": count,
            "total_likes": self.total_likes,
            "timestamp": datetime.now().isoformat()
        }
        self.broadcast(event)
        return event

    def process_gift(
        self,
        user_id: str,
        nickname: str,
        gift_name: str,
        diamond_count: int = 1,
        avatar_url: str = ""
    ) -> Dict[str, Any]:
        """Process gift event and award bonus score."""
        self.total_gifts += diamond_count
        bonus_points = diamond_count * 50

        user_stat = self.leaderboard.setdefault(user_id, {
            "user_id": user_id,
            "nickname": nickname or user_id,
            "avatar_url": avatar_url,
            "score": 0,
            "correct_count": 0,
            "streak": 0
        })
        user_stat["score"] += bonus_points

        event = {
            "type": "NEW_GIFT",
            "user_id": user_id,
            "nickname": nickname,
            "gift_name": gift_name,
            "diamond_count": diamond_count,
            "bonus_points": bonus_points,
            "avatar_url": avatar_url,
            "timestamp": datetime.now().isoformat()
        }
        self.add_recent_event(event)
        self.broadcast(event)
        return event

    def add_recent_event(self, event: Dict[str, Any]):
        """Keep last 30 events in buffer."""
        self.recent_events.append(event)
        if len(self.recent_events) > 30:
            self.recent_events.pop(0)

    def get_leaderboard_sorted(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Return sorted leaderboard list."""
        users = list(self.leaderboard.values())
        users.sort(key=lambda u: u.get("score", 0), reverse=True)
        return users[:limit]

    def get_session_snapshot(self) -> Dict[str, Any]:
        """Get full state for newly connected WebSockets."""
        return {
            "type": "SNAPSHOT",
            "unique_id": self.unique_id,
            "status": self.status,
            "error_message": self.error_message,
            "current_question": self.get_current_question(),
            "current_question_index": self.current_question_index,
            "total_questions": len(self.questions),
            "is_round_active": self.is_round_active,
            "vote_counts": dict(self.vote_counts),
            "leaderboard": self.get_leaderboard_sorted(10),
            "total_comments": self.total_comments,
            "total_likes": self.total_likes,
            "total_gifts": self.total_gifts,
            "recent_events": self.recent_events[-10:]
        }

    def broadcast(self, message: Dict[str, Any]):
        """Broadcast event to all connected browser WebSocket clients."""
        for queue in list(self.subscribers):
            try:
                queue.put_nowait(message)
            except Exception as e:
                logger.warning(f"Error queueing message to subscriber: {e}")

    async def connect_tiktok(self, unique_id: str):
        """Connect live client to real TikTok room."""
        from TikTokLive import TikTokLiveClient
        from TikTokLive.events import CommentEvent, LikeEvent, GiftEvent

        self.unique_id = unique_id.strip().lstrip("@")
        self.status = "connecting"
        self.error_message = ""
        self.broadcast({"type": "STATUS_CHANGE", "status": self.status, "unique_id": self.unique_id})

        try:
            self.client = TikTokLiveClient(unique_id=self.unique_id)

            @self.client.on(CommentEvent)
            async def on_comment(event: CommentEvent):
                try:
                    avatar = ""
                    if hasattr(event.user, "avatar") and hasattr(event.user.avatar, "urls") and event.user.avatar.urls:
                        avatar = event.user.avatar.urls[0]
                    self.process_comment(
                        user_id=event.user.unique_id,
                        nickname=getattr(event.user, "nickname", event.user.unique_id),
                        comment=event.comment,
                        avatar_url=avatar
                    )
                except Exception as ex:
                    logger.warning(f"Error processing TikTok comment event: {ex}")

            @self.client.on(LikeEvent)
            async def on_like(event: LikeEvent):
                try:
                    self.process_like(
                        user_id=event.user.unique_id,
                        nickname=getattr(event.user, "nickname", event.user.unique_id),
                        count=getattr(event, "count", 1)
                    )
                except Exception as ex:
                    logger.warning(f"Error processing TikTok like event: {ex}")

            @self.client.on(GiftEvent)
            async def on_gift(event: GiftEvent):
                try:
                    gift_name = getattr(event.gift, "name", "Gift")
                    diamond = getattr(event.gift, "diamond_count", 1) or 1
                    avatar = ""
                    if hasattr(event.user, "avatar") and hasattr(event.user.avatar, "urls") and event.user.avatar.urls:
                        avatar = event.user.avatar.urls[0]
                    self.process_gift(
                        user_id=event.user.unique_id,
                        nickname=getattr(event.user, "nickname", event.user.unique_id),
                        gift_name=gift_name,
                        diamond_count=diamond,
                        avatar_url=avatar
                    )
                except Exception as ex:
                    logger.warning(f"Error processing TikTok gift event: {ex}")

            self.status = "connected"
            self.broadcast({"type": "STATUS_CHANGE", "status": self.status, "unique_id": self.unique_id})
            await self.client.start()
        except Exception as e:
            self.status = "error"
            err_str = str(e)
            if "UserOfflineError" in err_str or "offline" in err_str.lower():
                self.error_message = f"Tài khoản @{self.unique_id} hiện chưa phát sóng Live trên TikTok. Hãy mở app TikTok Bắt đầu Live trước, hoặc bấm các nút Chế độ Test bên dưới!"
            elif "UserNotFound" in err_str or "not found" in err_str.lower():
                self.error_message = f"Không tìm thấy tài khoản @{self.unique_id} trên TikTok. Vui lòng kiểm tra lại ID."
            else:
                self.error_message = f"Lỗi kết nối ({err_str}). Bạn có thể dùng Chế độ Test bên dưới để trải nghiệm ngay!"
            logger.error(f"TikTokLive connection error for @{self.unique_id}: {e}")
            self.broadcast({
                "type": "STATUS_CHANGE",
                "status": self.status,
                "unique_id": self.unique_id,
                "error": self.error_message
            })

    async def disconnect_tiktok(self):
        """Disconnect active TikTok client."""
        if self.client:
            try:
                await self.client.disconnect()
            except Exception as e:
                logger.warning(f"Error disconnecting TikTok client: {e}")
            self.client = None

        if self.listen_task and not self.listen_task.done():
            self.listen_task.cancel()
            self.listen_task = None

        self.status = "disconnected"
        self.broadcast({"type": "STATUS_CHANGE", "status": self.status, "unique_id": self.unique_id})


# Global singleton session
active_live_session = TikTokLiveSession(room_id="main")

