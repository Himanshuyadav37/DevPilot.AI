from fastapi import APIRouter
from bson import ObjectId
from db.mongo_client import (
    conversations_collection
)
from db.conversation_service import (
    get_all_conversations,
    get_conversation_by_id
)

router = APIRouter()


@router.get("/")
def get_conversations():

    return get_all_conversations()


@router.get("/{conversation_id}")
def get_conversation(
    conversation_id: str
):

    return get_conversation_by_id(
        conversation_id
    )
@router.delete(
    "/{conversation_id}"
)
def delete_conversation(
    conversation_id: str
):

    conversations_collection.delete_one(
        {
            "_id": ObjectId(
                conversation_id
            )
        }
    )

    return {
        "message":
        "Conversation Deleted"
    }