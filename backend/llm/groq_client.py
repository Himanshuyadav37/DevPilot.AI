from groq import Groq
from config import settings

current_key_index = 0


def get_client():
    global current_key_index

    api_key = settings.GROQ_KEYS[current_key_index]

    return Groq(api_key=api_key)


def generate_response(prompt: str):

    global current_key_index

    for _ in range(len(settings.GROQ_KEYS)):

        try:

            client = get_client()

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            return response.choices[0].message.content

        except Exception as e:

            if "rate" in str(e).lower():

                current_key_index = (
                    current_key_index + 1
                ) % len(settings.GROQ_KEYS)

                continue

            raise e

    raise Exception(
        "All Groq API Keys Exhausted"
    )