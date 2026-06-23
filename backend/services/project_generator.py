from datetime import datetime

from agents.graph import graph

from db.execution_service import (
    save_execution
)


def generate_project(
    idea: str,
    user_id: str
):

    state = {

        "user_id":
            user_id,

        "idea":
            idea,

        "project_id": "",
        "project_plan": {},

        "generated_code": {},
        "fixed_code": {},

        "project_path": "",

        "test_results": "",
        "debug_report": "",

        "deployment_plan": {},

        "messages": [],

        "agent_notes": [],

        "iterations": 0
    }

    result = graph.invoke(state)

    execution_id = save_execution(
        {
            "user_id":
                user_id,

            "project_id":
                result["project_id"],

            "idea":
                idea,

            "project_plan":
                result["project_plan"],

            "generated_code":
                result["generated_code"],

            "fixed_code":
                result["fixed_code"],

            "deployment_plan":
                result["deployment_plan"],

            "debug_report":
                result["debug_report"],

            "iterations":
                result["iterations"],

            "status":
                "completed",

            "created_at":
                datetime.utcnow(),

            "agent_notes":
    result.get(
        "agent_notes",
        []
    ),
        }
    )

    return {

        "execution_id":
            execution_id,

        "project_id":
            result["project_id"],

        "project_plan":
            result["project_plan"],

        "generated_code":
            result["generated_code"],

        "fixed_code":
            result["fixed_code"],

        "deployment_plan":
            result["deployment_plan"],

        "debug_report":
            result["debug_report"],

        "agent_notes":
    result.get(
        "agent_notes",
        []
    ),

        "iterations":
            result["iterations"],

        "status":
            "completed"
    }