import json
import re

from llm.groq_client import generate_response
from llm.prompt_templates import FIXER_PROMPT

from memory.project_memory import (
    save_memory
)


def debugger_agent(state):

    state["iterations"] = (
        state.get("iterations", 0) + 1
    )

    generated_code = str(
        state["generated_code"]
    )

    test_report = state["test_results"]

    prompt = FIXER_PROMPT.format(
        generated_code=generated_code,
        test_report=test_report
    )

    response = generate_response(prompt)

    response = re.sub(
        r"```json|```",
        "",
        response
    ).strip()

    try:

        fixed_code = json.loads(response)

        state["fixed_code"] = fixed_code

        state["generated_code"] = fixed_code

        state["debug_report"] = (
            "Code fixes generated successfully"
        )

        state["agent_notes"].append(
            "Debugger generated code fixes"
        )

        save_memory(
            {
                "project_id":
                    state["project_id"],

                "agent":
                    "debugger",

                "note":
                    "Generated code fixes"
            }
        )

    except Exception:

        state["fixed_code"] = {
            "raw_response": response
        }

        state["debug_report"] = (
            "Failed to parse fixed code"
        )

        state["agent_notes"].append(
            "Debugger failed to generate valid fixes"
        )

    state["test_results"] = ""

    return state