"""
Recommendation API Endpoints
"""

from fastapi import APIRouter, Request, Query
from typing import Optional, List
from services.recommender import RecommenderService

router = APIRouter()


def get_recommender(request: Request) -> RecommenderService:
    mm = request.app.state.model_manager
    return RecommenderService(mm)


@router.get("/user")
async def user_recommendations(
    request: Request,
    user_id: str = Query(..., description="User UUID"),
    limit: int = Query(12, ge=1, le=50),
):
    """Personalized recommendations for a user (collaborative filtering)."""
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
