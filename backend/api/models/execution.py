from pydantic import BaseModel


class ProjectExecutionRequest(
    BaseModel
):
    idea: str
    agent_type: str = "engineer"
    conversation_id: str | None = None