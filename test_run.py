import asyncio
from fastapi.testclient import TestClient

# Temporarily patch the DB to SQLite
import os
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from backend.main import app
from backend.db.database import engine, Base

# Create tables in SQLite
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_optimize_api():
    payload = {
        "products": [
            {"name": "ItemA", "length": 10, "width": 10, "height": 10, "weight": 2.0, "quantity": 1},
            {"name": "ItemB", "length": 15, "width": 5, "height": 5, "weight": 1.5, "quantity": 2}
        ]
    }
    print("Sending request to /api/optimize...")
    response = client.post("/api/optimize", json=payload)
    print("Status:", response.status_code)
    print("Response:", response.json())
    assert response.status_code == 200

if __name__ == "__main__":
    test_optimize_api()
    print("Tests passed successfully!")
