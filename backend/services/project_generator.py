from datetime import datetime

from agents.graph import graph

from db.execution_service import (
    save_execution
)

from services.file_writer import (
    write_project_files
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

        "test_results": {},

        "debug_report": "",

        "deployment_plan": {},

        "messages": [],

        "agent_notes": [],

        "iterations": 0,

        "execution_steps": []
    }

    result = graph.invoke(state)

    print("\n=== GRAPH RESULT ===")

    print(result.keys())

    # =====================================
    # USE FIXED CODE IF AVAILABLE
    # =====================================

    generated_files = (
        result.get("fixed_code")
        or
        result.get("generated_code")
        or
        {}
    )

    project_path = ""

    zip_path = ""

    if (
        isinstance(
            generated_files,
            dict
        )
        and
        "files" in generated_files
    ):

        project_path, zip_path = (
            write_project_files(
                result["project_id"],
                generated_files["files"]
            )
        )

    result["project_path"] = (
        project_path
    )

    # =====================================
    # SAVE EXECUTION
    # =====================================

    execution_id = save_execution(

        {

            "user_id":
                user_id,

            "project_id":
                result.get(
                    "project_id"
                ),

            "idea":
                idea,

            "project_plan":
                result.get(
                    "project_plan",
                    {}
                ),

            "generated_code":
                result.get(
                    "generated_code",
                    {}
                ),

            "fixed_code":
                result.get(
                    "fixed_code",
                    {}
                ),

            "project_path":
                project_path,

            "zip_path":
                zip_path,

            "deployment_plan":
                result.get(
                    "deployment_plan",
                    {}
                ),

            "debug_report":
                result.get(
                    "debug_report",
                    ""
                ),

            "iterations":
                result.get(
                    "iterations",
                    0
                ),

            "status":
                "completed",

            "created_at":
                datetime.utcnow(),

            "agent_notes":
                result.get(
                    "agent_notes",
                    []
                ),

            "execution_steps":
                result.get(
                    "execution_steps",
                    []
                )
        }

    )

    # =====================================
    # RESPONSE
    # =====================================

    return {

        "execution_id":
            execution_id,

        "project_id":
            result.get(
                "project_id"
            ),

        "project_path":
            project_path,

        "project_plan":
            result.get(
                "project_plan",
                {}
            ),

        "generated_code":
            result.get(
                "generated_code",
                {}
            ),

        "fixed_code":
            result.get(
                "fixed_code",
                {}
            ),

        "deployment_plan":
            result.get(
                "deployment_plan",
                {}
            ),

        "debug_report":
            result.get(
                "debug_report",
                ""
            ),

        "agent_notes":
            result.get(
                "agent_notes",
                []
            ),

        "iterations":
            result.get(
                "iterations",
                0
            ),

        "execution_steps":
            result.get(
                "execution_steps",
                []
            ),

        "zip_url":
            f"/download/{result['project_id']}",

        "status":
            "completed"
    }