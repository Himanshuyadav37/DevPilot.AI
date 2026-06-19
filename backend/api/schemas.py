from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class ProjectRunRequest(BaseModel):
    task: str

class ProjectRunResponse(BaseModel):
    run_id: str
    status: str
    message: str

class RunStatusResponse(BaseModel):
    run_id: str
    status: str
    current_agent: Optional[str]
    errors: Optional[List[str]]
    final_state: Optional[Dict[str, Any]]