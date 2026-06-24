from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from models import User, Token
from auth import authenticate_user, create_access_token, get_current_user
from database import users_collection

# Define the auth endpoint
@app.post('/login')
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={'sub': user['username']}, expires_delta=access_token_expires)
    return {'access_token': access_token, 'token_type': 'bearer'}