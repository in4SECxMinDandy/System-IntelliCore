"""
Model Training Endpoints
"""

from fastapi import APIRouter, Request, BackgroundTasks
from services.trainer import ModelTrainer

router = APIRouter()


@router.post("/trigger")
async def trigger_training(request: Request, background_tasks: BackgroundTasks):
    """Trigger model retraining in the background."""
    mm = request.app.state.model_manager
    trainer = ModelTrainer(mm)
    background_tasks.add_task(trainer.train_all)
    return {"message": "Training started in background"}


@router.get("/status")
async def training_status(request: Request):
    mm = request.app.state.model_manager
    return {
        "models_loaded": mm.models_loaded,
        "last_trained": mm.last_trained,
        "model_versions": mm.model_versions,
    }
