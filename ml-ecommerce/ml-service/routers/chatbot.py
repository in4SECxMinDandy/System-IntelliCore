"""
IntelliCore ML Service — Chatbot Router
Product recommendation via NLP query
"""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatbotRequest(BaseModel):
    query: str
    userId: Optional[str] = None
    limit: int = 5


class ChatbotResponse(BaseModel):
    products: List[Dict[str, Any]]
    query_intent: str
    confidence: float


@router.post("/chatbot", response_model=ChatbotResponse)
async def get_chatbot_recommendations(
    request: Request,
    body: ChatbotRequest
):
    """
    Get product recommendations based on natural language query.
    Used by the chatbot to suggest relevant products.
    """
    try:
        model_manager = request.app.state.model_manager
        recommender = model_manager.recommender

        # Simple intent detection
        query_lower = body.query.lower()
        intent = "general"
        confidence = 0.7

        # Detect intent from query
        if any(word in query_lower for word in ['cheap', 'budget', 'affordable', 'under']):
            intent = "budget"
        elif any(word in query_lower for word in ['best', 'top', 'popular', 'trending']):
            intent = "popular"
        elif any(word in query_lower for word in ['new', 'latest', 'recent']):
            intent = "new_arrivals"
        elif any(word in query_lower for word in ['gift', 'present', 'birthday']):
            intent = "gift"
            confidence = 0.8
        elif any(word in query_lower for word in ['recommend', 'suggest', 'similar']):
            intent = "recommendation"

        # Get recommendations based on intent
        products = []

        if recommender and recommender.is_trained:
            if intent == "popular":
                # Get trending products
                recs = recommender.get_trending_products(
                    model_manager.interactions_df,
                    n=body.limit
                )
            elif body.userId:
                # Get personalized recommendations
                recs = recommender.get_collaborative_recommendations(
                    body.userId,
                    n=body.limit
                )
            else:
                # Get general popular products
                recs = recommender.get_trending_products(
                    model_manager.interactions_df,
                    n=body.limit
                )

            # Enrich with product details
            if model_manager.products_df is not None:
                for rec in recs[:body.limit]:
                    product_data = model_manager.products_df[
                        model_manager.products_df['id'] == rec['product_id']
                    ]
                    if not product_data.empty:
                        row = product_data.iloc[0]
                        products.append({
                            'id': rec['product_id'],
                            'name': str(row.get('name', '')),
                            'price': float(row.get('salePrice') or row.get('basePrice', 0)),
                            'rating': float(row.get('averageRating', 0)),
                            'score': rec['score'],
                        })

        return ChatbotResponse(
            products=products,
            query_intent=intent,
            confidence=confidence
        )

    except Exception as e:
        logger.error(f"Chatbot recommendation error: {e}")
        return ChatbotResponse(products=[], query_intent="error", confidence=0.0)
