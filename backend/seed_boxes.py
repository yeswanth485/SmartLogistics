import sys
import os

# Add parent directory to sys.path to allow importing from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session

# Support SQLite fallback like the test runner
if not os.getenv("DATABASE_URL"):
    os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from backend.db.database import SessionLocal, engine, Base
from backend.models.domain import BoxCatalog

def seed():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        current_count = db.query(BoxCatalog).count()
        print(f"Current boxes in catalog: {current_count}")
        
        # New ecommerce standard boxes
        new_boxes = [
            {"name": "Nano Box (XS)", "length": 15.0, "width": 10.0, "height": 5.0, "max_weight": 1.0, "base_cost": 0.40},
            {"name": "Small Box (S)", "length": 25.0, "width": 20.0, "height": 15.0, "max_weight": 5.0, "base_cost": 1.20},
            {"name": "Medium Box (M)", "length": 35.0, "width": 30.0, "height": 25.0, "max_weight": 12.0, "base_cost": 2.50},
            {"name": "Large Box (L)", "length": 55.0, "width": 45.0, "height": 35.0, "max_weight": 20.0, "base_cost": 5.50},
            {"name": "Extra Large (XL)", "length": 75.0, "width": 60.0, "height": 50.0, "max_weight": 35.0, "base_cost": 12.00},
            {"name": "Slim Folder", "length": 32.0, "width": 24.0, "height": 4.0, "max_weight": 2.0, "base_cost": 0.80},
        ]
        
        for box_data in new_boxes:
            # Check if box already exists by name
            existing = db.query(BoxCatalog).filter(BoxCatalog.name == box_data["name"]).first()
            if not existing:
                print(f"Adding new box: {box_data['name']}")
                new_box = BoxCatalog(**box_data)
                db.add(new_box)
            else:
                print(f"Box {box_data['name']} already exists, updating specs.")
                existing.length = box_data["length"]
                existing.width = box_data["width"]
                existing.height = box_data["height"]
                existing.max_weight = box_data["max_weight"]
                existing.base_cost = box_data["base_cost"]
        
        db.commit()
        print("Inventory upgrade complete.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
