# from fastapi import (
#     APIRouter,
#     HTTPException,
#     Depends
# )
#
# from auth.dependencies import (
#     get_current_user
# )
#
# from api.models.execution import (
#     ProjectExecutionRequest
# )
#
# from db.execution_service import (
#     get_all_executions,
#     get_execution_by_id,
#     get_user_executions
# )
#
# from services.project_generator import (
#     generate_project
# )
#
# router = APIRouter()
#
#
# @router.post("/execute-project")
# def execute_project(
#     request: ProjectExecutionRequest,
#     current_user=Depends(
#         get_current_user
#     )
# ):
#
#     return generate_project(
#         idea=request.idea,
#         user_id=current_user["sub"]
#     )
#
#
# @router.get("/my-executions")
# def my_executions(
#     current_user=Depends(
#         get_current_user
#     )
# ):
#
#     return get_user_executions(
#         current_user["sub"]
#     )
#
#
# @router.get("/executions")
# def get_executions():
#
#     return get_all_executions()
#
#
# @router.get("/executions/{execution_id}")
# def get_execution(
#     execution_id: str
# ):
#
#     execution = get_execution_by_id(
#         execution_id
#     )
#
#     if not execution:
#
#         raise HTTPException(
#             status_code=404,
#             detail="Execution not found"
#         )
#
#     return execution



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

router = APIRouter()


@router.post("/execute-project")
def execute_project(
    request: ProjectExecutionRequest
):

    return generate_project(
        idea=request.idea,
        user_id="system"
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