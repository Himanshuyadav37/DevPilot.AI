from fastapi import APIRouter, Depends, BackgroundTasks
from backend.api.schemas import ProjectRunRequest, ProjectRunResponse
from backend.auth.dependencies import get_current_user
from backend.agents.supervisor import run_pipeline

router = APIRouter(prefix="/project", tags=["project"])

@router.post("/run", response_model=ProjectRunResponse)
async def run_project(req: ProjectRunRequest, background_tasks: BackgroundTasks, user=Depends(get_current_user)):
    import uuid
    run_id = str(uuid.uuid4())
    background_tasks.add_task(run_pipeline, req.task, user["email"])
    return ProjectRunResponse(run_id=run_id, status="started", message="Pipeline started")