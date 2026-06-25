

from fastapi import (
    APIRouter,
    HTTPException
)

from api.models.execution import (
    ProjectExecutionRequest
)

from db.execution_service import (
    get_all_executions,
    get_execution_by_id
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

router = APIRouter()


@router.post("/execute-project")
def execute_project(
    request: ProjectExecutionRequest
):
    print("Agent Type =", request.agent_type)
    selected_agent = route_agent(
        request.agent_type
    )

    if selected_agent == "engineer":

        return generate_project(
            idea=request.idea,
            user_id="system"
        )



    elif selected_agent == "conversational":

        return conversational_agent(

            request.idea,

            request.conversation_id

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


@router.get("/executions")
def get_executions():

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