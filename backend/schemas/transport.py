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
