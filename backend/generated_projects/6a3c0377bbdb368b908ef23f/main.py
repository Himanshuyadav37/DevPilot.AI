import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from pymongo import MongoClient
import motor.motor_asyncio
from typing import List
from datetime import datetime, timedelta
from passlib.context import CryptContext

# Define the FastAPI app
app = FastAPI()