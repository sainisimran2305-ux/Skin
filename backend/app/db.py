import logging
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

def get_db():
    if db_instance.db is None:
        # Fallback inline connection check if client not initialized via lifespan
        logger.info("Initializing database connection client")
        db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
        db_instance.db = db_instance.client[settings.DB_NAME]
    return db_instance.db

async def connect_db():
    logger.info("Connecting to MongoDB Database...")
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db_instance.db = db_instance.client[settings.DB_NAME]
    # Quick test ping
    try:
        await db_instance.client.admin.command('ping')
        logger.info("Connected to MongoDB successfully!")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise e

async def close_db():
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB database connection closed.")
