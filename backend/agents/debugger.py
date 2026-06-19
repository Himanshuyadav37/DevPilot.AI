import json
from backend.agents.state import AgentState
from backend.llm.groq_client import invoke
from backend.llm.prompt_templates import build_debugger_prompt

MAX_DEBUG_ATTEMPTS = 3

def debugger_agent(state: AgentState) -> AgentState:
    print(f"[Debugger] Attempt {state['debug_attempts'] + 1}/{MAX_DEBUG_ATTEMPTS}")
    state["current_agent"] = "debugger"
    
    if state["debug_attempts"] >= MAX_DEBUG_ATTEMPTS:
        state["status"] = "failed"
        state["errors"].append("Max debug attempts reached")
        return state
    
    code = state.get("fixed_code") or state.get("generated_code", {})
    failures = state["test_results"].get("stdout", "") + state["test_results"].get("stderr", "")
    
    prompt = build_debugger_prompt(code, failures)
    
    try:
        response = invoke(prompt, system_prompt="You are a debugging expert. Return only valid JSON.")
        response = response.strip()
        if response.startswith("```"):
            response = response.split("```")[1]
            if response.startswith("json"):
                response = response[4:]
        fixed = json.loads(response)
        state["fixed_code"] = fixed
        state["debug_attempts"] += 1
        print(f"[Debugger] Fixed code generated")
    except Exception as e:
        state["errors"].append(f"Debugger failed: {str(e)}")
        state["status"] = "failed"
    
    return state