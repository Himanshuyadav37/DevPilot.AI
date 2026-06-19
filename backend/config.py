from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    GROQ_KEY_1: str
    GROQ_KEY_2: str
    GROQ_KEY_3: str
    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "devpilot"
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 60
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8001

    @property
    def GROQ_KEYS(self) -> List[str]:
        return [self.GROQ_KEY_1, self.GROQ_KEY_2, self.GROQ_KEY_3]

    class Config:
        env_file = ".env"

settings = Settings()