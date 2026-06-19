from groq import Groq
from backend.config import settings
import time

_current_key_index = 0

def get_client() -> Groq:
    global _current_key_index
    key = settings.GROQ_KEYS[_current_key_index % len(settings.GROQ_KEYS)]
    return Groq(api_key=key)

def invoke(prompt: str, system_prompt: str = "You are a helpful AI assistant.", model: str = "llama-3.1-8b-instant") -> str:
    global _current_key_index
    max_retries = len(settings.GROQ_KEYS)
    
    for attempt in range(max_retries):
        try:
            client = get_client()
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=4096
            )
            return response.choices[0].message.content
        except Exception as e:
            if "rate_limit" in str(e).lower():
                _current_key_index += 1
                time.sleep(1)
            else:
                raise e
    raise Exception("All Groq API keys exhausted")