"""
IntelliCore ML Service v2 — FastAPI
Enhanced Recommendation Engine: Collaborative + Content-Based + Deep Learning + Trending
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
from prometheus_client import make_asgi_app, Counter, Histogram
import logging
import time

from routers import recommendations, health, training
from routers.chatbot import router as chatbot_router
from services.model_manager import ModelManager

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Prometheus metrics
REQUEST_COUNT = Counter(
    'ml_service_requests_total',
    'Total ML service requests',
    ['method', 'endpoint', 'status']
)
REQUEST_LATENCY = Histogram(
    'ml_service_request_duration_seconds',
    'ML service request latency',
    ['endpoint']
)

model_manager = ModelManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models on startup, cleanup on shutdown."""
    logger.info("🚀 IntelliCore ML Service v2 starting up...")
    try:
        await model_manager.load_models()
        app.state.model_manager = model_manager
        logger.info("✅ ML models loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load ML models: {e}")
        app.state.model_manager = model_manager  # Still start with empty models

    yield

    logger.info("🛑 ML Service shutting down...")
    await model_manager.cleanup()


app = FastAPI(
    title="IntelliCore ML Service",
    description="""
    AI-powered recommendation engine for IntelliCore ecommerce platform.

    ## Features
    - **Collaborative Filtering**: User-based and item-based recommendations
    - **Content-Based Filtering**: TF-IDF product similarity
    - **Hybrid Recommendations**: Weighted combination of multiple strategies
    - **Trending Products**: Real-time popularity tracking
    - **Chatbot Integration**: NLP-based product search
    - **Model Training**: Automated retraining pipeline
    """,
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def track_metrics(request, call_next):
    """Track request metrics for Prometheus."""
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()

    REQUEST_LATENCY.labels(endpoint=request.url.path).observe(duration)

    return response


# Mount Prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(
    recommendations.router,
    prefix="/recommendations",
    tags=["Recommendations"]
)
app.include_router(
    training.router,
    prefix="/training",
    tags=["Training"]
)
app.include_router(
    chatbot_router,
    prefix="/recommendations",
    tags=["Chatbot"]
)


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "IntelliCore ML Service",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "recommendations": "/recommendations",
            "training": "/training",
            "health": "/health",
            "metrics": "/metrics",
        }
    }
