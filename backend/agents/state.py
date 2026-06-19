from typing import TypedDict, Optional, List, Dict, Any

class AgentState(TypedDict):
    run_id: str
    user_id: str
    task: str
    plan: Optional[Dict[str, Any]]
    rag_context: Optional[str]
    test_results: Optional[Dict[str, Any]]
    fixed_code: Optional[Dict[str, str]]
    deployment_files: Optional[Dict[str, str]]
    debug_attempts: int
    errors: List[str]
    status: str  # "running", "completed", "failed"
    current_agent: str