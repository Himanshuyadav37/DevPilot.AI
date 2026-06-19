import json
from backend.agents.state import AgentState
from backend.llm.groq_client import invoke
from backend.llm.prompt_templates import build_coder_prompt
from backend.rag.retriever import retrieve

def coder_agent(state: AgentState) -> AgentState:
    print(f"[Coder] Generating code...")
    state["current_agent"] = "coder"
    
    rag_query = f"{state['task']} {state['plan'].get('tech_stack', [])}"
    rag_context = retrieve(rag_query)
    state["rag_context"] = rag_context
    
    prompt = build_coder_prompt(state["plan"], rag_context)
    
    try:
        response = invoke(prompt, system_prompt="You are an expert software engineer. Return only valid JSON.")
        response = response.strip()
        if response.startswith("```"):
            response = response.split("```")[1]
            if response.startswith("json"):
                response = response[4:]
        code = json.loads(response)
        state["generated_code"] = code
        state["current_agent"] = "coder_done"
        print(f"[Coder] Generated {len(code)} files")
    except Exception as e:
        state["errors"].append(f"Coder failed: {str(e)}")
        state["status"] = "failed"
    
    return state