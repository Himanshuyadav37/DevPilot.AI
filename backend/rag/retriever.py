from rag.chroma_manager import collection
from rag.embeddings import generate_embedding


def retrieve_context(query: str):

    embedding = generate_embedding(query)

    results = collection.query(
        query_embeddings=[embedding],
        n_results=3
    )

    return results

def get_context(query: str):

    results = retrieve_context(query)

    documents = results.get(
        "documents",
        [[]]
    )[0]

    return "\n".join(documents)