from fastapi import HTTPException

from db.mongo_client import users_collection
from core.security import hash_password, verify_password, create_access_token



def register_user(user):
    existing = users_collection.find_one(
        {"email": user.email}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    data = user.model_dump()

    data["password"] = hash_password(user.password)

    print("Password Length:", len(user.password))

    users_collection.insert_one(data)

    return {
        "message": "User Created Successfully"
    }

def login_user(user):

    db_user = users_collection.find_one(
        {"email": user.email}
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    if not verify_password(
            user.password,
            db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    token = create_access_token(
        {
            "sub": str(db_user["_id"]),
            "email": db_user["email"]
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }