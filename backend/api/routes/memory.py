from fastapi import APIRouter

from memory.project_memory import (
    get_project_memory
)

router = APIRouter()


@router.get("/{project_id}")
def project_memory(
    project_id: str
):

    return get_project_memory(
        project_id
    )