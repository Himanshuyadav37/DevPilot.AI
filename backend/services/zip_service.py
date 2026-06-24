import os
import zipfile


def create_project_zip(
    project_id: str
):

    project_folder = os.path.join(
        "generated_projects",
        project_id
    )

    zip_path = os.path.join(
        "generated_projects",
        f"{project_id}.zip"
    )

    with zipfile.ZipFile(
        zip_path,
        "w",
        zipfile.ZIP_DEFLATED
    ) as zipf:

        for root, dirs, files in os.walk(
            project_folder
        ):

            for file in files:

                file_path = os.path.join(
                    root,
                    file
                )

                arcname = os.path.relpath(
                    file_path,
                    project_folder
                )

                zipf.write(
                    file_path,
                    arcname
                )

    return zip_path