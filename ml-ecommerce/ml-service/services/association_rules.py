"""
Association Rules Mining (Market Basket Analysis)
IntelliCore ML Service v2
Implements Apriori algorithm for "Frequently Bought Together" recommendations
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Tuple, Set, Optional
from collections import defaultdict
from itertools import combinations
import logging
import pickle
from pathlib import Path

logger = logging.getLogger(__name__)


class AssociationRulesMiner:
    """
    Market Basket Analysis using Apriori algorithm
    Finds frequent itemsets and generates association rules
    """
    
    def __init__(
        self,
        min_support: float = 0.01,
        min_confidence: float = 0.3,
        min_lift: float = 1.0,
        max_itemset_size: int = 3
    ):
        self.min_support = min_support
        self.min_confidence = min_confidence
        self.min_lift = min_lift
        self.max_itemset_size = max_itemset_size
        
        self.frequent_itemsets = {}  # support -> {itemset: support}
        self.association_rules = []  # List of (antecedent, consequent, support, confidence, lift)
        self.product_names = {}  # product_id -> product_name
        
        # For frequently bought together
        self.co_purchase_matrix = defaultdict(lambda: defaultdict(int))
        self.product_counts = defaultdict(int)
    
    def fit(self, transactions: List[List[str]]):
        """
        Fit the model on transaction data
        
        Args:
            transactions: List of transactions, each transaction is a list of product IDs
        """
        logger.info(f"Fitting AssociationRulesMiner on {len(transactions)} transactions")
        
        # Build co-purchase matrix
        self._build_co_purchase_matrix(transactions)
        
        # Find frequent itemsets using Apriori
        self._apriori(transactions)
        
        # Generate association rules
        self._generate_rules()
        
        logger.info(
            f"Found {len(self.frequent_itemsets)} frequent itemsets, "
            f"{len(self.association_rules)} rules"
        )
    
    def _build_co_purchase_matrix(self, transactions: List[List[str]]):
        """Build co-purchase matrix from transactions."""
        for transaction in transactions:
            # Count individual products
            for product in transaction:
                self.product_counts[product] += 1
            
            # Count co-occurrences
            unique_products = list(set(transaction))
            for i, prod1 in enumerate(unique_products):
                for prod2 in unique_products[i+1:]:
                    self.co_purchase_matrix[prod1][prod2] += 1
                    self.co_purchase_matrix[prod2][prod1] += 1
        
        logger.info(f"Built co-purchase matrix with {len(self.product_counts)} products")
    
    def _apriori(self, transactions: List[List[str]]):
        """Apriori algorithm to find frequent itemsets."""
        n_transactions = len(transactions)
        
        # Convert transactions to sets for faster processing
        transaction_sets = [set(t) for t in transactions]
        
        # Start with 1-itemsets
        item_counts = defaultdict(int)
        for transaction in transaction_sets:
            for item in transaction:
                item_counts[item] += 1
        
        # Filter by minimum support
        current_itemsets = []
        for item, count in item_counts.items():
            support = count / n_transactions
            if support >= self.min_support:
                current_itemsets.append((frozenset([item]), support))
        
        # Store frequent 1-itemsets
        self.frequent_itemsets[1] = {itemset: support for itemset, support in current_itemsets}
        
        # Iterate for k-itemsets
        k = 2
        while current_itemsets and k <= self.max_itemset_size:
            # Generate candidates from frequent (k-1)-itemsets
            candidates = self._generate_candidates(current_itemsets, k)
            
            # Count support for candidates
            candidate_counts = defaultdict(int)
            for transaction in transaction_sets:
                for candidate in candidates:
                    if candidate.issubset(transaction):
                        candidate_counts[candidate] += 1
            
            # Filter by minimum support
            current_itemsets = []
            for candidate, count in candidate_counts.items():
                support = count / n_transactions
                if support >= self.min_support:
                    current_itemsets.append((candidate, support))
            
            # Store frequent k-itemsets
            if current_itemsets:
                self.frequent_itemsets[k] = {itemset: support for itemset, support in current_itemsets}
            
            k += 1
    
    def _generate_candidates(self, frequent_itemsets: List[Tuple[frozenset, float]], k: int) -> List[frozenset]:
        """Generate candidate k-itemsets from frequent (k-1)-itemsets."""
        itemsets = [itemset for itemset, _ in frequent_itemsets]
        
        # Join step
        candidates = set()
        for i, itemset1 in enumerate(itemsets):
            for itemset2 in itemsets[i+1:]:
                # Union of two (k-1)-itemsets
                union = itemset1 | itemset2
                if len(union) == k:
                    candidates.add(union)
        
        # Prune step - remove candidates with infrequent subsets
        pruned_candidates = []
        for candidate in candidates:
            # Check all (k-1)-subsets
            is_valid = True
            for item in candidate:
                subset = candidate - {item}
                # Check if subset is frequent in previous level
                if subset not in self.frequent_itemsets.get(k-1, {}):
                    is_valid = False
                    break
            
            if is_valid:
                pruned_candidates.append(candidate)
        
        return pruned_candidates
    
    def _generate_rules(self):
        """Generate association rules from frequent itemsets."""
        self.association_rules = []
        
        for size, itemsets in self.frequent_itemsets.items():
            if size < 2:
                continue
            
            for itemset, support in itemsets.items():
                # Generate all non-empty proper subsets as antecedents
                for i in range(1, len(itemset)):
                    for antecedent in combinations(itemset, i):
                        antecedent = frozenset(antecedent)
                        consequent = itemset - antecedent
                        
                        # Calculate confidence
                        antecedent_support = self.frequent_itemsets[len(antecedent)].get(antecedent, 0)
                        if antecedent_support == 0:
                            continue
                        
                        confidence = support / antecedent_support
                        
                        if confidence < self.min_confidence:
                            continue
                        
                        # Calculate lift
                        consequent_support = self.frequent_itemsets[len(consequent)].get(consequent, 0)
                        if consequent_support == 0:
                            continue
                        
                        lift = confidence / consequent_support
                        
                        if lift < self.min_lift:
                            continue
                        
                        self.association_rules.append({
                            'antecedent': list(antecedent),
                            'consequent': list(consequent),
                            'support': support,
                            'confidence': confidence,
                            'lift': lift
                        })
        
        # Sort by lift
        self.association_rules.sort(key=lambda x: x['lift'], reverse=True)
    
    def get_frequently_bought_together(
        self,
        product_id: str,
        n: int = 5,
        min_co_purchases: int = 2
    ) -> List[Dict]:
        """
        Get frequently bought together products
        
        Args:
            product_id: The product to find recommendations for
            n: Number of recommendations
            min_co_purchases: Minimum co-purchase count
            
        Returns:
            List of products with scores
        """
        recommendations = []
        
        if product_id not in self.co_purchase_matrix:
            return recommendations
        
        total_purchases = self.product_counts.get(product_id, 1)
        
        for co_product, count in self.co_purchase_matrix[product_id].items():
            if count < min_co_purchases:
                continue
            
            # Calculate lift-like score
            co_product_total = self.product_counts.get(co_product, 1)
            
            # Jaccard-like similarity
            score = count / (total_purchases + co_product_total - count)
            
            recommendations.append({
                'product_id': co_product,
                'co_purchase_count': count,
                'score': float(score),
                'support': count / sum(self.product_counts.values())
            })
        
        # Sort by score
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        
        return recommendations[:n]
    
    def get_recommendations_for_cart(
        self,
        cart_products: List[str],
        n: int = 5
    ) -> List[Dict]:
        """
        Get product recommendations based on cart contents
        
        Args:
            cart_products: List of product IDs in cart
            n: Number of recommendations
            
        Returns:
            List of recommended products with scores
        """
        product_scores = defaultdict(float)
        
        for product in cart_products:
            if product not in self.co_purchase_matrix:
                continue
            
            for co_product, count in self.co_purchase_matrix[product].items():
                if co_product in cart_products:
                    continue
                
                # Weight by co-purchase count and product popularity
                product_scores[co_product] += count / self.product_counts.get(co_product, 1)
        
        # Sort and format
        recommendations = [
            {
                'product_id': product_id,
                'score': float(score),
                'reason': 'Frequently bought together with items in your cart'
            }
            for product_id, score in sorted(
                product_scores.items(),
                key=lambda x: x[1],
                reverse=True
            )[:n]
        ]
        
        return recommendations
    
    def get_association_rules(
        self,
        antecedent: Optional[List[str]] = None,
        consequent: Optional[List[str]] = None,
        min_confidence: Optional[float] = None,
        limit: int = 50
    ) -> List[Dict]:
        """
        Get association rules, optionally filtered
        
        Args:
            antecedent: Filter by antecedent products
            consequent: Filter by consequent products
            min_confidence: Minimum confidence threshold
            limit: Maximum number of rules to return
            
        Returns:
            List of association rules
        """
        rules = self.association_rules
        
        if antecedent is not None:
            antecedent_set = frozenset(antecedent)
            rules = [r for r in rules if r['antecedent'] == antecedent_set]
        
        if consequent is not None:
            consequent_set = frozenset(consequent)
            rules = [r for r in rules if r['consequent'] == consequent_set]
        
        if min_confidence is not None:
            rules = [r for r in rules if r['confidence'] >= min_confidence]
        
        return rules[:limit]
    
    def get_popular_bundles(self, n: int = 10) -> List[Dict]:
        """
        Get popular product bundles (frequent itemsets)
        
        Args:
            n: Number of bundles to return
            
        Returns:
            List of popular bundles
        """
        bundles = []
        
        for size, itemsets in self.frequent_itemsets.items():
            if size < 2:
                continue
            
            for itemset, support in itemsets.items():
                bundles.append({
                    'products': list(itemset),
                    'support': support,
                    'size': size
                })
        
        # Sort by support
        bundles.sort(key=lambda x: x['support'], reverse=True)
        
        return bundles[:n]
    
    def save(self, path: str):
        """Save model to disk."""
        model_data = {
            'min_support': self.min_support,
            'min_confidence': self.min_confidence,
            'min_lift': self.min_lift,
            'frequent_itemsets': dict(self.frequent_itemsets),
            'association_rules': self.association_rules,
            'co_purchase_matrix': dict(self.co_purchase_matrix),
            'product_counts': dict(self.product_counts),
        }
        
        with open(f"{path}.pkl", 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"Association rules model saved to {path}")
    
    def load(self, path: str):
        """Load model from disk."""
        with open(f"{path}.pkl", 'rb') as f:
            model_data = pickle.load(f)
        
        self.min_support = model_data['min_support']
        self.min_confidence = model_data['min_confidence']
        self.min_lift = model_data['min_lift']
        self.frequent_itemsets = model_data['frequent_itemsets']
        self.association_rules = model_data['association_rules']
        self.co_purchase_matrix = defaultdict(
            lambda: defaultdict(int),
            {k: defaultdict(int, v) for k, v in model_data['co_purchase_matrix'].items()}
        )
        self.product_counts = defaultdict(int, model_data['product_counts'])
        
        logger.info(f"Association rules model loaded from {path}")


def extract_transactions_from_orders(orders: List[Dict]) -> List[List[str]]:
    """
    Extract transactions from order data
    
    Args:
        orders: List of orders, each order has 'items' list
        
    Returns:
        List of transactions, each transaction is a list of product IDs
    """
    transactions = []
    
    for order in orders:
        items = order.get('items', [])
        if items:
            # Get unique product IDs from order
            products = list(set([item['productId'] for item in items if item.get('productId')]))
            if products:
                transactions.append(products)
    
    return transactions


def extract_transactions_from_cart_items(cart_items: List[Dict]) -> List[List[str]]:
    """
    Extract transactions from cart data (grouped by user)
    """
    # Group by user
    user_carts = defaultdict(list)
    
    for item in cart_items:
        user_id = item.get('userId') or item.get('cart', {}).get('userId')
        if user_id:
            user_carts[user_id].append(item['productId'])
    
    # Convert to transactions
    transactions = [list(set(items)) for items in user_carts.values() if items]
    
    return transactions
