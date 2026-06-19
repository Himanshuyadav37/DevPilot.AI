def build_planner_prompt(task: str) -> str:
    return f"""
You are a software architect. Analyze this task and return a JSON plan.

TASK: {task}

Return ONLY valid JSON in this exact format:
{{
  "files": ["main.py", "models.py"],
  "tech_stack": ["FastAPI", "MongoDB"],
  "subtasks": [
    {{"file": "main.py", "description": "FastAPI entry point with routes"}},
    {{"file": "models.py", "description": "Pydantic models for request/response"}}
  ],
  "complexity": "medium"
}}

Return ONLY JSON. No explanation. No markdown.
"""

def build_coder_prompt(plan: dict, rag_context: str) -> str:
    return f"""
You are an expert software engineer. Generate production-grade code based on this plan.

PLAN: {plan}

BEST PRACTICES & CONTEXT:
{rag_context}

Return ONLY valid JSON in this exact format:
{{
  "filename.py": "# full code here",
  "another_file.py": "# full code here"
}}

Return ONLY JSON. No explanation. No markdown backticks.
"""

def build_tester_prompt(code: dict) -> str:
    code_str = "\n\n".join([f"# {fname}\n{content}" for fname, content in code.items()])
    return f"""
You are a QA engineer. Write pytest unit tests for this code.

CODE:
{code_str}

Return ONLY valid JSON:
{{
  "test_main.py": "# pytest test code here"
}}

Return ONLY JSON. No explanation. No markdown.
"""

def build_debugger_prompt(code: dict, test_failures: str) -> str:
    code_str = "\n\n".join([f"# {fname}\n{content}" for fname, content in code.items()])
    return f"""
You are a debugging expert. Fix the code based on test failures.

ORIGINAL CODE:
{code_str}

TEST FAILURES:
{test_failures}

Analyze failures, fix the bugs, return corrected code.
Return ONLY valid JSON same format as input code:
{{
  "filename.py": "# fixed code here"
}}

Return ONLY JSON. No explanation. No markdown.
"""

def build_deployer_prompt(code: dict) -> str:
    code_str = "\n\n".join([f"# {fname}\n{content}" for fname, content in code.items()])
    return f"""
You are a DevOps engineer. Generate deployment files for this code.

CODE:
{code_str}

Return ONLY valid JSON:
{{
  "Dockerfile": "# dockerfile content",
  "docker-compose.yml": "# compose content",
  "requirements.txt": "# python packages",
  "README.md": "# project readme"
}}

Return ONLY JSON. No explanation. No markdown.
"""