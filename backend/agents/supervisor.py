import uuid
from backend.agents.state import AgentState
from backend.agents.graph import devpilot_graph
from backend.db.crud import save_run, update_run_status

async def run_pipeline(task: str, user_id: str) -> str:
    run_id = str(uuid.uuid4())
    
    initial_state: AgentState = {
        "run_id": run_id,
        "user_id": user_id,
        "task": task,
        "plan": None,
        "rag_context": None,
        "generated_code": None,
        "test_results": None,
        "fixed_code": None,
        "deployment_files": None,
        "debug_attempts": 0,
        "errors": [],
        "status": "running",
        "current_agent": "supervisor"
    }
    
    await save_run(run_id, user_id, task)
    
    try:
        final_state = devpilot_graph.invoke(initial_state)
        await update_run_status(run_id, final_state["status"], final_state)
    except Exception as e:
        await update_run_status(run_id, "failed", {"errors": [str(e)]})
    
    return run_id