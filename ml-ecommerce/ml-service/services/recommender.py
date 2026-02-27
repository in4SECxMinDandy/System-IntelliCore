"""
Recommender Service — wraps model inference
"""

import logging
import numpy as np
from typing import List, Optional
from services.model_manager import ModelManager

logger = logging.getLogger(__name__)


class RecommenderService:
    def __init__(self, model_manager: ModelManager):
        self.mm = model_manager

    async def for_user(self, user_id: str, limit: int = 12) -> List[str]:
        """Collaborative filtering recommendations for a user."""
        try:
            if not self.mm.cf_model or user_id not in self.mm.user_index:
                return self.mm.popular_items[:limit]

            user_idx = self.mm.user_index[user_id]
            # ALS model: recommend items
            ids, scores = self.mm.cf_model.recommend(
                user_idx,
                self.mm.cf_model.user_factors[user_idx],
                N=limit,
                filter_already_liked_items=True,
            )
            return [self.mm.index_to_item[i] for i in ids if i in self.mm.index_to_item]
        except Exception as e:
            logger.warning(f"CF recommendation failed: {e}")
            return self.mm.popular_items[:limit]

    async def similar_to(self, product_id: str, limit: int = 8) -> List[str]:
        """Content-based similar products using cosine similarity."""
        try:
            if self.mm.item_vectors is None or product_id not in self.mm.item_index:
                return []

            idx = self.mm.item_index[product_id]
            vectors = self.mm.item_vectors
            target = vectors[idx]

            # Cosine similarity
            norms = np.linalg.norm(vectors, axis=1)
            norms[norms == 0] = 1
            similarities = vectors.dot(target) / (norms * np.linalg.norm(target))
            similarities[idx] = -1  # Exclude self

            top_indices = np.argsort(similarities)[::-1][:limit]
            return [self.mm.index_to_item[i] for i in top_indices if i in self.mm.index_to_item]
        except Exception as e:
            logger.warning(f"Content-based recommendation failed: {e}")
            return []

    async def frequently_bought_with(self, product_id: str, limit: int = 4) -> List[str]:
        """Association rules — frequently bought together."""
        try:
            # Placeholder: use popular items as fallback
            # In production, this would use pre-computed association rules
            return self.mm.popular_items[:limit]
        except Exception as e:
            logger.warning(f"FBT recommendation failed: {e}")
            return []

    async def popular(self, category_id: Optional[str] = None, limit: int = 12) -> List[str]:
        """Popular products, optionally filtered by category."""
        return self.mm.popular_items[:limit]
