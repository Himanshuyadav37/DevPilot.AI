from fastapi import APIRouter, Depends

from auth.dependencies import get_current_user

router = APIRouter()

@router.get("/me")
def get_me(
    current_user=Depends(get_current_user)
):
    return current_user