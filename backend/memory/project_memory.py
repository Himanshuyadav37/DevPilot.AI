from db.mongo_client import db

memory_collection = db["project_memory"]


def save_memory(data):

    memory_collection.insert_one(
        data
    )


def get_project_memory(
    project_id: str
):

    return list(
        memory_collection.find(
            {
                "project_id": project_id
            }
        )
    )