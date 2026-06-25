from datetime import datetime

from agents.graph import graph

from db.execution_service import (
    save_execution,
    get_execution_by_id,
    get_execution_by_project_id,
)

from db.project_version_service import save_version

from services.file_writer import (
    write_project_files
)


def _hydrate_from_execution(state: dict, execution: dict, new_idea: str):
    state["project_id"] = execution.get("project_id", "")
    state["project_plan"] = execution.get("project_plan", {})
    state["generated_code"] = execution.get("generated_code", {})
    state["fixed_code"] = execution.get("fixed_code", {})
    state["idea"] = (
        f"Continue development on existing project.\n"
        f"Original idea: {execution.get('idea', '')}\n"
        f"New request: {new_idea}"
    )
    state["parent_execution_id"] = execution.get("_id", "")
    state["mode"] = "continue"
    return state


def generate_project(
    idea: str,
    user_id: str,
    project_id: str | None = None,
    execution_id: str | None = None,
    mode: str = "new",
):
    parent_execution_id = None

    state = {
        "user_id": user_id,
        "idea": idea,
        "project_id": project_id or "",
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
        "execution_steps": [],
        "mode": mode,
        "parent_execution_id": "",
    }

    if mode == "continue":
        execution = None
        if execution_id:
            execution = get_execution_by_id(execution_id)
        elif project_id:
            execution = get_execution_by_project_id(project_id)

        if execution:
            parent_execution_id = execution.get("_id")
            state = _hydrate_from_execution(state, execution, idea)
        else:
            state["mode"] = "new"

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

            "mode":
                result.get("mode", mode),

            "parent_execution_id":
                parent_execution_id or result.get("parent_execution_id"),

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

    pid = result.get("project_id")
    if pid:
        save_version(
            project_id=pid,
            execution_id=execution_id,
            idea=idea,
            generated_code=result.get("generated_code", {}),
            fixed_code=result.get("fixed_code", {}),
            parent_execution_id=parent_execution_id,
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

        "mode":
            result.get("mode", mode),

        "parent_execution_id":
            parent_execution_id or result.get("parent_execution_id"),

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