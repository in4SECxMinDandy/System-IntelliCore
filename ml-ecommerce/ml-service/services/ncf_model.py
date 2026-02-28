"""
Neural Collaborative Filtering (NCF) Model
IntelliCore ML Service v2
Implements Deep Learning-based recommendation using embeddings and neural networks
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Tuple, Optional
import logging
import json
import pickle
from pathlib import Path
from datetime import datetime
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split

logger = logging.getLogger(__name__)


class NCF Dataset(Dataset):
    """PyTorch Dataset for NCF model."""
    
    def __init__(self, user_ids: np.ndarray, product_ids: np.ndarray, ratings: np.ndarray):
        self.user_ids = torch.LongTensor(user_ids)
        self.product_ids = torch.LongTensor(product_ids)
        self.ratings = torch.FloatTensor(ratings)
    
    def __len__(self):
        return len(self.user_ids)
    
    def __getitem__(self, idx):
        return self.user_ids[idx], self.product_ids[idx], self.ratings[idx]


class NeuralCollaborativeFiltering(nn.Module):
    """
    Neural Collaborative Filtering Model combining:
    - GMF (Generalized Matrix Factorization)
    - MLP (Multi-Layer Perceptron)
    """
    
    def __init__(
        self, 
        num_users: int, 
        num_products: int, 
        embed_dim: int = 64,
        hidden_layers: List[int] = [128, 64, 32],
        dropout: float = 0.2
    ):
        super(NeuralCollaborativeFiltering, self).__init__()
        
        self.num_users = num_users
        self.num_products = num_products
        self.embed_dim = embed_dim
        
        # GMF embeddings
        self.gmf_user_embed = nn.Embedding(num_users, embed_dim)
        self.gmf_product_embed = nn.Embedding(num_products, embed_dim)
        
        # MLP embeddings
        self.mlp_user_embed = nn.Embedding(num_users, embed_dim)
        self.mlp_product_embed = nn.Embedding(num_products, embed_dim)
        
        # MLP layers
        mlp_layers = []
        input_size = embed_dim * 2
        for hidden_size in hidden_layers:
            mlp_layers.append(nn.Linear(input_size, hidden_size))
            mlp_layers.append(nn.ReLU())
            mlp_layers.append(nn.Dropout(dropout))
            input_size = hidden_size
        self.mlp = nn.Sequential(*mlp_layers)
        
        # Final prediction layer
        self.output = nn.Linear(embed_dim + hidden_layers[-1], 1)
        self.sigmoid = nn.Sigmoid()
        
        # Initialize weights
        self._init_weights()
    
    def _init_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Embedding):
                nn.init.normal_(m.weight, mean=0, std=0.01)
            elif isinstance(m, nn.Linear):
                nn.init.xavier_uniform_(m.weight)
                if m.bias is not None:
                    nn.init.zeros_(m.bias)
    
    def forward(self, user_ids: torch.Tensor, product_ids: torch.Tensor) -> torch.Tensor:
        # GMF part
        gmf_user = self.gmf_user_embed(user_ids)
        gmf_product = self.gmf_product_embed(product_ids)
        gmf_output = gmf_user * gmf_product
        
        # MLP part
        mlp_user = self.mlp_user_embed(user_ids)
        mlp_product = self.mlp_product_embed(product_ids)
        mlp_input = torch.cat([mlp_user, mlp_product], dim=-1)
        mlp_output = self.mlp(mlp_input)
        
        # Concatenate and predict
        combined = torch.cat([gmf_output, mlp_output], dim=-1)
        prediction = self.output(combined)
        
        return self.sigmoid(prediction)


class NCFTrainer:
    """Trainer class for Neural Collaborative Filtering."""
    
    def __init__(
        self,
        model: NeuralCollaborativeFiltering,
        learning_rate: float = 0.001,
        weight_decay: float = 1e-5,
        batch_size: int = 256,
        epochs: int = 20,
        device: str = 'cpu'
    ):
        self.model = model.to(device)
        self.learning_rate = learning_rate
        self.weight_decay = weight_decay
        self.batch_size = batch_size
        self.epochs = epochs
        self.device = device
        
        self.optimizer = optim.Adam(
            model.parameters(), 
            lr=learning_rate, 
            weight_decay=weight_decay
        )
        self.criterion = nn.BCELoss()
    
    def train_epoch(self, train_loader: DataLoader) -> float:
        self.model.train()
        total_loss = 0
        num_batches = 0
        
        for user_ids, product_ids, ratings in train_loader:
            user_ids = user_ids.to(self.device)
            product_ids = product_ids.to(self.device)
            ratings = ratings.to(self.device)
            
            self.optimizer.zero_grad()
            predictions = self.model(user_ids, product_ids).squeeze()
            loss = self.criterion(predictions, ratings)
            loss.backward()
            self.optimizer.step()
            
            total_loss += loss.item()
            num_batches += 1
        
        return total_loss / num_batches
    
    def evaluate(self, val_loader: DataLoader) -> Dict[str, float]:
        self.model.eval()
        total_loss = 0
        num_batches = 0
        
        all_predictions = []
        all_targets = []
        
        with torch.no_grad():
            for user_ids, product_ids, ratings in val_loader:
                user_ids = user_ids.to(self.device)
                product_ids = product_ids.to(self.device)
                ratings = ratings.to(self.device)
                
                predictions = self.model(user_ids, product_ids).squeeze()
                loss = self.criterion(predictions, ratings)
                
                total_loss += loss.item()
                num_batches += 1
                
                all_predictions.extend(predictions.cpu().numpy())
                all_targets.extend(ratings.cpu().numpy())
        
        # Calculate additional metrics
        all_predictions = np.array(all_predictions)
        all_targets = np.array(all_targets)
        
        # RMSE
        rmse = np.sqrt(np.mean((all_predictions - all_targets) ** 2))
        
        # MAE
        mae = np.mean(np.abs(all_predictions - all_targets))
        
        # Precision@K and Recall@K
        precision_k = self._precision_at_k(all_predictions, all_targets, k=10)
        recall_k = self._recall_at_k(all_predictions, all_targets, k=10)
        
        return {
            'loss': total_loss / num_batches,
            'rmse': rmse,
            'mae': mae,
            'precision@10': precision_k,
            'recall@10': recall_k
        }
    
    def _precision_at_k(self, predictions: np.ndarray, targets: np.ndarray, k: int = 10) -> float:
        """Calculate Precision@K."""
        top_k_indices = np.argsort(predictions)[-k:]
        relevant = targets[top_k_indices]
        return np.sum(relevant) / k
    
    def _recall_at_k(self, predictions: np.ndarray, targets: np.ndarray, k: int = 10) -> float:
        """Calculate Recall@K."""
        top_k_indices = np.argsort(predictions)[-k:]
        relevant = targets[top_k_indices]
        total_relevant = np.sum(targets)
        if total_relevant == 0:
            return 0
        return np.sum(relevant) / total_relevant
    
    def fit(
        self, 
        interactions_df: pd.DataFrame,
        user_mapping: Dict[str, int],
        product_mapping: Dict[str, int]
    ) -> Dict[str, List[float]]:
        """Train the NCF model."""
        logger.info("Starting NCF training...")
        
        # Prepare data
        user_ids = interactions_df['user_id'].map(user_mapping).values
        product_ids = interactions_df['product_id'].map(product_mapping).values
        ratings = interactions_df['rating'].values if 'rating' in interactions_df.columns else None
        
        if ratings is None:
            # Create ratings from event weights
            event_weights = {
                'purchase': 1.0,
                'add_to_cart': 0.7,
                'wishlist': 0.5,
                'product_view': 0.3,
            }
            ratings = interactions_df['event_type'].map(event_weights).fillna(0.2).values
        
        # Normalize ratings to [0, 1]
        ratings = (ratings - ratings.min()) / (ratings.max() - ratings.min() + 1e-8)
        
        # Split data
        train_users, val_users, train_products, val_products, train_ratings, val_ratings = train_test_split(
            user_ids, product_ids, ratings, test_size=0.2, random_state=42
        )
        
        # Create data loaders
        train_dataset = NCFDataset(train_users, train_products, train_ratings)
        val_dataset = NCFDataset(val_users, val_products, val_ratings)
        
        train_loader = DataLoader(train_dataset, batch_size=self.batch_size, shuffle=True)
        val_loader = DataLoader(val_dataset, batch_size=self.batch_size, shuffle=False)
        
        # Training history
        history = {
            'train_loss': [],
            'val_loss': [],
            'val_rmse': [],
            'val_mae': []
        }
        
        best_val_loss = float('inf')
        
        for epoch in range(self.epochs):
            train_loss = self.train_epoch(train_loader)
            val_metrics = self.evaluate(val_loader)
            
            history['train_loss'].append(train_loss)
            history['val_loss'].append(val_metrics['loss'])
            history['val_rmse'].append(val_metrics['rmse'])
            history['val_mae'].append(val_metrics['mae'])
            
            logger.info(
                f"Epoch {epoch+1}/{self.epochs} - "
                f"Train Loss: {train_loss:.4f}, "
                f"Val Loss: {val_metrics['loss']:.4f}, "
                f"Val RMSE: {val_metrics['rmse']:.4f}"
            )
            
            # Save best model
            if val_metrics['loss'] < best_val_loss:
                best_val_loss = val_metrics['loss']
                self.best_model_state = self.model.state_dict().copy()
        
        # Restore best model
        if hasattr(self, 'best_model_state'):
            self.model.load_state_dict(self.best_model_state)
        
        logger.info("NCF training completed!")
        return history
    
    def save_model(self, path: str):
        """Save model to disk."""
        torch.save({
            'model_state_dict': self.model.state_dict(),
            'num_users': self.model.num_users,
            'num_products': self.model.num_products,
            'embed_dim': self.model.embed_dim,
        }, path)
        logger.info(f"NCF model saved to {path}")
    
    def load_model(self, path: str):
        """Load model from disk."""
        checkpoint = torch.load(path, map_location=self.device)
        self.model = NeuralCollaborativeFiltering(
            num_users=checkpoint['num_users'],
            num_products=checkpoint['num_products'],
            embed_dim=checkpoint['embed_dim']
        ).to(self.device)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        logger.info(f"NCF model loaded from {path}")


class NCFRecommender:
    """NCF-based recommendation service."""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self.user_mapping = {}
        self.product_mapping = {}
        self.reverse_user_mapping = {}
        self.reverse_product_mapping = {}
        
        if model_path:
            self.load(model_path)
    
    def create_mappings(self, interactions_df: pd.DataFrame, products_df: pd.DataFrame):
        """Create user and product mappings."""
        unique_users = interactions_df['user_id'].unique()
        unique_products = products_df['id'].astype(str).unique()
        
        self.user_mapping = {uid: idx for idx, uid in enumerate(unique_users)}
        self.reverse_user_mapping = {idx: uid for uid, idx in self.user_mapping.items()}
        
        self.product_mapping = {pid: idx for idx, pid in enumerate(unique_products)}
        self.reverse_product_mapping = {idx: pid for pid, idx in self.product_mapping.items()}
    
    def get_recommendations(
        self, 
        user_id: str, 
        n: int = 10,
        exclude_interacted: bool = True,
        interacted_products: Optional[List[str]] = None
    ) -> List[Dict]:
        """Get top-N recommendations for a user."""
        if self.model is None:
            logger.warning("NCF model not loaded")
            return []
        
        if user_id not in self.user_mapping:
            logger.warning(f"User {user_id} not in training data")
            return []
        
        self.model.eval()
        
        user_idx = self.user_mapping[user_id]
        
        # Get all product predictions for this user
        recommendations = []
        
        with torch.no_grad():
            for product_id, product_idx in self.product_mapping.items():
                if exclude_interacted and interacted_products:
                    if product_id in interacted_products:
                        continue
                
                user_tensor = torch.LongTensor([user_idx]).to(self.model.output.device)
                product_tensor = torch.LongTensor([product_idx]).to(self.model.output.device)
                
                score = self.model(user_tensor, product_tensor).item()
                
                recommendations.append({
                    'product_id': product_id,
                    'score': float(score)
                })
        
        # Sort by score
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        
        return recommendations[:n]
    
    def get_similar_users(
        self, 
        user_id: str, 
        n: int = 10
    ) -> List[Dict]:
        """Find similar users based on embeddings."""
        if self.model is None:
            return []
        
        if user_id not in self.user_mapping:
            return []
        
        self.model.eval()
        
        user_idx = self.user_mapping[user_id]
        user_embedding = self.model.gmf_user_embed(
            torch.LongTensor([user_idx]).to(self.model.output.device)
        )
        
        # Calculate cosine similarity with all users
        similarities = []
        
        with torch.no_grad():
            for other_user_id, other_idx in self.user_mapping.items():
                if other_user_id == user_id:
                    continue
                
                other_embedding = self.model.gmf_user_embed(
                    torch.LongTensor([other_idx]).to(self.model.output.device)
                )
                
                similarity = torch.nn.functional.cosine_similarity(
                    user_embedding, other_embedding
                ).item()
                
                similarities.append({
                    'user_id': other_user_id,
                    'similarity': float(similarity)
                })
        
        similarities.sort(key=lambda x: x['similarity'], reverse=True)
        return similarities[:n]
    
    def save(self, path: str):
        """Save model and mappings."""
        model_path = f"{path}_model.pt"
        mappings_path = f"{path}_mappings.pkl"
        
        self.model.save_model(model_path)
        
        with open(mappings_path, 'wb') as f:
            pickle.dump({
                'user_mapping': self.user_mapping,
                'product_mapping': self.product_mapping,
                'reverse_user_mapping': self.reverse_user_mapping,
                'reverse_product_mapping': self.reverse_product_mapping,
            }, f)
        
        logger.info(f"NCF recommender saved to {path}")
    
    def load(self, path: str):
        """Load model and mappings."""
        model_path = f"{path}_model.pt"
        mappings_path = f"{path}_mappings.pkl"
        
        self.model = NeuralCollaborativeFiltering(0, 0)  # Will be loaded from checkpoint
        checkpoint = torch.load(model_path)
        
        self.model = NeuralCollaborativeFiltering(
            num_users=checkpoint['num_users'],
            num_products=checkpoint['num_products'],
            embed_dim=checkpoint['embed_dim']
        )
        self.model.load_state_dict(checkpoint['model_state_dict'])
        
        with open(mappings_path, 'rb') as f:
            mappings = pickle.load(f)
            self.user_mapping = mappings['user_mapping']
            self.product_mapping = mappings['product_mapping']
            self.reverse_user_mapping = mappings['reverse_user_mapping']
            self.reverse_product_mapping = mappings['reverse_product_mapping']
        
        logger.info(f"NCF recommender loaded from {path}")
