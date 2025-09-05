from fastapi import FastAPI, UploadFile, File, HTTPException, status
from pydantic import BaseModel
from contextlib import asynccontextmanager
import os
import tempfile
from rag.loader import load_user_documents, UnsupportedFileTypeError
from rag.vector_store import create_vectorstore, get_vectorstore
from rag.qa_chain import get_rag_chain
import whisper


WHISPER_MODEL = whisper.load_model("base")
# Define the lifespan context
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: initialize vector DB without pre-loading a specific file
    get_vectorstore()
    yield
    # Shutdown logic (optional): cleanup or close connections here

# Create FastAPI app with lifespan handler
app = FastAPI(lifespan=lifespan)

# Input model for file upload
class UploadFileResponse(BaseModel):
    message: str

# Endpoint for uploading and indexing documents
@app.post("/upload-document", response_model=UploadFileResponse)
async def upload_document(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        temp_file.write(await file.read())
        temp_file_path = temp_file.name

    try:
        # Load and process the document, with new error handling
        docs = load_user_documents(temp_file_path)
        create_vectorstore(docs)
    except UnsupportedFileTypeError as e:
        # Catch our custom exception and return a user-friendly 400 error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    finally:
        # Clean up the temporary file
        os.remove(temp_file_path)

    return {"message": f"Successfully uploaded and processed {file.filename}"}

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

@app.post("/transcribe-audio")
async def transcribe_audio(file:UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        temp_file.write(await file.read())
        audio_temp_file = temp_file.name
        
    transcription = WHISPER_MODEL.transcribe(audio_temp_file)
    transcribed_text = transcription["text"]
    
    os.remove(audio_temp_file)
    
    qa_result = query_rag(QueryInput(query=transcribed_text))
    
    return qa_result
    