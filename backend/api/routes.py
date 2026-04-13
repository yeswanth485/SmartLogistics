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

from backend.schemas.transport import BoxCatalogInput, BoxCatalogResponse, TaskCreate, TaskResponse
from backend.models.domain import Task
from typing import List

@router.get("/inventory/boxes", response_model=List[BoxCatalogResponse])
def get_boxes(db: Session = Depends(get_db)):
    return db.query(BoxCatalog).all()

@router.post("/inventory/boxes", response_model=BoxCatalogResponse)
def create_box(box_in: BoxCatalogInput, db: Session = Depends(get_db)):
    existing = db.query(BoxCatalog).filter(BoxCatalog.name == box_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Box name already exists")
    new_box = BoxCatalog(**box_in.model_dump())
    db.add(new_box)
    db.commit()
    db.refresh(new_box)
    return new_box

@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).order_by(Task.created_at.desc()).all()

@router.post("/tasks", response_model=TaskResponse)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(**task_in.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.patch("/tasks/{task_id}")
def update_task_status(task_id: str, status: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = status
    db.commit()
    db.refresh(task)
    return task
