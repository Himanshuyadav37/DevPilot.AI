import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from backend.rag.chroma_client import get_collection
from backend.rag.embeddings import embed

def ingest_directory(directory: str):
    collection = get_collection()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if os.path.isfile(filepath):
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            chunks = splitter.split_text(content)
            
            for i, chunk in enumerate(chunks):
                doc_id = f"{filename}_chunk_{i}"
                embedding = embed(chunk)
                collection.add(
                    ids=[doc_id],
                    embeddings=[embedding],
                    documents=[chunk],
                    metadatas=[{"source": filename, "chunk": i}]
                )
            print(f"[Ingestion] Ingested {len(chunks)} chunks from {filename}")

if __name__ == "__main__":
    ingest_directory("rag_data/docs")
    ingest_directory("rag_data/templates")
    print("Ingestion complete!")