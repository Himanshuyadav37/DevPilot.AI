from fastapi import APIRouter
from auth.models import UserRegister, UserLogin
from auth.service import register_user, login_user

router = APIRouter()

@router.post("/register")
def register(user: UserRegister):
    return register_user(user)

@router.post("/login")
def login(user: UserLogin):
    return login_user(user)