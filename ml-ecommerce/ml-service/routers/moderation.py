from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import re
import random

router = APIRouter()

class ReviewAnalysisRequest(BaseModel):
    review_text: str

class ReviewAnalysisResponse(BaseModel):
    sentiment: str
    fake_prob: int

@router.post("/analyze-review", response_model=ReviewAnalysisResponse)
async def analyze_review(request: ReviewAnalysisRequest):
    """
    Simulated ML endpoint to analyze review text for sentiment and fake probability.
    In a fully trained model, this would use an LLM or a specific NLP classifier pipeline.
    """
    text = request.review_text.lower()
    
    # 1. Crude Sentiment Analysis
    positive_words = ['good', 'great', 'awesome', 'excellent', 'amazing', 'love', 'perfect', 'best']
    negative_words = ['bad', 'terrible', 'awful', 'scam', 'hate', 'worst', 'poor', 'defective']
    
    pos_count = sum(1 for word in positive_words if word in text)
    neg_count = sum(1 for word in negative_words if word in text)
    
    sentiment = "Neutral"
    if pos_count > neg_count:
        sentiment = "Positive"
    elif neg_count > pos_count:
        sentiment = "Negative"
        
    # 2. Fake Probability Heuristic (0 to 100)
    fake_prob = 10  # Base probability
    
    # Too short or too long
    if len(text) < 15:
        fake_prob += 30
    elif len(text) > 1000:
        fake_prob += 10
        
    # All caps
    if text.isupper():
        fake_prob += 40
        
    # Spam words
    spam_words = ['buy', 'discount', 'cheap', 'click', 'subscribe', 'free']
    spam_count = sum(1 for word in spam_words if word in text)
    if spam_count > 0:
        fake_prob += 30 * spam_count
        
    # Repeats same character more than 4 times
    if re.search(r'(.)\1{4,}', text):
        fake_prob += 25
        
    fake_prob = min(max(fake_prob, 0), 100)
    
    return ReviewAnalysisResponse(
        sentiment=sentiment,
        fake_prob=fake_prob
    )
