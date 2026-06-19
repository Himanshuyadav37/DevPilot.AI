import re

INJECTION_PATTERNS = [
    r"ignore previous instructions",
    r"ignore all instructions",
    r"disregard",
    r"system prompt",
    r"you are now",
]

def sanitize_input(text: str) -> str:
    for pattern in INJECTION_PATTERNS:
        text = re.sub(pattern, "[FILTERED]", text, flags=re.IGNORECASE)
    return text.strip()[:2000]  # Max 2000 chars