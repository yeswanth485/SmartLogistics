import os

class Settings:
    PROJECT_NAME: str = "SmartLogistics"
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/smart_logistics")
    # For cost engine
    VOLUMETRIC_DIVISOR: float = 5000.0  # cm3/kg

settings = Settings()
