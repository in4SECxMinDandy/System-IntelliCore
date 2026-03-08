"""
Event Tracker Router (Phase 3.1)
Receives behavioral events from the frontend and backend,
stores them for ML training and recommendation improvements.
"""

from fastapi import APIRouter, Request, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/events", tags=["events"])


# ==========================================
# Schema
# ==========================================

class EventCreate(BaseModel):
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    product_id: Optional[str] = None
    category_id: Optional[str] = None
    event_type: str = Field(..., description="Type: product_view, add_to_cart, purchase, search, etc.")
    event_data: Optional[Dict[str, Any]] = None
    referrer: Optional[str] = None

    @validator("event_type")
    def validate_event_type(cls, v):
        allowed = {
            "page_view", "product_view", "search", "add_to_cart",
            "remove_from_cart", "wishlist", "purchase", "review",
            "click_recommendation", "chatbot_interaction",
            "community_post", "community_like",
        }
        if v not in allowed:
            raise ValueError(f"Invalid event_type '{v}'. Allowed: {', '.join(sorted(allowed))}")
        return v

    @validator("user_id", "product_id", "category_id", pre=True, always=True)
    def validate_uuid_or_none(cls, v):
        if v is None:
            return v
        try:
            UUID(str(v))
            return str(v)
        except ValueError:
            raise ValueError(f"'{v}' is not a valid UUID")


class BatchEventCreate(BaseModel):
    events: list[EventCreate] = Field(..., max_items=100)


# ==========================================
# Background task: store event
# ==========================================

async def _store_event(event: EventCreate, ip_address: str, user_agent: str):
    """Store event asynchronously — doesn't block the request."""
    try:
        # Import here to avoid circular imports
        from services.event_store import store_event
        await store_event(
            user_id=event.user_id,
            session_id=event.session_id,
            product_id=event.product_id,
            category_id=event.category_id,
            event_type=event.event_type,
            event_data=event.event_data,
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=event.referrer,
        )
    except Exception as e:
        logger.error(f"Failed to store event {event.event_type}: {e}")


# ==========================================
# Endpoints
# ==========================================

@router.post("/track", status_code=202)
async def track_event(
    event: EventCreate,
    request: Request,
    background_tasks: BackgroundTasks,
):
    """
    Track a single user behavior event.
    Returns immediately (202 Accepted) and processes in background.
    """
    ip_address = request.client.host if request.client else ""
    user_agent = request.headers.get("user-agent", "")

    background_tasks.add_task(_store_event, event, ip_address, user_agent)
    return {"accepted": True, "event_type": event.event_type}


@router.post("/track/batch", status_code=202)
async def track_events_batch(
    batch: BatchEventCreate,
    request: Request,
    background_tasks: BackgroundTasks,
):
    """
    Track multiple events at once (max 100 per batch).
    Useful for sending queued offline events.
    """
    ip_address = request.client.host if request.client else ""
    user_agent = request.headers.get("user-agent", "")

    for event in batch.events:
        background_tasks.add_task(_store_event, event, ip_address, user_agent)

    return {"accepted": True, "count": len(batch.events)}


@router.get("/stats")
async def event_stats(request: Request):
    """Get event statistics (for admin dashboard)."""
    try:
        from services.event_store import get_event_stats
        stats = await get_event_stats()
        return {"success": True, "data": stats}
    except Exception as e:
        logger.error(f"Failed to get event stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve event statistics")
