from motor.motor_asyncio import AsyncIOMotorClient
from backend.config import settings

_client = None

def get_db():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.MONGO_URL)
    return _client[settings.DB_NAME]