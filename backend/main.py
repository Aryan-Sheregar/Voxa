from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager
from rag.loader import load_user_documents
from rag.vector_store import create_vectorstore, get_vectorstore
from rag.qa_chain import get_rag_chain

# Define the lifespan context
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: load user data and initialize vector DB
    docs = load_user_documents("data/user_notes.txt")
    create_vectorstore(docs)
    yield
    # Shutdown logic (optional): cleanup or close connections here

# Create FastAPI app with lifespan handler
app = FastAPI(lifespan=lifespan)

# Input model for query
class QueryInput(BaseModel):
    query: str

# RAG query endpoint
@app.post("/rag-query")
def query_rag(data: QueryInput):
    vectorstore = get_vectorstore()

    # Handle empty vector store
    if vectorstore._collection.count() == 0:
        return {
            "answer": "I couldn't find any past plans to reference. Try recording or saving a plan first.",
            "sources": []
        }

    # Run RetrievalQA chain
    qa = get_rag_chain()
    result = qa.invoke({"query": data.query})

    return {
        "answer": result["result"],
        "sources": [doc.metadata.get("source", "N/A") for doc in result["source_documents"]]
    }