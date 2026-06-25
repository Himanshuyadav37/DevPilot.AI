

from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
)

from api.models.execution import (
    ProjectExecutionRequest
)

from db.execution_service import (
    get_all_executions,
    get_execution_by_id,
    get_project_history,
)

from db.project_version_service import (
    get_project_versions,
    compute_code_diff,
)

from services.project_generator import (
    generate_project
)

from router.agent_router import (
    route_agent
)

from agents.conversational import (
    conversational_agent
)

from auth.optional_auth import get_optional_user

router = APIRouter()


@router.post("/execute-project")
def execute_project(
    request: ProjectExecutionRequest,
    user=Depends(get_optional_user),
):
    user_id = user.get("sub", "system")
    print("Agent Type =", request.agent_type)
    selected_agent = route_agent(
        request.agent_type
    )

    if selected_agent == "engineer":

        return generate_project(
            idea=request.idea,
            user_id=user_id,
            project_id=request.project_id,
            execution_id=request.execution_id,
            mode=request.mode,
        )

    elif selected_agent == "conversational":

        return conversational_agent(
            request.idea,
            request.conversation_id,
            user_id=user_id,
        )

    elif selected_agent == "research":

        return {
            "agent": "research",
            "message": "Coming Soon"
        }

    elif selected_agent == "education":

        return {
            "agent": "education",
            "message": "Coming Soon"
        }

    elif selected_agent == "automation":

        return {
            "agent": "automation",
            "message": "Coming Soon"
        }

    raise HTTPException(
        status_code=400,
        detail="Invalid agent type"
    )


@router.post("/continue-project")
def continue_project(
    request: ProjectExecutionRequest,
    user=Depends(get_optional_user),
):
    user_id = user.get("sub", "system")
    if not request.project_id and not request.execution_id:
        raise HTTPException(
            status_code=400,
            detail="project_id or execution_id required",
        )

    return generate_project(
        idea=request.idea,
        user_id=user_id,
        project_id=request.project_id,
        execution_id=request.execution_id,
        mode="continue",
    )


@router.get("/executions")
def get_executions(user=Depends(get_optional_user)):
    user_id = user.get("sub", "system")
    if user_id != "system":
        from db.execution_service import get_user_executions
        return get_user_executions(user_id)
    return get_all_executions()


@router.get("/executions/{execution_id}")
def get_execution(
    execution_id: str
):

    execution = get_execution_by_id(
        execution_id
    )

    if not execution:

        raise HTTPException(
            status_code=404,
            detail="Execution not found"
        )

    return execution


@router.get("/projects/{project_id}/history")
def project_history(project_id: str):
    return get_project_history(project_id)


@router.get("/projects/{project_id}/versions")
def project_versions(project_id: str):
    return get_project_versions(project_id)


@router.get("/executions/{execution_id}/diff")
def execution_diff(
    execution_id: str,
    compare: str = "fixed",
):
    execution = get_execution_by_id(execution_id)
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    generated = execution.get("generated_code", {}).get("files", [])
    fixed = execution.get("fixed_code", {}).get("files", [])

    if compare == "fixed":
        return compute_code_diff(generated, fixed)

    other = get_execution_by_id(compare)
    if not other:
        raise HTTPException(status_code=404, detail="Compare execution not found")

    other_files = (
        other.get("fixed_code", {}).get("files")
        or other.get("generated_code", {}).get("files", [])
    )
    current_files = fixed or generated
    return compute_code_diff(other_files, current_files)
