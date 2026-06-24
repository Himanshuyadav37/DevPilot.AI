from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter()


@router.get(
    "/download/{project_id}"
)
def download_project(
    project_id: str
):

    zip_path = os.path.join(
        "generated_projects",
        f"{project_id}.zip"
    )

    if not os.path.exists(
        zip_path
    ):

        return {
            "error":
            "Zip file not found"
        }

    return FileResponse(

        path=zip_path,

        filename=
        f"{project_id}.zip",

        media_type=
        "application/zip"
    )