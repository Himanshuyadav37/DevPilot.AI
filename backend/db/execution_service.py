from bson import ObjectId

from db.mongo_client import (
    executions_collection
)


def save_execution(data):

    result = executions_collection.insert_one(
        data
    )

    return str(result.inserted_id)


def get_all_executions():

    executions = list(
        executions_collection.find()
    )

    for execution in executions:

        execution["_id"] = str(
            execution["_id"]
        )

    return executions


def get_execution_by_id(
    execution_id: str
):

    execution = executions_collection.find_one(
        {
            "_id": ObjectId(execution_id)
        }
    )

    if execution:

        execution["_id"] = str(
            execution["_id"]
        )

    return execution


def delete_execution(
    execution_id: str
):

    executions_collection.delete_one(
        {
            "_id": ObjectId(execution_id)
        }
    )

def get_user_executions(
    user_id: str
):

    executions = list(
        executions_collection.find(
            {
                "user_id": user_id
            }
        )
    )

    for execution in executions:

        execution["_id"] = str(
            execution["_id"]
        )

    return executions