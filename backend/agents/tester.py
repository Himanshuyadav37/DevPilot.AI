import json
import os
import subprocess
import tempfile
from backend.agents.state import AgentState
from backend.llm.groq_client import invoke
from backend.llm.prompt_templates import build_tester_prompt

def tester_agent(state: AgentState) -> AgentState:
    print(f"[Tester] Writing and running tests...")
    state["current_agent"] = "tester"
    
    code = state.get("fixed_code") or state.get("generated_code", {})
    prompt = build_tester_prompt(code)
    
    try:
        response = invoke(prompt, system_prompt="You are a QA engineer. Return only valid JSON.")
        response = response.strip()
        if response.startswith("```"):
            response = response.split("```")[1]
            if response.startswith("json"):
                response = response[4:]
        test_files = json.loads(response)
        
        # Write all files + tests to temp dir and run pytest
        with tempfile.TemporaryDirectory() as tmpdir:
            for fname, content in code.items():
                with open(os.path.join(tmpdir, fname), "w") as f:
                    f.write(content)
            for fname, content in test_files.items():
                with open(os.path.join(tmpdir, fname), "w") as f:
                    f.write(content)
            
            result = subprocess.run(
                ["pytest", "--tb=short", "-q"],
                cwd=tmpdir,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            passed = "passed" in result.stdout
            state["test_results"] = {
                "passed": passed,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "test_files": test_files
            }
            print(f"[Tester] Tests {'PASSED' if passed else 'FAILED'}")
    except Exception as e:
        state["test_results"] = {"passed": False, "stdout": "", "stderr": str(e), "test_files": {}}
        state["errors"].append(f"Tester error: {str(e)}")
    
    return state