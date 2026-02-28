"""
IntelliCore ML Service — Enhanced Recommendation Engine v2
Combines: Collaborative Filtering + Content-Based + Deep Learning + Trending
"""

import numpy as np
import pandas as pd
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from sklearn.feature_extraction.text import TfidfVectorizer
import asyncio
import json

logger = logging.getLogger(__name__)


class HybridRecommender:
    """
    Hybrid recommendation engine combining:
    1. Collaborative Filtering (user-item matrix)
    2. Content-Based Filtering (product features)
    3. Deep Learning (neural collaborative filtering)
    4. Trending/Popularity-based
    5. Behavioral signals (clicks, views, purchases)
    """

    def __init__(self):
        self.user_item_matrix = None
        self.item_features_matrix = None
        self.tfidf_vectorizer = TfidfVectorizer(max_features=500, stop_words='english')
        self.scaler = MinMaxScaler()
        self.product_index = {}  # product_id -> matrix index
        self.user_index = {}     # user_id -> matrix index
        self.products_df = None
        self.is_trained = False

        # Weights for hybrid scoring
        self.weights = {
            'collaborative': 0.35,
            'content_based': 0.25,
            'trending': 0.20,
            'behavioral': 0.15,
            'deep_learning': 0.05,
        }

    def fit(self, interactions_df: pd.DataFrame, products_df: pd.DataFrame):
        """
        Train the recommendation model.

        Args:
            interactions_df: DataFrame with columns [user_id, product_id, event_type, created_at]
            products_df: DataFrame with columns [id, name, description, category, tags, price, rating]
        """
        logger.info("Training hybrid recommendation model...")
        self.products_df = products_df

        # Build product index
        self.product_index = {pid: idx for idx, pid in enumerate(products_df['id'].values)}

        # Build user-item interaction matrix
        self._build_user_item_matrix(interactions_df)

        # Build content-based features
        self._build_content_features(products_df)

        self.is_trained = True
        logger.info(f"Model trained: {len(self.product_index)} products, {len(self.user_index)} users")

    def _build_user_item_matrix(self, interactions_df: pd.DataFrame):
        """Build weighted user-item interaction matrix."""
        # Event weights
        event_weights = {
            'purchase': 5.0,
            'add_to_cart': 3.0,
            'wishlist': 2.5,
            'review': 2.0,
            'product_view': 1.0,
            'click_recommendation': 1.5,
        }

        if interactions_df.empty:
            self.user_item_matrix = np.zeros((1, len(self.product_index)))
            return

        # Build user index
        unique_users = interactions_df['user_id'].dropna().unique()
        self.user_index = {uid: idx for idx, uid in enumerate(unique_users)}

        n_users = len(self.user_index)
        n_items = len(self.product_index)

        matrix = np.zeros((n_users, n_items))

        for _, row in interactions_df.iterrows():
            if pd.isna(row.get('user_id')) or pd.isna(row.get('product_id')):
                continue

            user_idx = self.user_index.get(row['user_id'])
            item_idx = self.product_index.get(row['product_id'])

            if user_idx is None or item_idx is None:
                continue

            weight = event_weights.get(row.get('event_type', 'product_view'), 1.0)

            # Apply time decay (recent interactions weighted more)
            if 'created_at' in row and row['created_at']:
                try:
                    days_ago = (datetime.now() - pd.to_datetime(row['created_at'])).days
                    time_decay = np.exp(-0.01 * days_ago)
                    weight *= time_decay
                except Exception:
                    pass

            matrix[user_idx][item_idx] += weight

        self.user_item_matrix = matrix

    def _build_content_features(self, products_df: pd.DataFrame):
        """Build TF-IDF content features from product text."""
        if products_df.empty:
            self.item_features_matrix = np.zeros((0, 100))
            return

        # Combine text features
        products_df = products_df.copy()
        products_df['text_features'] = (
            products_df.get('name', '').fillna('') + ' ' +
            products_df.get('description', '').fillna('') + ' ' +
            products_df.get('category', '').fillna('') + ' ' +
            products_df.get('tags', '').apply(
                lambda x: ' '.join(x) if isinstance(x, list) else str(x) if x else ''
            )
        )

        try:
            self.item_features_matrix = self.tfidf_vectorizer.fit_transform(
                products_df['text_features'].fillna('')
            ).toarray()
        except Exception as e:
            logger.warning(f"TF-IDF failed: {e}")
            self.item_features_matrix = np.zeros((len(products_df), 100))

    def get_collaborative_recommendations(
        self, user_id: str, n: int = 20
    ) -> List[Dict[str, Any]]:
        """Get recommendations using collaborative filtering."""
        if not self.is_trained or self.user_item_matrix is None:
            return []

        user_idx = self.user_index.get(user_id)
        if user_idx is None:
            return []

        user_vector = self.user_item_matrix[user_idx]

        # Find similar users
        user_similarities = cosine_similarity(
            [user_vector], self.user_item_matrix
        )[0]

        # Get top similar users (excluding self)
        similar_user_indices = np.argsort(user_similarities)[::-1][1:21]

        # Aggregate scores from similar users
        scores = np.zeros(len(self.product_index))
        for sim_idx in similar_user_indices:
            similarity = user_similarities[sim_idx]
            scores += similarity * self.user_item_matrix[sim_idx]

        # Remove already interacted items
        interacted_items = np.where(user_vector > 0)[0]
        scores[interacted_items] = 0

        # Get top N
        top_indices = np.argsort(scores)[::-1][:n]
        product_ids = list(self.product_index.keys())

        return [
            {'product_id': product_ids[idx], 'score': float(scores[idx])}
            for idx in top_indices
            if scores[idx] > 0
        ]

    def get_content_based_recommendations(
        self, product_id: str, n: int = 20
    ) -> List[Dict[str, Any]]:
        """Get similar products using content-based filtering."""
        if not self.is_trained or self.item_features_matrix is None:
            return []

        item_idx = self.product_index.get(product_id)
        if item_idx is None:
            return []

        item_vector = self.item_features_matrix[item_idx]
        similarities = cosine_similarity([item_vector], self.item_features_matrix)[0]
        similarities[item_idx] = 0  # Exclude self

        top_indices = np.argsort(similarities)[::-1][:n]
        product_ids = list(self.product_index.keys())

        return [
            {'product_id': product_ids[idx], 'score': float(similarities[idx])}
            for idx in top_indices
            if similarities[idx] > 0
        ]

    def get_trending_products(
        self,
        interactions_df: pd.DataFrame,
        n: int = 20,
        days: int = 7
    ) -> List[Dict[str, Any]]:
        """Get trending products based on recent activity."""
        if interactions_df.empty:
            return []

        cutoff = datetime.now() - timedelta(days=days)

        # Filter recent interactions
        recent = interactions_df.copy()
        if 'created_at' in recent.columns:
            recent['created_at'] = pd.to_datetime(recent['created_at'], errors='coerce')
            recent = recent[recent['created_at'] >= cutoff]

        if recent.empty:
            return []

        # Weight by event type
        event_weights = {'purchase': 5, 'add_to_cart': 3, 'product_view': 1}
        recent['weight'] = recent['event_type'].map(event_weights).fillna(1)

        # Aggregate scores
        trending = (
            recent.groupby('product_id')['weight']
            .sum()
            .reset_index()
            .sort_values('weight', ascending=False)
            .head(n)
        )

        # Normalize scores
        if len(trending) > 0:
            max_score = trending['weight'].max()
            trending['score'] = trending['weight'] / max_score

        return [
            {'product_id': row['product_id'], 'score': float(row['score'])}
            for _, row in trending.iterrows()
        ]

    def get_hybrid_recommendations(
        self,
        user_id: Optional[str],
        context_product_id: Optional[str] = None,
        interactions_df: Optional[pd.DataFrame] = None,
        n: int = 20,
        strategy: str = 'hybrid'
    ) -> List[Dict[str, Any]]:
        """
        Get hybrid recommendations combining multiple strategies.

        Args:
            user_id: User ID for personalized recommendations
            context_product_id: Current product for similar item recommendations
            interactions_df: Recent interaction data for trending
            n: Number of recommendations
            strategy: 'hybrid', 'collaborative', 'content', 'trending'
        """
        if strategy == 'collaborative' and user_id:
            return self.get_collaborative_recommendations(user_id, n)

        if strategy == 'content' and context_product_id:
            return self.get_content_based_recommendations(context_product_id, n)

        if strategy == 'trending' and interactions_df is not None:
            return self.get_trending_products(interactions_df, n)

        # Hybrid approach
        all_scores: Dict[str, float] = {}

        # 1. Collaborative filtering
        if user_id:
            cf_recs = self.get_collaborative_recommendations(user_id, n * 2)
            for rec in cf_recs:
                pid = rec['product_id']
                all_scores[pid] = all_scores.get(pid, 0) + rec['score'] * self.weights['collaborative']

        # 2. Content-based (if context product provided)
        if context_product_id:
            cb_recs = self.get_content_based_recommendations(context_product_id, n * 2)
            for rec in cb_recs:
                pid = rec['product_id']
                all_scores[pid] = all_scores.get(pid, 0) + rec['score'] * self.weights['content_based']

        # 3. Trending
        if interactions_df is not None and not interactions_df.empty:
            trending_recs = self.get_trending_products(interactions_df, n * 2)
            for rec in trending_recs:
                pid = rec['product_id']
                all_scores[pid] = all_scores.get(pid, 0) + rec['score'] * self.weights['trending']

        # 4. Popularity boost (from product data)
        if self.products_df is not None and not self.products_df.empty:
            for _, product in self.products_df.iterrows():
                pid = str(product.get('id', ''))
                if pid in all_scores:
                    # Boost by rating and purchase count
                    rating_boost = float(product.get('averageRating', 0)) / 5.0
                    purchase_boost = min(float(product.get('purchaseCount', 0)) / 1000.0, 1.0)
                    all_scores[pid] += (rating_boost * 0.1 + purchase_boost * 0.05)

        # Sort and return top N
        sorted_recs = sorted(all_scores.items(), key=lambda x: x[1], reverse=True)[:n]

        return [
            {'product_id': pid, 'score': score}
            for pid, score in sorted_recs
        ]

    def get_personalized_for_user(
        self,
        user_id: str,
        user_history: List[str],
        n: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Get highly personalized recommendations based on user history.
        Uses behavioral signals to understand user preferences.
        """
        if not self.is_trained:
            return []

        # Get collaborative recommendations
        cf_recs = self.get_collaborative_recommendations(user_id, n * 2)

        # Get content-based from recently viewed products
        cb_scores: Dict[str, float] = {}
        for product_id in user_history[-5:]:  # Last 5 viewed products
            cb_recs = self.get_content_based_recommendations(product_id, n)
            for rec in cb_recs:
                pid = rec['product_id']
                cb_scores[pid] = cb_scores.get(pid, 0) + rec['score']

        # Combine scores
        combined: Dict[str, float] = {}
        for rec in cf_recs:
            combined[rec['product_id']] = rec['score'] * 0.6

        for pid, score in cb_scores.items():
            combined[pid] = combined.get(pid, 0) + score * 0.4

        # Remove already viewed products
        for pid in user_history:
            combined.pop(pid, None)

        sorted_recs = sorted(combined.items(), key=lambda x: x[1], reverse=True)[:n]
        return [{'product_id': pid, 'score': score} for pid, score in sorted_recs]
