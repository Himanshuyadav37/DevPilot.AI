import json
import re

from llm.groq_client import generate_response
from llm.prompt_templates import PLANNER_PROMPT
from db.project_service import create_project
from rag.retriever import get_context

from memory.project_memory import (
    save_memory
)


def planner_agent(state):

    idea = state["idea"]

    owner_id = state["user_id"]

    # Retrieve relevant context from RAG
    context = get_context(idea)

    prompt = f"""
    {PLANNER_PROMPT}

    RELEVANT KNOWLEDGE:
    {context}

    SOFTWARE IDEA:
    {idea}
    """

    response = generate_response(prompt)

    response = re.sub(
        r"```json|```",
        "",
        response
    ).strip()

    try:

        plan = json.loads(response)

        project_id = create_project(
            owner_id=owner_id,
            idea=idea,
            project_plan=plan
        )

        state["project_id"] = project_id
        state["project_plan"] = plan

        state["agent_notes"].append(
            f"Planner created project plan for: {idea}"
        )

        save_memory(
            {
                "project_id": project_id,
                "agent": "planner",
                "note": f"Created plan for {idea}"
            }
        )

        return state


    except Exception as e:

        state["agent_notes"].append(

            "Planner failed to generate valid plan"

        )

        state["project_plan"] = {

            "success": False,

            "error": str(e),

            "raw_response": response

        }

        return state