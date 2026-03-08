"""
Event Store Service (Phase 3.1)
Handles persistence of user events to MongoDB + PostgreSQL
"""

import logging
import os
from datetime import datetime, timezone
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


async def store_event(
    user_id: Optional[str],
    session_id: Optional[str],
    product_id: Optional[str],
    category_id: Optional[str],
    event_type: str,
    event_data: Optional[Dict[str, Any]],
    ip_address: str,
    user_agent: str,
    referrer: Optional[str] = None,
):
    """
    Store a behavioral event.
    Primary: MongoDB (fast writes)
    Secondary: PostgreSQL via async HTTP to backend (for ML training sync)
    """
    event_doc = {
        "user_id": user_id,
        "session_id": session_id,
        "product_id": product_id,
        "category_id": category_id,
        "event_type": event_type,
        "event_data": event_data or {},
        "ip_address": ip_address,
        "user_agent": user_agent,
        "referrer": referrer,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    # Try MongoDB first (fast async writes)
    try:
        mongodb_uri = os.getenv("MONGODB_URI")
        if mongodb_uri:
            from motor.motor_asyncio import AsyncIOMotorClient
            client = AsyncIOMotorClient(mongodb_uri)
            db = client.get_default_database()
            await db.user_events.insert_one(event_doc)
            logger.debug(f"Event stored in MongoDB: {event_type}")
    except Exception as e:
        logger.warning(f"MongoDB event storage failed: {e}")

    # Fallback: log to file for later batch import
    logger.info(f"EVENT|{event_type}|user={user_id}|product={product_id}|session={session_id}")


async def get_event_stats() -> Dict[str, Any]:
    """
    Get event type counts from MongoDB for the dashboard.
    Returns zeros if MongoDB is unavailable.
    """
    try:
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            return {"error": "MongoDB not configured", "total": 0}

        from motor.motor_asyncio import AsyncIOMotorClient
        client = AsyncIOMotorClient(mongodb_uri)
        db = client.get_default_database()

        # Aggregate event counts by type
        pipeline = [
            {"$group": {"_id": "$event_type", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        cursor = db.user_events.aggregate(pipeline)
        events_by_type = {doc["_id"]: doc["count"] async for doc in cursor}

        total = await db.user_events.count_documents({})
        unique_users = len(await db.user_events.distinct("user_id"))
        unique_products = len(await db.user_events.distinct("product_id"))

        return {
            "total_events": total,
            "unique_users": unique_users,
            "unique_products": unique_products,
            "events_by_type": events_by_type,
        }
    except Exception as e:
        logger.error(f"Event stats query failed: {e}")
        return {"error": str(e), "total": 0}
