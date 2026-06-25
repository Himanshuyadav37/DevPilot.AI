from llm.groq_client import generate_response

from db.conversation_service import (
    create_conversation,
    add_message
)


def conversational_agent(
    prompt: str,
    conversation_id: str = None
):

    print("Prompt =", prompt)

    if not conversation_id:
        conversation_id = create_conversation(

            user_id="system",

            agent_type="conversational",

            title=prompt[:60]

        )

        print(
            "New Conversation Created:",
            conversation_id
        )

    add_message(
        conversation_id,
        "user",
        prompt
    )

    response = generate_response(
        f"""
You are NeuroForge Conversational AI.

Rules:

- Use markdown formatting.
- Use headings.
- Use bullet points.
- Keep answers clean.
- Use examples when useful.
- Never return one large paragraph.

User Question:

{prompt}
"""
    )

    add_message(
        conversation_id,
        "assistant",
        response
    )

    print(
        "Conversation ID:",
        conversation_id
    )

    print(
        "Response Generated Successfully"
    )

    return {

        "agent": "conversational",

        "conversation_id":
        conversation_id,

        "message":
        response

    }