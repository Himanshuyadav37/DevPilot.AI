import json
from backend.agents.state import AgentState
from backend.llm.groq_client import invoke
from backend.llm.prompt_templates import build_deployer_prompt

def deployer_agent(state: AgentState) -> AgentState:
    print(f"[Deployer] Generating deployment files...")
    state["current_agent"] = "deployer"
    
    code = state.get("fixed_code") or state.get("generated_code", {})
    prompt = build_deployer_prompt(code)
    
    try:
        response = invoke(prompt, system_prompt="You are a DevOps engineer. Return only valid JSON.")
        response = response.strip()
        if response.startswith("```"):
            response = response.split("```")[1]
            if response.startswith("json"):
                response = response[4:]
        deployment_files = json.loads(response)
        state["deployment_files"] = deployment_files
        state["status"] = "completed"
        state["current_agent"] = "deployer_done"
        print(f"[Deployer] Deployment files generated")
    except Exception as e:
        state["errors"].append(f"Deployer failed: {str(e)}")
        state["status"] = "failed"
    
    return state