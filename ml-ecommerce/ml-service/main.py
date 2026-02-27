"""
ML Ecommerce — FastAPI ML Service
Recommendation Engine: Collaborative Filtering + Content-Based
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from routers import recommendations, health, training
from services.model_manager import ModelManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

model_manager = ModelManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models on startup."""
    logger.info("🚀 ML Service starting up...")
    await model_manager.load_models()
    app.state.model_manager = model_manager
    yield
    logger.info("ML Service shutting down...")


app = FastAPI(
    title="ML Ecommerce — Recommendation Service",
    description="Personalized product recommendations using collaborative filtering and content-based methods",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
app.include_router(training.router, prefix="/training", tags=["Training"])
