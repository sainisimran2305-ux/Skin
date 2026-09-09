import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .db import connect_db, close_db, get_db
from .seeds import seed_database
from .routes import products, ingredients, orders

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("app.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup lifecycle
    logger.info("Starting up backend application...")
    try:
        await connect_db()
        db = get_db()
        await seed_database(db)
    except Exception as e:
        logger.error(f"Failed during startup connection or seeding: {e}")
    
    yield
    
    # Shutdown lifecycle
    logger.info("Shutting down backend application...")
    await close_db()

app = FastAPI(
    title="Prakriti Natural Skincare API",
    description="Python FastAPI backend connected to MongoDB Atlas for Prakriti Skincare e-commerce.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
# React app by default runs on port 5173 (Vite default) or 3000
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open to all origins for easy local dev testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(products.router, prefix="/api")
app.include_router(ingredients.router, prefix="/api")
app.include_router(orders.router, prefix="/api")

@app.get("/", tags=["Health Check"])
async def root():
    return {
        "status": "online",
        "message": "Prakriti Natural Skincare API is running",
        "docs_url": "/docs"
    }
