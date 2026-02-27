from fastapi import APIRouter, Request
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health_check(request: Request):
    mm = getattr(request.app.state, "model_manager", None)
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "models_loaded": mm.models_loaded if mm else False,
    }


@router.get("/")
async def root():
    return {"service": "ML Ecommerce Recommendation Engine", "version": "1.0.0"}
