import chromadb
from backend.config import settings

_client = None
_collection = None

def get_collection():
    global _client, _collection
    if _collection is None:
        _client = chromadb.HttpClient(
            host=settings.CHROMA_HOST,
            port=settings.CHROMA_PORT
        )
        _collection = _client.get_or_create_collection(
            name="devpilot_kb",
            metadata={"hnsw:space": "cosine"}
        )
    return _collection