import json
import re

from llm.groq_client import generate_response
from llm.prompt_templates import CODER_PROMPT

from memory.project_memory import (
    save_memory
)


def coder_agent(state):

    project_plan = state["project_plan"]

    prompt = CODER_PROMPT.format(
        project_plan=project_plan
    )

    response = generate_response(prompt)

    response = re.sub(
        r"```json|```",
        "",
        response
    ).strip()

    try:

        generated_files = json.loads(
            response
        )

        state["agent_notes"].append(
            "Coder generated project code"
        )

        save_memory(
            {
                "project_id":
                    state["project_id"],

                "agent":
                    "coder",

                "note":
                    "Generated project code"
            }
        )

    except Exception:

        generated_files = {
            "raw_response": response
        }

        state["agent_notes"].append(
            "Coder returned non-JSON output"
        )

    state["generated_code"] = (
        generated_files
    )

    print("\n=== GENERATED CODE ===\n")
    print(state["generated_code"])

    return state