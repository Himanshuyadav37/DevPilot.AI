from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    GROQ_KEY_1: str
    GROQ_KEY_2: str
    GROQ_KEY_3: str

    MONGO_URL: str
    DB_NAME: str

    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 60

    CHROMA_HOST: str
    CHROMA_PORT: int

    @property
    def GROQ_KEYS(self) -> List[str]:
        return [
            self.GROQ_KEY_1,
            self.GROQ_KEY_2,
            self.GROQ_KEY_3
        ]

    model_config = {
        "env_file": BASE_DIR / ".env",
        "extra": "ignore"
    }

settings = Settings()



print("Loaded:", settings.DB_NAME)