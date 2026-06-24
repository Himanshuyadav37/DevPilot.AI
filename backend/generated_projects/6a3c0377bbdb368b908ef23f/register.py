from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from models import User
from database import users_collection
from auth import get_password_hash

# Define the register endpoint
@app.post('/register')
async def register(user: User):
    user_dict = user.dict()
    user_dict['password'] = get_password_hash(user_dict['password'])
    new_user = await users_collection.insert_one(user_dict)
    return {'message': 'User created successfully'}