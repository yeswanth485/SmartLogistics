from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ProductInput(BaseModel):
    name: str
    length: float
    width: float
    height: float
    weight: float
    quantity: int = 1

class OptimizationRequest(BaseModel):
    products: List[ProductInput]

class PlacedItem(BaseModel):
    product_name: str
    x: float
    y: float
    z: float
    length: float
    width: float
    height: float

class PackingResultResponse(BaseModel):
    box_name: str
    box_length: float
    box_width: float
    box_height: float
    utilization_percent: float
    chargeable_weight: float
    shipping_cost: float
    ai_insights: Optional[str] = None
    placed_items: List[PlacedItem]

class BoxCatalogInput(BaseModel):
    name: str
    length: float
    width: float
    height: float
    max_weight: float
    base_cost: float

class BoxCatalogResponse(BoxCatalogInput):
    id: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "pending"

class TaskResponse(TaskCreate):
    id: str
    created_at: Any

class DashboardStats(BaseModel):
    total_packages: int
    avg_utilization: float
    total_savings: float
    active_tasks: int

class TrendPoint(BaseModel):
    date: str
    volume: float
    savings: float

class DashboardData(BaseModel):
    stats: DashboardStats
    trends: List[TrendPoint]
