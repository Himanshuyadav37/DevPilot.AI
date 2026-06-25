from pymongo import MongoClient
from config import settings

client = MongoClient(settings.MONGO_URL)

db = client[settings.DB_NAME]

users_collection = db["users"]
projects_collection = db["projects"]
history_collection = db["history"]
executions_collection = db["executions"]

# NEW
settings_collection = db["settings"]

conversations_collection = db["conversations"]