from pydantic import BaseModel


class ProjectExecutionRequest(
    BaseModel
):
    idea: str