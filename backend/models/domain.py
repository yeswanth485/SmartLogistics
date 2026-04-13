from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from backend.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Order(Base):
    __tablename__ = "sl_orders"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    total_cost = Column(Float, nullable=True)
    ai_insights_summary = Column(String, nullable=True)
    
    products = relationship("Product", back_populates="order", cascade="all, delete-orphan")
    packing_results = relationship("PackingResult", back_populates="order", cascade="all, delete-orphan")

class BoxCatalog(Base):
    __tablename__ = "sl_box_catalog"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, unique=True, index=True)
    length = Column(Float, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    max_weight = Column(Float, nullable=False)
    base_cost = Column(Float, nullable=False)
    
    packing_results = relationship("PackingResult", back_populates="box")

class Product(Base):
    __tablename__ = "sl_products"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("sl_orders.id"))
    name = Column(String, nullable=False)
    length = Column(Float, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    
    order = relationship("Order", back_populates="products")

class PackingResult(Base):
    __tablename__ = "sl_packing_results"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("sl_orders.id"))
    box_id = Column(String, ForeignKey("sl_box_catalog.id"))
    utilization_percent = Column(Float, nullable=False)
    chargeable_weight = Column(Float, nullable=False)
    shipping_cost = Column(Float, nullable=False)
    packed_items_json = Column(JSON, nullable=False) # Stores placement data for frontend 3D rendering
    
    order = relationship("Order", back_populates="packing_results")
    box = relationship("BoxCatalog", back_populates="packing_results")

class Task(Base):
    __tablename__ = "sl_tasks"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="pending") # pending, in_progress, completed
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
