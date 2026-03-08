"""
Model Manager — loads and manages ML models
"""

import os
import pickle
import logging
from datetime import datetime
from typing import Optional, Dict, Any
import numpy as np
from services.recommender import HybridRecommender

logger = logging.getLogger(__name__)

MODEL_DIR = os.getenv("MODEL_DIR", "/app/models")


class ModelManager:
    def __init__(self):
        self.models_loaded = False
        self.last_trained: Optional[str] = None
        self.model_versions: Dict[str, str] = {}

        # Model artifacts
        self.cf_model = None          # Collaborative filtering (ALS)
        self.item_vectors = None      # Item embeddings for content-based
        self.item_index: Dict[str, int] = {}   # product_id -> matrix index
        self.user_index: Dict[str, int] = {}   # user_id -> matrix index
        self.index_to_item: Dict[int, str] = {}  # matrix index -> product_id
        self.popular_items: list = []  # Fallback popular items
        self.recommender: Optional[HybridRecommender] = None  # Main recommender

    async def load_models(self):
        """Load pre-trained models from disk."""
        try:
            cf_path = os.path.join(MODEL_DIR, "cf_model.pkl")
            vectors_path = os.path.join(MODEL_DIR, "item_vectors.pkl")
            index_path = os.path.join(MODEL_DIR, "indices.pkl")
            popular_path = os.path.join(MODEL_DIR, "popular.pkl")

            if os.path.exists(cf_path):
                with open(cf_path, "rb") as f:
                    self.cf_model = pickle.load(f)
                logger.info("✅ Collaborative filtering model loaded")

            if os.path.exists(vectors_path):
                with open(vectors_path, "rb") as f:
                    self.item_vectors = pickle.load(f)
                logger.info("✅ Item vectors loaded")

            if os.path.exists(index_path):
                with open(index_path, "rb") as f:
                    indices = pickle.load(f)
                    self.item_index = indices.get("item_index", {})
                    self.user_index = indices.get("user_index", {})
                    self.index_to_item = indices.get("index_to_item", {})
                logger.info("✅ Indices loaded")

            if os.path.exists(popular_path):
                with open(popular_path, "rb") as f:
                    self.popular_items = pickle.load(f)
                logger.info("✅ Popular items loaded")

            self.models_loaded = True
            logger.info("✅ All available models loaded")

            # Initialize HybridRecommender (will use model artifacts if available)
            self.recommender = HybridRecommender()
            logger.info("✅ HybridRecommender initialized")
        except Exception as e:
            logger.warning(f"Could not load models (will use fallback): {e}")
            self.models_loaded = False
            # Still create a recommender (will return empty/fallback results)
            if self.recommender is None:
                self.recommender = HybridRecommender()

    def save_models(self, cf_model=None, item_vectors=None, item_index=None,
                    user_index=None, index_to_item=None, popular_items=None):
        """Save trained models to disk."""
        os.makedirs(MODEL_DIR, exist_ok=True)

        if cf_model is not None:
            self.cf_model = cf_model
            with open(os.path.join(MODEL_DIR, "cf_model.pkl"), "wb") as f:
                pickle.dump(cf_model, f)

        if item_vectors is not None:
            self.item_vectors = item_vectors
            with open(os.path.join(MODEL_DIR, "item_vectors.pkl"), "wb") as f:
                pickle.dump(item_vectors, f)

        if item_index is not None:
            self.item_index = item_index
            self.user_index = user_index or {}
            self.index_to_item = index_to_item or {}
            with open(os.path.join(MODEL_DIR, "indices.pkl"), "wb") as f:
                pickle.dump({
                    "item_index": item_index,
                    "user_index": user_index or {},
                    "index_to_item": index_to_item or {},
                }, f)

        if popular_items is not None:
            self.popular_items = popular_items
            with open(os.path.join(MODEL_DIR, "popular.pkl"), "wb") as f:
                pickle.dump(popular_items, f)

        self.models_loaded = True
        self.last_trained = datetime.utcnow().isoformat()
        logger.info("✅ Models saved to disk")

    async def cleanup(self):
        """Release model resources on shutdown."""
        logger.info("🧹 Cleaning up ML model resources...")
        self.recommender = None
        self.cf_model = None
        self.item_vectors = None
        self.popular_items = []
        self.models_loaded = False
        logger.info("✅ ML cleanup complete")
