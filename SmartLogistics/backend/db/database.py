import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Fallback URI if not provided. Note we removed +asyncpg
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/smart_logistics")

try:
    engine = create_engine(DATABASE_URL, echo=False)
except Exception as e:
    # if it has +asyncpg in env, we strip it out for sync engine
    DATABASE_URL = DATABASE_URL.replace("+asyncpg", "")
    engine = create_engine(DATABASE_URL, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
