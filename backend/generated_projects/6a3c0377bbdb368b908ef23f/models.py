from pydantic import BaseModel

class User(BaseModel):
    id: str
    username: str
    email: str
    password: str

class Task(BaseModel):
    id: str
    title: str
    description: str
    due_date: str
    assigned_to: str
    status: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None