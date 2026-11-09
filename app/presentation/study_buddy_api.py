"""FastAPI presentation router for Study Buddy & Nearby Location system."""
import logging
from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User
from app.application.auth_service import get_current_user
from app.application.study_buddy_service import (
    update_user_location,
    get_nearby_study_buddies,
    send_friend_request,
    respond_to_friend_request,
    get_user_friendships_list,
    remove_friend,
    search_study_buddies_by_query,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/buddy", tags=["Study Buddy & Nearby"])


class UpdateLocationRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude GPS coordinate")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude GPS coordinate")
    study_target: Optional[str] = Field(None, max_length=100)
    is_location_sharing: Optional[bool] = None
    bio: Optional[str] = Field(None, max_length=255)


class FriendRequestPayload(BaseModel):
    receiver_id: str = Field(..., min_length=1)


class FriendResponsePayload(BaseModel):
    request_id: str = Field(..., min_length=1)
    action: str = Field(..., description="'ACCEPT' or 'REJECT'")


@router.post("/location")
async def api_update_location(
    payload: UpdateLocationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user's live GPS coordinates, privacy, and target."""
    user = await update_user_location(
        db=db,
        user_id=current_user.id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        study_target=payload.study_target,
        is_location_sharing=payload.is_location_sharing,
        bio=payload.bio,
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy người dùng.")
    return {"ok": True, "user": user.to_dict()}


@router.get("/nearby")
async def api_get_nearby_buddies(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    radius_km: float = Query(50.0, ge=1.0, le=5000.0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Search for nearby language learners within the given radius (Haversine formula)."""
    # Silently refresh user's last coordinates
    await update_user_location(db=db, user_id=current_user.id, latitude=lat, longitude=lon)

    buddies = await get_nearby_study_buddies(
        db=db,
        current_user_id=current_user.id,
        current_lat=lat,
        current_lon=lon,
        radius_km=radius_km,
        limit=limit,
    )
    return {"ok": True, "buddies": buddies, "total": len(buddies)}


@router.post("/request")
async def api_send_friend_request(
    payload: FriendRequestPayload,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Send friend request to another user."""
    res = await send_friend_request(db=db, sender_id=current_user.id, receiver_id=payload.receiver_id)
    if not res.get("ok"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=res.get("message"))
    return res


@router.post("/respond")
async def api_respond_friend_request(
    payload: FriendResponsePayload,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Accept or reject an incoming friend request."""
    res = await respond_to_friend_request(
        db=db, user_id=current_user.id, request_id=payload.request_id, action=payload.action
    )
    if not res.get("ok"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=res.get("message"))
    return res


@router.get("/friends")
async def api_get_friends(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve list of connected study buddies and incoming requests."""
    data = await get_user_friendships_list(db=db, user_id=current_user.id)
    return {"ok": True, **data}


@router.delete("/friend/{other_id}")
async def api_unfriend(
    other_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Unfriend or cancel connection."""
    res = await remove_friend(db=db, user_id=current_user.id, other_id=other_id)
    return res


@router.get("/search")
async def api_search_buddies(
    q: str = Query(..., min_length=1, description="Email, User ID, or Name"),
    limit: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Search study buddies by email, user ID (invite link), or name."""
    results = await search_study_buddies_by_query(
        db=db,
        current_user_id=current_user.id,
        query=q,
        limit=limit,
    )
    return {"ok": True, "results": results, "total": len(results)}


@router.post("/ping")
async def api_ping_active(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Keep current user's online activity alive."""
    from datetime import datetime, timezone
    current_user.last_active_at = datetime.now(timezone.utc)
    await db.commit()
    return {"ok": True}


