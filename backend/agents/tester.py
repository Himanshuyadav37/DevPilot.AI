from llm.groq_client import generate_response
from llm.prompt_templates import TESTER_PROMPT

from memory.project_memory import (
    save_memory
)


def tester_agent(state):

    generated_code = state.get(
        "fixed_code"
    )

    if not generated_code:
        generated_code = state.get(
            "generated_code"
        )

    prompt = TESTER_PROMPT.format(
        generated_code=generated_code
    )

    test_report = generate_response(
        prompt
    )

    state["test_results"] = (
        test_report
    )

    state["agent_notes"].append(
        "Tester analyzed generated code"
    )

    save_memory(
        {
            "project_id":
                state["project_id"],

            "agent":
                "tester",

            "note":
                "Tester completed code analysis"
        }
    )

    return state