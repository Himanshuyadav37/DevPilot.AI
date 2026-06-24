import json
import re

from llm.groq_client import (
    generate_response
)

from llm.prompt_templates import (
    TESTER_PROMPT
)

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

    prompt = TESTER_PROMPT.replace(
        "{generated_code}",
        str(generated_code)
    )

    response = generate_response(
        prompt
    )

    print("\n=== TESTER RAW ===\n")
    print(response[:3000])

    try:

        response = re.sub(
            r"```json|```",
            "",
            response
        ).strip()

        match = re.search(
            r"\{.*\}",
            response,
            re.DOTALL
        )

        if not match:
            raise ValueError(
                "No JSON found"
            )

        report = json.loads(
            match.group()
        )

    except Exception as e:

        print(
            "\n=== TESTER PARSE ERROR ==="
        )
        print(str(e))

        report = {
            "status": "FAIL",
            "summary": {
                "critical_count": 1,
                "high_count": 0,
                "medium_count": 0,
                "low_count": 0
            },
            "issues": [
                {
                    "severity": "CRITICAL",
                    "category": "JSON",
                    "description":
                        f"Tester parse failed: {str(e)}",
                    "suggested_fix":
                        "Return valid JSON"
                }
            ]
        }

    state["test_results"] = report

    state["agent_notes"].append(
        "Tester analyzed code"
    )

    save_memory(
        {
            "project_id":
                state["project_id"],

            "agent":
                "tester",

            "note":
                "Tester completed analysis"
        }
    )

    return state