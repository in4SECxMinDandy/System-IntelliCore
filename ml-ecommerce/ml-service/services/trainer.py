"""
Model Trainer — fetches data from DB and trains recommendation models
"""

import os
import logging
import asyncio
import numpy as np
import pandas as pd
from typing import Dict, List
import asyncpg
import scipy.sparse as sparse
from services.model_manager import ModelManager

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "")


class ModelTrainer:
    def __init__(self, model_manager: ModelManager):
        self.mm = model_manager

    async def fetch_interaction_data(self) -> pd.DataFrame:
        """Fetch user-product interaction data from PostgreSQL."""
        conn = await asyncpg.connect(DATABASE_URL)
        try:
            rows = await conn.fetch("""
                SELECT user_id, product_id,
                    SUM(CASE
                        WHEN event_type = 'purchase' THEN 5
                        WHEN event_type = 'add_to_cart' THEN 3
                        WHEN event_type = 'wishlist' THEN 2
                        WHEN event_type = 'product_view' THEN 1
                        ELSE 0
                    END) AS score
                FROM user_events
                WHERE user_id IS NOT NULL AND product_id IS NOT NULL
                GROUP BY user_id, product_id
            """)
            return pd.DataFrame(rows, columns=["user_id", "product_id", "score"])
        finally:
            await conn.close()

    async def fetch_product_features(self) -> pd.DataFrame:
        """Fetch product features for content-based filtering."""
        conn = await asyncpg.connect(DATABASE_URL)
        try:
            rows = await conn.fetch("""
                SELECT p.id, p.category_id, p.brand_id,
                    p.base_price, p.purchase_count, p.view_count,
                    COALESCE(AVG(r.rating), 0) as avg_rating
                FROM products p
                LEFT JOIN reviews r ON r.product_id = p.id AND r.is_approved = true
                WHERE p.is_active = true
                GROUP BY p.id
            """)
            return pd.DataFrame(rows, columns=["id", "category_id", "brand_id", "base_price", "purchase_count", "view_count", "avg_rating"])
        finally:
            await conn.close()

    async def fetch_popular_products(self) -> List[str]:
        """Fetch top popular product IDs."""
        conn = await asyncpg.connect(DATABASE_URL)
        try:
            rows = await conn.fetch("""
                SELECT id FROM products
                WHERE is_active = true
                ORDER BY purchase_count DESC, view_count DESC
                LIMIT 50
            """)
            return [str(r["id"]) for r in rows]
        finally:
            await conn.close()

    async def train_collaborative_filtering(self, df: pd.DataFrame):
        """Train ALS collaborative filtering model."""
        try:
            import implicit

            users = df["user_id"].unique()
            items = df["product_id"].unique()

            user_index = {u: i for i, u in enumerate(users)}
            item_index = {p: i for i, p in enumerate(items)}
            index_to_item = {i: p for p, i in item_index.items()}

            rows = df["user_id"].map(user_index)
            cols = df["product_id"].map(item_index)
            data = df["score"].values

            matrix = sparse.csr_matrix((data, (rows, cols)), shape=(len(users), len(items)))

            model = implicit.als.AlternatingLeastSquares(
                factors=64, iterations=20, regularization=0.1
            )
            model.fit(matrix)

            return model, item_index, user_index, index_to_item
        except Exception as e:
            logger.error(f"CF training failed: {e}")
            return None, {}, {}, {}

    def train_content_based(self, df: pd.DataFrame):
        """Build item feature vectors for content-based filtering."""
        try:
            from sklearn.preprocessing import StandardScaler, LabelEncoder

            df = df.copy()
            df["category_id"] = LabelEncoder().fit_transform(df["category_id"].fillna("unknown").astype(str))
            df["brand_id"] = LabelEncoder().fit_transform(df["brand_id"].fillna("unknown").astype(str))

            feature_cols = ["category_id", "brand_id", "base_price", "purchase_count", "view_count", "avg_rating"]
            features = df[feature_cols].fillna(0).values.astype(float)

            scaler = StandardScaler()
            vectors = scaler.fit_transform(features)

            item_index = {str(row["id"]): i for i, row in df.iterrows()}
            index_to_item = {i: str(row["id"]) for i, row in df.iterrows()}

            return vectors, item_index, index_to_item
        except Exception as e:
            logger.error(f"Content-based training failed: {e}")
            return None, {}, {}

    async def train_all(self):
        """Full training pipeline."""
        logger.info("🏋️ Starting model training...")
        try:
            # Fetch data
            interaction_df = await self.fetch_interaction_data()
            product_df = await self.fetch_product_features()
            popular = await self.fetch_popular_products()

            # Train CF
            cf_model, item_index_cf, user_index, index_to_item = await self.train_collaborative_filtering(interaction_df)

            # Train content-based
            vectors, item_index_cb, index_to_item_cb = self.train_content_based(product_df)

            # Save models
            self.mm.save_models(
                cf_model=cf_model,
                item_vectors=vectors,
                item_index=item_index_cb,
                user_index=user_index,
                index_to_item=index_to_item_cb,
                popular_items=popular,
            )

            logger.info("✅ Model training complete")
        except Exception as e:
            logger.error(f"Training pipeline failed: {e}")
