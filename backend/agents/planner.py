import json
from backend.agents.state import AgentState
from backend.llm.groq_client import invoke
from backend.llm.prompt_templates import build_planner_prompt

def planner_agent(state: AgentState) -> AgentState:
    print(f"[Planner] Starting for task: {state['task']}")
    state["current_agent"] = "planner"
    
    prompt = build_planner_prompt(state["task"])
    
    for attempt in range(2):
        try:
            response = invoke(prompt, system_prompt="You are a software architect. Return only valid JSON.")
            # Clean response
            response = response.strip()
            if response.startswith("```"):
                response = response.split("```")[1]
                if response.startswith("json"):
                    response = response[4:]
            plan = json.loads(response)
            state["plan"] = plan
            state["current_agent"] = "planner_done"
            print(f"[Planner] Plan created: {plan}")
            return state
        except json.JSONDecodeError as e:
            print(f"[Planner] JSON parse failed attempt {attempt+1}: {e}")
    
    state["errors"].append("Planner failed to generate valid plan")
    state["status"] = "failed"
    return state