"""TikTok LIVE Interactive Classroom API Endpoints & WebSocket Server."""
import asyncio
import logging
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel, Field

from app.application.tiktok_live_service import (
    active_live_session,
    normalize_answer_input
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/tiktok-live", tags=["TikTok Live Interactive"])


class ConnectRequest(BaseModel):
    unique_id: str = Field(..., description="TikTok username without @")


class SimulateCommentRequest(BaseModel):
    user_id: str = Field("viewer_123", description="Mock TikTok user ID")
    nickname: str = Field("Học Viên Chăm Chỉ", description="Display name")
    comment: str = Field(..., description="Answer or text (e.g. A, B, C, D)")
    avatar_url: Optional[str] = None


class SimulateEventRequest(BaseModel):
    event_type: str = Field(..., description="'comment', 'like', or 'gift'")
    user_id: Optional[str] = "test_user_1"
    nickname: Optional[str] = "Bạn Học Test"
    comment: Optional[str] = "B"
    gift_name: Optional[str] = "Hoa Hồng"
    diamond_count: Optional[int] = 1


@router.get("/snapshot")
async def get_live_snapshot():
    """Retrieve full live room state."""
    return active_live_session.get_session_snapshot()


@router.post("/connect")
async def connect_tiktok_room(payload: ConnectRequest):
    """Start listening to real TikTok LIVE room in the background."""
    unique_id = payload.unique_id.strip().lstrip("@")
    if not unique_id:
        raise HTTPException(status_code=400, detail="Vui lòng cung cấp TikTok username hợp lệ.")

    # Disconnect any existing task first
    await active_live_session.disconnect_tiktok()

    # Launch connect in background task so API responds immediately
    active_live_session.listen_task = asyncio.create_task(
        active_live_session.connect_tiktok(unique_id)
    )

    return {
        "status": "connecting",
        "unique_id": unique_id,
        "message": f"Đang kết nối tới phòng Live @{unique_id}..."
    }


@router.post("/disconnect")
async def disconnect_tiktok_room():
    """Disconnect active TikTok LIVE listener."""
    await active_live_session.disconnect_tiktok()
    return {"status": "disconnected", "message": "Đã ngắt kết nối TikTok LIVE."}


@router.post("/start-round")
async def start_question_round():
    """Start or restart current question countdown."""
    event = active_live_session.start_round()
    return {"status": "started", "event": event}


@router.post("/end-round")
async def end_question_round():
    """End current question round and show correct answer."""
    event = active_live_session.end_round()
    return {"status": "ended", "event": event}


@router.post("/next-question")
async def next_question():
    """Advance to the next question in the deck."""
    event = active_live_session.next_question()
    return {"status": "next", "event": event}


@router.post("/prev-question")
async def prev_question():
    """Go back to previous question in the deck."""
    event = active_live_session.prev_question()
    return {"status": "prev", "event": event}


@router.post("/simulate")
async def simulate_event(payload: SimulateEventRequest):
    """Simulate a comment, like, or gift for instant offline testing."""
    if payload.event_type == "comment":
        res = active_live_session.process_comment(
            user_id=payload.user_id or "sim_user",
            nickname=payload.nickname or "Khán Giả Test",
            comment=payload.comment or "A",
            avatar_url=""
        )
        return {"status": "ok", "event": res}
    elif payload.event_type == "like":
        res = active_live_session.process_like(
            user_id=payload.user_id or "sim_user",
            nickname=payload.nickname or "Khán Giả Test",
            count=10
        )
        return {"status": "ok", "event": res}
    elif payload.event_type == "gift":
        res = active_live_session.process_gift(
            user_id=payload.user_id or "sim_user",
            nickname=payload.nickname or "Khán Giả Test",
            gift_name=payload.gift_name or "Hoa Hồng",
            diamond_count=payload.diamond_count or 1
        )
        return {"status": "ok", "event": res}
    else:
        raise HTTPException(status_code=400, detail="Loại sự kiện không hợp lệ.")


@router.websocket("/ws")
async def websocket_tiktok_live(websocket: WebSocket):
    """WebSocket for real-time live studio display."""
    await websocket.accept()
    queue = asyncio.Queue()
    active_live_session.subscribers.append(queue)

    try:
        # 1. Send initial full snapshot
        snapshot = active_live_session.get_session_snapshot()
        await websocket.send_json(snapshot)

        # 2. Producer/Consumer loop: send events to frontend, receive control commands
        async def event_sender():
            while True:
                data = await queue.get()
                await websocket.send_json(data)

        async def command_receiver():
            while True:
                msg = await websocket.receive_json()
                action = msg.get("action")
                if action == "START_ROUND":
                    active_live_session.start_round()
                elif action == "END_ROUND":
                    active_live_session.end_round()
                elif action == "NEXT_QUESTION":
                    active_live_session.next_question()
                elif action == "SIMULATE_COMMENT":
                    active_live_session.process_comment(
                        user_id=msg.get("user_id", "sim_user"),
                        nickname=msg.get("nickname", "Khán Giả"),
                        comment=msg.get("comment", "A")
                    )

        sender_task = asyncio.create_task(event_sender())
        receiver_task = asyncio.create_task(command_receiver())

        done, pending = await asyncio.wait(
            [sender_task, receiver_task],
            return_when=asyncio.FIRST_COMPLETED
        )
        for task in pending:
            task.cancel()

    except WebSocketDisconnect:
        logger.info("TikTok Live Studio WebSocket disconnected.")
    except Exception as e:
        logger.warning(f"TikTok Live Studio WebSocket error: {e}")
    finally:
        if queue in active_live_session.subscribers:
            active_live_session.subscribers.remove(queue)

