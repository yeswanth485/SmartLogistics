from sqlalchemy.orm import Session
from backend.schemas.transport import OptimizationRequest, PackingResultResponse, PlacedItem
from backend.models.domain import Order, Product, PackingResult, BoxCatalog
from backend.engines.pack.bin_packer import Item, Box
from backend.engines.ai.optimizer import GeneticOptimizer
from backend.engines.cost.calculator import CostEngine
from backend.services.openrouter import generate_logistics_insights

class LogisticsPipeline:
    @staticmethod
    async def execute(req: OptimizationRequest, db: Session) -> PackingResultResponse:
        # Phase 1: Store Order & Parse Products
        order = Order()
        db.add(order)
        db.commit()
        db.refresh(order)
        
        items = []
        for p in req.products:
            prod = Product(order_id=order.id, name=p.name, length=p.length, width=p.width, height=p.height, weight=p.weight, quantity=p.quantity)
            db.add(prod)
            for _ in range(p.quantity):
                items.append(Item(p.name, p.length, p.width, p.height, p.weight))
                
        db.commit()

        # Phase 2: Fetch and Prepare Box Catalog
        db_boxes = db.query(BoxCatalog).all()
        if not db_boxes:
            db_boxes = [
                BoxCatalog(name="Nano Box (XS)", length=15.0, width=10.0, height=5.0, max_weight=1.0, base_cost=0.40),
                BoxCatalog(name="Small Box (S)", length=25.0, width=20.0, height=15.0, max_weight=5.0, base_cost=1.20),
                BoxCatalog(name="Medium Box (M)", length=35.0, width=30.0, height=25.0, max_weight=12.0, base_cost=2.50),
                BoxCatalog(name="Large Box (L)", length=55.0, width=45.0, height=35.0, max_weight=20.0, base_cost=5.50),
                BoxCatalog(name="Extra Large (XL)", length=75.0, width=60.0, height=50.0, max_weight=35.0, base_cost=12.00),
                BoxCatalog(name="Slim Folder", length=32.0, width=24.0, height=4.0, max_weight=2.0, base_cost=0.80),
            ]
            db.add_all(db_boxes)
            db.commit()

        templates = [Box(b.name, b.length, b.width, b.height, b.max_weight, b.base_cost) for b in db_boxes]

        # Phase 3: Spatial Engine & Genetic Algorithm Optimization
        optimizer = GeneticOptimizer(items=items, template_boxes=templates, pop_size=30, generations=20)
        best_box = optimizer.optimize()

        # Phase 4: Cost Modeling & LLM AI Insights
        cw, cost = CostEngine.calculate_cost(best_box)
        insights = await generate_logistics_insights(best_box)

        # Phase 5: Commit Aggregated Results to Database
        placed = [PlacedItem(**pi) for pi in best_box.items]
        box_id = next(b.id for b in db_boxes if b.name == best_box.name)
        
        db_result = PackingResult(
            order_id=order.id,
            box_id=box_id,
            utilization_percent=best_box.utilization * 100,
            chargeable_weight=cw,
            shipping_cost=cost,
            packed_items_json=[pi.model_dump() for pi in placed]
        )
        db.add(db_result)
        
        order.total_cost = cost
        order.ai_insights_summary = insights
        db.commit()

        # Phase 6: Return Pipeline Data format
        return PackingResultResponse(
            box_name=best_box.name,
            box_length=best_box.l,
            box_width=best_box.w,
            box_height=best_box.h,
            utilization_percent=best_box.utilization * 100,
            chargeable_weight=cw,
            shipping_cost=cost,
            ai_insights=insights,
            placed_items=placed
        )
