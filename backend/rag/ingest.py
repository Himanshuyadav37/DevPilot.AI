from rag.chroma_manager import collection
from rag.embeddings import generate_embedding


def add_document(doc_id, text):

    collection.add(
        ids=[doc_id],
        documents=[text],
        embeddings=[
            generate_embedding(text)
        ]
    )