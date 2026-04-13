from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.future import select
import json

from backend.schemas.transport import OptimizationRequest, PackingResultResponse, PlacedItem
from backend.db.database import get_db
from backend.models.domain import Order, Product, PackingResult, BoxCatalog
from backend.engines.pack.bin_packer import Item, Box
from backend.engines.ai.optimizer import GeneticOptimizer
from backend.engines.cost.calculator import CostEngine
from backend.services.openrouter import generate_logistics_insights
from backend.services.pipeline import LogisticsPipeline

router = APIRouter()

@router.post("/optimize", response_model=PackingResultResponse)
async def optimize_packing(req: OptimizationRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    try:
        response = await LogisticsPipeline.execute(req, db)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/result/{order_id}")
def get_result(order_id: str, db: Session = Depends(get_db)):
    db_res = db.query(PackingResult).filter(PackingResult.order_id == order_id).first()
    if not db_res:
         raise HTTPException(status_code=404, detail="Order not found")
         
    return db_res
