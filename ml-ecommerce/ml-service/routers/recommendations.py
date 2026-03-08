"""
Recommendation API Endpoints
"""

from fastapi import APIRouter, Request, Query, HTTPException
from typing import Optional, List
from uuid import UUID
from services.recommender import HybridRecommender

router = APIRouter()


def validate_uuid(value: str, field_name: str = "id") -> str:
    """Validate that a string is a valid UUID."""
    try:
        UUID(value)
        return value
    except (ValueError, AttributeError):
        raise HTTPException(
            status_code=422,
            detail=f"Invalid {field_name}: must be a valid UUID, got '{value}'"
        )


def get_recommender(request: Request) -> HybridRecommender:
    """Get the trained recommender from ModelManager, or create a new instance."""
    mm = request.app.state.model_manager
    # Use the pre-trained recommender from ModelManager if available
    if hasattr(mm, 'recommender') and mm.recommender is not None:
        return mm.recommender
    # Fallback: return a new (untrained) recommender — will return fallback data
    return HybridRecommender()


@router.get("/user")
async def user_recommendations(
    request: Request,
    user_id: str = Query(..., description="User UUID"),
    limit: int = Query(12, ge=1, le=50),
):
    """Personalized recommendations for a user (collaborative filtering)."""
    user_id = validate_uuid(user_id, "user_id")
    recommender = get_recommender(request)
    product_ids = await recommender.for_user(user_id, limit)
    return {"product_ids": product_ids, "strategy": "collaborative_filtering"}


@router.get("/similar")
async def similar_products(
    request: Request,
    product_id: str = Query(..., description="Product UUID"),
    limit: int = Query(8, ge=1, le=20),
):
    """Content-based similar products."""
    product_id = validate_uuid(product_id, "product_id")
    recommender = get_recommender(request)
    product_ids = await recommender.similar_to(product_id, limit)
    return {"product_ids": product_ids, "strategy": "content_based"}


@router.get("/frequently-bought")
async def frequently_bought_together(
    request: Request,
    product_id: str = Query(..., description="Product UUID"),
    limit: int = Query(4, ge=1, le=10),
):
    """Frequently bought together (association rules)."""
    product_id = validate_uuid(product_id, "product_id")
    recommender = get_recommender(request)
    product_ids = await recommender.frequently_bought_with(product_id, limit)
    return {"product_ids": product_ids, "strategy": "association_rules"}


@router.get("/popular")
async def popular_products(
    request: Request,
    category_id: Optional[str] = Query(None),
    limit: int = Query(12, ge=1, le=50),
):
    """Popular products, optionally filtered by category."""
    recommender = get_recommender(request)
    product_ids = await recommender.popular(category_id, limit)
    return {"product_ids": product_ids, "strategy": "popularity"}
