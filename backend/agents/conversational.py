from llm.groq_client import generate_response

from db.conversation_service import (
    create_conversation,
    add_message,
    get_conversation,
    get_conversation_messages,
    update_conversation_summary,
)

from memory.user_memory import format_user_context

SUMMARY_THRESHOLD = 8


def _build_history_context(conversation_id: str) -> tuple[str, str]:
    conversation = get_conversation(conversation_id)
    if not conversation:
        return "", ""

    summary = conversation.get("summary", "")
    messages = conversation.get("messages", [])

    recent = messages[-6:] if len(messages) > 6 else messages
    history_lines = [
        f"{m['role'].upper()}: {m['content']}" for m in recent
    ]
    history = "\n".join(history_lines) if history_lines else ""
    return summary, history


def _maybe_summarize(conversation_id: str):
    messages = get_conversation_messages(conversation_id)
    if len(messages) < SUMMARY_THRESHOLD:
        return

    conversation = get_conversation(conversation_id)
    existing_summary = conversation.get("summary", "")

    transcript = "\n".join(
        f"{m['role']}: {m['content'][:500]}" for m in messages[-20:]
    )

    summary = generate_response(
        f"""Summarize this conversation in 3-5 bullet points.
Keep key facts, decisions, and user preferences.

Previous summary:
{existing_summary or 'None'}

Recent messages:
{transcript}
"""
    )

    update_conversation_summary(conversation_id, summary)


def conversational_agent(
    prompt: str,
    conversation_id: str = None,
    user_id: str = "system",
):
    print("Prompt =", prompt)

    if not conversation_id:
        conversation_id = create_conversation(
            user_id=user_id,
            agent_type="conversational",
            title=prompt[:60],
        )
        print("New Conversation Created:", conversation_id)

    add_message(conversation_id, "user", prompt)

    summary, history = _build_history_context(conversation_id)
    user_context = format_user_context(user_id)

    context_parts = []
    if user_context:
        context_parts.append(user_context)
    if summary:
        context_parts.append(f"Conversation Summary:\n{summary}")
    if history:
        context_parts.append(f"Recent Messages:\n{history}")

    context_block = "\n\n".join(context_parts)

    response = generate_response(
        f"""
You are NeuroForge Conversational AI — a persistent assistant with memory.

Rules:
- Use markdown formatting.
- Use headings and bullet points.
- Keep answers clean and structured.
- Reference prior context when relevant.

{context_block}

User Question:
{prompt}
"""
    )

    add_message(conversation_id, "assistant", response)
    _maybe_summarize(conversation_id)

    print("Conversation ID:", conversation_id)
    print("Response Generated Successfully")

    return {
        "agent": "conversational",
        "conversation_id": conversation_id,
        "message": response,
    }
