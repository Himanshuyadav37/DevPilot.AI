from backend.rag.chroma_client import get_collection
from backend.rag.embeddings import embed

def retrieve(query: str, top_k: int = 5) -> str:
    collection = get_collection()
    query_embedding = embed(query)
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    
    docs = results.get("documents", [[]])[0]
    return "\n\n".join(docs) if docs else "No relevant context found."