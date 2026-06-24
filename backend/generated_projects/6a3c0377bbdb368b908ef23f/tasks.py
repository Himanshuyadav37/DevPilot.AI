from fastapi import Depends, HTTPException
from pydantic import BaseModel
from models import Task
from database import tasks_collection
from auth import get_current_user

# Define the task endpoint
@app.post('/tasks')
async def create_task(task: Task, current_user: dict = Depends(get_current_user)):
    task_dict = task.dict()
    task_dict['assigned_to'] = current_user['username']
    new_task = await tasks_collection.insert_one(task_dict)
    return {'message': 'Task created successfully'}

# Define the get tasks endpoint
@app.get('/tasks')
async def get_tasks(current_user: dict = Depends(get_current_user)):
    tasks = await tasks_collection.find({'assigned_to': current_user['username']}).to_list(1000)
    return tasks