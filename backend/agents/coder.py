import json
import re

from llm.groq_client import (
    generate_response
)

from llm.prompt_templates import (
    CODER_PROMPT
)

from memory.project_memory import (
    save_memory
)


def coder_agent(state):

    project_plan = state.get(
        "project_plan",
        {}
    )

    prompt = CODER_PROMPT.replace(
        "{project_plan}",
        json.dumps(
            project_plan,
            indent=2
        )
    )

    response = generate_response(
        prompt
    )

    print(
        "\n=== CODER RAW ===\n"
    )

    print(response[:3000])

    response = re.sub(
        r"```json|```",
        "",
        response
    ).strip()

    try:

        start = response.find("{")
        end = response.rfind("}")

        if (
            start == -1
            or
            end == -1
        ):
            raise ValueError(
                "No JSON found in coder response"
            )

        json_text = response[
            start:end + 1
        ]

        generated_files = json.loads(
            json_text
        )

        if not isinstance(
            generated_files,
            dict
        ):
            raise ValueError(
                "Coder output is not a JSON object"
            )

        if "files" not in generated_files:
            raise ValueError(
                "Missing files key"
            )

        if not isinstance(
            generated_files["files"],
            list
        ):
            raise ValueError(
                "files must be a list"
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

        print(
            "\n=== CODER SUCCESS ==="
        )

    except Exception as e:

        print(
            "\n=== CODER PARSE ERROR ==="
        )

        print(str(e))

        generated_files = {
            "files": [],
            "error": str(e),
            "raw_response": response
        }

        state["agent_notes"].append(
            "Coder returned invalid JSON"
        )

    state["generated_code"] = (
        generated_files
    )

    print(
        "\n=== GENERATED CODE ===\n"
    )

    print(
        state["generated_code"]
    )

    return state