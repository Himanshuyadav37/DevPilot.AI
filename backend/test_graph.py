from agents.graph import graph

state = {
"user_id":
        "test-user",

    "idea":
        "Build an AI Resume Analyzer",

    "project_id": "",
    "project_plan": {},

    "generated_code": "",

    "test_results": "",

    "debug_report": "",

    "deployment_plan": "",

    "messages": [],

"fixed_code": {},

"iterations": 0,
}

result = graph.invoke(state)

print("\n=== FIXED CODE ===\n")

print(result["fixed_code"])

print(result)