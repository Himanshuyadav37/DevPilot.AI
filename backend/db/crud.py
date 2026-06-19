from datetime import datetime
from backend.db.mongo_client import get_db

async def save_run(run_id: str, user_id: str, task: str):
    db = get_db()
    await db.runs.insert_one({
        "run_id": run_id,
        "user_id": user_id,
        "task": task,
        "status": "running",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })

async def update_run_status(run_id: str, status: str, final_state: dict = None):
    db = get_db()
    update = {"status": status, "updated_at": datetime.utcnow()}
    if final_state:
        update["final_state"] = final_state
    await db.runs.update_one({"run_id": run_id}, {"$set": update})

async def get_run_by_id(run_id: str):
    db = get_db()
    return await db.runs.find_one({"run_id": run_id}, {"_id": 0})

async def get_user_runs(user_id: str):
    db = get_db()
    cursor = db.runs.find({"user_id": user_id}, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(length=50)

async def create_user(email: str, hashed_password: str, username: str):
    db = get_db()
    await db.users.insert_one({
        "email": email,
        "username": username,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    })

async def get_user_by_email(email: str):
    db = get_db()
    return await db.users.find_one({"email": email}, {"_id": 0})