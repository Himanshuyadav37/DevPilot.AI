from pymongo import MongoClient
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017/')
db = client['todo_app']
users_collection = db['users']
tasks_collection = db['tasks']