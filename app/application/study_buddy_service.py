"""Study Buddy & Location-Based Friendship Domain Service."""
import math
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy import select, or_, and_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database.models import User, UserStreak
from app.infrastructure.database.study_buddy_models import Friendship

logger = logging.getLogger(__name__)


def calculate_haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on Earth in kilometers using Haversine formula."""
    try:
        if not (-90.0 <= lat1 <= 90.0 and -90.0 <= lat2 <= 90.0 and -180.0 <= lon1 <= 180.0 and -180.0 <= lon2 <= 180.0):
            return 99999.0
        R = 6371.0  # Earth radius in kilometers
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2)
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(max(0.0, 1.0 - a)))
        return round(R * c, 2)
    except Exception as e:
        logger.debug(f"Error calculating Haversine distance: {e}")
        return 99999.0


def format_distance_display(distance_km: float) -> str:
    """Format distance in human-friendly Vietnamese label (e.g. 'Cách 850 m' or 'Cách 2.4 km')."""
    if distance_km is None or distance_km < 0:
        return "Không xác định"
    if distance_km < 1.0:
        meters = max(10, int(round(distance_km * 1000)))
        return f"Cách {meters} m"
    return f"Cách {distance_km:.1f} km"


def compute_online_status(last_active_at: Optional[datetime]) -> Dict[str, Any]:
    """Compute whether a user is currently online and human-readable last active label."""
    if not last_active_at:
        return {"is_online": False, "label": "Chưa hoạt động", "code": "offline"}

    now = datetime.now(timezone.utc)
    if last_active_at.tzinfo is None:
        last_active = last_active_at.replace(tzinfo=timezone.utc)
    else:
        last_active = last_active_at

    delta_seconds = max(0, (now - last_active).total_seconds())
    if delta_seconds <= 300:  # <= 5 mins
        return {"is_online": True, "label": "Đang online", "code": "online"}
    elif delta_seconds <= 3600:  # <= 1 hour
        mins = max(1, int(delta_seconds // 60))
        return {"is_online": False, "label": f"{mins} phút trước", "code": "recently_active"}
    elif delta_seconds <= 86400:  # <= 24 hours
        hours = max(1, int(delta_seconds // 3600))
        return {"is_online": False, "label": f"{hours} giờ trước", "code": "away"}
    else:
        days = max(1, int(delta_seconds // 86400))
        return {"is_online": False, "label": f"{days} ngày trước", "code": "offline"}


async def update_user_location(
    db: AsyncSession,
    user_id: str,
    latitude: float,
    longitude: float,
    study_target: Optional[str] = None,
    is_location_sharing: Optional[bool] = None,
    bio: Optional[str] = None,
) -> Optional[User]:
    """Update current user's GPS coordinates and study profile."""
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        return None

    now_utc = datetime.now(timezone.utc)
    user.latitude = float(latitude)
    user.longitude = float(longitude)
    user.location_updated_at = now_utc
    user.last_active_at = now_utc
    if study_target is not None:
        user.study_target = study_target.strip()[:100]
    if is_location_sharing is not None:
        user.is_location_sharing = bool(is_location_sharing)
    if bio is not None:
        user.bio = bio.strip()[:255]

    await db.commit()
    await db.refresh(user)
    return user


async def get_nearby_study_buddies(
    db: AsyncSession,
    current_user_id: str,
    current_lat: float,
    current_lon: float,
    radius_km: float = 50.0,
    limit: int = 50,
) -> List[Dict[str, Any]]:
    """Find nearby active language learners within a specified radius."""
    # 1. Fetch other active users who allow location sharing
    stmt = (
        select(User, UserStreak)
        .outerjoin(UserStreak, User.id == UserStreak.user_id)
        .where(
            User.id != current_user_id,
            User.is_location_sharing == True,
            User.latitude.is_not(None),
            User.longitude.is_not(None),
        )
    )
    result = await db.execute(stmt)
    rows = result.all()

    # 2. Fetch existing friendship states for the current user
    friendships_stmt = select(Friendship).where(
        or_(Friendship.sender_id == current_user_id, Friendship.receiver_id == current_user_id)
    )
    f_res = await db.execute(friendships_stmt)
    friendships = f_res.scalars().all()

    # Map other_user_id -> friendship status
    rel_map = {}
    for f in friendships:
        other_id = f.receiver_id if f.sender_id == current_user_id else f.sender_id
        if f.status == "ACCEPTED":
            rel_map[other_id] = ("FRIEND", f.id)
        elif f.status == "PENDING":
            if f.sender_id == current_user_id:
                rel_map[other_id] = ("PENDING_SENT", f.id)
            else:
                rel_map[other_id] = ("PENDING_RECEIVED", f.id)

    buddies = []
    for user, streak in rows:
        dist = calculate_haversine_distance_km(current_lat, current_lon, user.latitude, user.longitude)
        if dist <= radius_km:
            rel_status, friendship_id = rel_map.get(user.id, ("NONE", None))
            buddies.append({
                "id": user.id,
                "name": user.name,
                "avatar_url": user.avatar_url,
                "distance_km": dist,
                "distance_label": format_distance_display(dist),
                "study_target": user.study_target or "Luyện nghe & Chép chính tả",
                "bio": user.bio or "",
                "streak": streak.current_streak if streak else 0,
                "words_today": streak.words_today if streak else 0,
                "friendship_status": rel_status,
                "friendship_id": friendship_id,
                "online_status": compute_online_status(user.last_active_at or user.location_updated_at),
                "last_active": user.location_updated_at.isoformat() if user.location_updated_at else None,
            })

    # Sort primarily by distance ascending
    buddies.sort(key=lambda b: b["distance_km"])
    return buddies[:limit]


async def send_friend_request(db: AsyncSession, sender_id: str, receiver_id: str) -> Dict[str, Any]:
    """Send a study buddy friend request."""
    if sender_id == receiver_id:
        return {"ok": False, "error": "cannot_friend_self", "message": "Bạn không thể gửi lời mời kết bạn cho chính mình."}

    # Verify receiver exists
    rec_stmt = select(User).where(User.id == receiver_id)
    rec_res = await db.execute(rec_stmt)
    if not rec_res.scalar_one_or_none():
        return {"ok": False, "error": "user_not_found", "message": "Không tìm thấy người dùng."}

    # Check if a friendship already exists between these users
    stmt = select(Friendship).where(
        or_(
            and_(Friendship.sender_id == sender_id, Friendship.receiver_id == receiver_id),
            and_(Friendship.sender_id == receiver_id, Friendship.receiver_id == sender_id),
        )
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        if existing.status == "ACCEPTED":
            return {"ok": True, "status": "FRIEND", "message": "Hai bạn đã là bạn học của nhau."}
        if existing.status == "PENDING":
            if existing.sender_id == sender_id:
                return {"ok": True, "status": "PENDING_SENT", "message": "Lời mời kết bạn đã được gửi trước đó."}
            else:
                # Mutual interest: auto accept!
                existing.status = "ACCEPTED"
                existing.updated_at = datetime.now(timezone.utc)
                await db.commit()
                return {"ok": True, "status": "FRIEND", "message": "Đã chấp nhận lời mời kết bạn!"}
        # If rejected, reset to pending
        existing.sender_id = sender_id
        existing.receiver_id = receiver_id
        existing.status = "PENDING"
        existing.updated_at = datetime.now(timezone.utc)
        await db.commit()
        return {"ok": True, "status": "PENDING_SENT", "message": "Đã gửi lại lời mời kết bạn."}

    new_f = Friendship(sender_id=sender_id, receiver_id=receiver_id, status="PENDING")
    db.add(new_f)
    await db.commit()
    await db.refresh(new_f)
    return {"ok": True, "status": "PENDING_SENT", "friendship_id": new_f.id, "message": "Đã gửi lời mời kết bạn thành công."}


async def respond_to_friend_request(db: AsyncSession, user_id: str, request_id: str, action: str) -> Dict[str, Any]:
    """Accept or reject incoming friend request."""
    stmt = select(Friendship).where(Friendship.id == request_id, Friendship.receiver_id == user_id)
    result = await db.execute(stmt)
    friendship = result.scalar_one_or_none()
    if not friendship:
        return {"ok": False, "error": "not_found", "message": "Không tìm thấy lời mời kết bạn."}

    action_norm = action.upper().strip()
    if action_norm == "ACCEPT":
        friendship.status = "ACCEPTED"
        friendship.updated_at = datetime.now(timezone.utc)
        await db.commit()
        return {"ok": True, "status": "ACCEPTED", "message": "Đã trở thành bạn học cùng tiến!"}
    elif action_norm == "REJECT":
        friendship.status = "REJECTED"
        friendship.updated_at = datetime.now(timezone.utc)
        await db.commit()
        return {"ok": True, "status": "REJECTED", "message": "Đã từ chối lời mời kết bạn."}
    return {"ok": False, "error": "invalid_action", "message": "Thao tác không hợp lệ."}


async def get_user_friendships_list(db: AsyncSession, user_id: str) -> Dict[str, Any]:
    """Retrieve accepted friends and incoming pending friend requests."""
    # 1. Accepted friends
    f_stmt = (
        select(Friendship, User, UserStreak)
        .join(User, or_(
            and_(Friendship.sender_id == User.id, Friendship.receiver_id == user_id),
            and_(Friendship.receiver_id == User.id, Friendship.sender_id == user_id),
        ))
        .outerjoin(UserStreak, User.id == UserStreak.user_id)
        .where(
            Friendship.status == "ACCEPTED",
            or_(Friendship.sender_id == user_id, Friendship.receiver_id == user_id),
        )
    )
    f_res = await db.execute(f_stmt)
    friends_rows = f_res.all()

    friends = []
    for f, friend_user, streak in friends_rows:
        friends.append({
            "friendship_id": f.id,
            "id": friend_user.id,
            "name": friend_user.name,
            "email": friend_user.email,
            "avatar_url": friend_user.avatar_url,
            "study_target": friend_user.study_target or "Luyện nghe & Chép chính tả",
            "bio": friend_user.bio or "",
            "streak": streak.current_streak if streak else 0,
            "words_today": streak.words_today if streak else 0,
            "connected_at": f.updated_at.isoformat() if f.updated_at else None,
            "online_status": compute_online_status(friend_user.last_active_at or friend_user.location_updated_at),
            "last_active": (friend_user.last_active_at or friend_user.location_updated_at).isoformat() if (friend_user.last_active_at or friend_user.location_updated_at) else None,
        })

    # 2. Incoming pending requests
    req_stmt = (
        select(Friendship, User, UserStreak)
        .join(User, Friendship.sender_id == User.id)
        .outerjoin(UserStreak, User.id == UserStreak.user_id)
        .where(Friendship.receiver_id == user_id, Friendship.status == "PENDING")
    )
    req_res = await db.execute(req_stmt)
    req_rows = req_res.all()

    requests = []
    for f, sender_user, streak in req_rows:
        requests.append({
            "friendship_id": f.id,
            "id": sender_user.id,
            "name": sender_user.name,
            "email": sender_user.email,
            "avatar_url": sender_user.avatar_url,
            "study_target": sender_user.study_target or "Luyện nghe & Chép chính tả",
            "bio": sender_user.bio or "",
            "streak": streak.current_streak if streak else 0,
            "created_at": f.created_at.isoformat() if f.created_at else None,
            "online_status": compute_online_status(sender_user.last_active_at or sender_user.location_updated_at),
        })

    return {"friends": friends, "incoming_requests": requests}


async def search_study_buddies_by_query(
    db: AsyncSession,
    current_user_id: str,
    query: str,
    limit: int = 20,
) -> List[Dict[str, Any]]:
    """Search study buddies by email, user ID (from share invite link), or name."""
    clean_q = (query or "").strip()
    if not clean_q or len(clean_q) < 2:
        return []

    # Check if exact UUID
    is_exact_id = len(clean_q) == 36 and "-" in clean_q
    if is_exact_id:
        filter_cond = and_(User.id == clean_q, User.id != current_user_id)
    else:
        filter_cond = and_(
            User.id != current_user_id,
            or_(
                User.email.ilike(f"{clean_q}%"),
                User.email == clean_q,
                User.name.ilike(f"%{clean_q}%"),
            ),
        )

    stmt = (
        select(User, UserStreak)
        .outerjoin(UserStreak, User.id == UserStreak.user_id)
        .where(filter_cond)
        .limit(limit)
    )
    res = await db.execute(stmt)
    rows = res.all()

    # Query friendships to determine relation status
    friendships_stmt = select(Friendship).where(
        or_(Friendship.sender_id == current_user_id, Friendship.receiver_id == current_user_id)
    )
    f_res = await db.execute(friendships_stmt)
    friendships = f_res.scalars().all()

    rel_map = {}
    for f in friendships:
        other_id = f.receiver_id if f.sender_id == current_user_id else f.sender_id
        if f.status == "ACCEPTED":
            rel_map[other_id] = ("FRIEND", f.id)
        elif f.status == "PENDING":
            if f.sender_id == current_user_id:
                rel_map[other_id] = ("PENDING_SENT", f.id)
            else:
                rel_map[other_id] = ("PENDING_RECEIVED", f.id)

    results = []
    for user, streak in rows:
        rel_status, friendship_id = rel_map.get(user.id, ("NONE", None))
        results.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "avatar_url": user.avatar_url,
            "study_target": user.study_target or "Luyện nghe & Chép chính tả",
            "bio": user.bio or "",
            "streak": streak.current_streak if streak else 0,
            "words_today": streak.words_today if streak else 0,
            "friendship_status": rel_status,
            "friendship_id": friendship_id,
            "online_status": compute_online_status(user.last_active_at or user.location_updated_at),
            "created_at": user.created_at.isoformat() if user.created_at else None,
        })

    return results


async def remove_friend(db: AsyncSession, user_id: str, other_id: str) -> Dict[str, Any]:
    """Unfriend or cancel a friend connection."""
    stmt = delete(Friendship).where(
        or_(
            and_(Friendship.sender_id == user_id, Friendship.receiver_id == other_id),
            and_(Friendship.sender_id == other_id, Friendship.receiver_id == user_id),
        )
    )
    await db.execute(stmt)
    await db.commit()
    return {"ok": True, "message": "Đã hủy kết bạn thành công."}

