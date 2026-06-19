from langgraph.graph import StateGraph, END
from backend.agents.state import AgentState
from backend.agents.planner import planner_agent
from backend.agents.coder import coder_agent
from backend.agents.tester import tester_agent
from backend.agents.debugger import debugger_agent
from backend.agents.deployer import deployer_agent

def should_debug_or_deploy(state: AgentState) -> str:
    if state["status"] == "failed":
        return "end"
    if state["test_results"] and state["test_results"]["passed"]:
        return "deployer"
    if state["debug_attempts"] >= 3:
        return "end"
    return "debugger"

def build_graph():
    graph = StateGraph(AgentState)
    
    graph.add_node("planner", planner_agent)
    graph.add_node("coder", coder_agent)
    graph.add_node("tester", tester_agent)
    graph.add_node("debugger", debugger_agent)
    graph.add_node("deployer", deployer_agent)
    
    graph.set_entry_point("planner")
    graph.add_edge("planner", "coder")
    graph.add_edge("coder", "tester")
    graph.add_conditional_edges("tester", should_debug_or_deploy, {
        "deployer": "deployer",
        "debugger": "debugger",
        "end": END
    })
    graph.add_edge("debugger", "tester")
    graph.add_edge("deployer", END)
    
    return graph.compile()

devpilot_graph = build_graph()