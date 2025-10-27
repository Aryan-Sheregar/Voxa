from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from contextlib import asynccontextmanager
import os
import json
import tempfile
from rag.loader import load_user_documents, UnsupportedFileTypeError
from rag.vector_store import create_vectorstore, get_vectorstore
from rag.qa_chain import get_rag_chain
import whisper
from services.auth_service import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, Token
from services.auth_service import get_user, oauth2_scheme, AuthUser
from services.auth_service import get_password_hash, get_current_active_user
from database import create_db_and_tables, get_db, User as DBuser, VoiceSession, Task
from sqlmodel import Session, select
from datetime import timedelta, datetime
from fastapi import Depends
from typing import List


WHISPER_MODEL = whisper.load_model("base")
# Define the lifespan context


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: initialize vector DB without pre-loading a specific file
    create_db_and_tables()
    get_vectorstore()
    yield
    # Shutdown logic (optional): cleanup or close connections here

# Create FastAPI app with lifespan handler
app = FastAPI(lifespan=lifespan)

# Input model for file upload


class UploadFileResponse(BaseModel):
    message: str


class UserCreate(BaseModel):
    username: str
    password: str


@app.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    if get_user(db, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    hashed_password = get_password_hash(user.password)
    new_user = DBuser(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint for uploading and indexing documents


@app.post("/upload-document", response_model=UploadFileResponse)
async def upload_document(file: UploadFile = File(...), current_user: AuthUser = Depends(get_current_active_user)):
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
def query_rag(data: QueryInput, current_user: AuthUser = Depends(get_current_active_user)):
    vectorstore = get_vectorstore()
    qa = get_rag_chain(vectorstore)

    # Handle empty vector store
    if vectorstore._collection.count() == 0:
        return {
            "answer": "I couldn't find any past plans to reference. Try recording or saving a plan first.",
            "sources": []
        }

    # Run RetrievalQA chain
    result = qa.invoke(data.query)

    return {
        "answer": result["result"],
        "sources": [doc.metadata.get("source", "N/A") for doc in result["source_documents"]]
    }


@app.post("/transcribe-audio")
async def transcribe_audio(file: UploadFile = File(...), current_user: AuthUser = Depends(get_current_active_user), db: Session = Depends(get_db)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        temp_file.write(await file.read())
        audio_temp_file = temp_file.name

    transcription = WHISPER_MODEL.transcribe(audio_temp_file)
    transcribed_text = transcription["text"]

    os.remove(audio_temp_file)

    # Fix: Pass the actual query string, not the QueryInput object
    qa_result = query_rag(QueryInput(query=transcribed_text), current_user)
    raw_json_string = qa_result['answer']
    try:
        plan_data = json.loads(raw_json_string)
        validated_plan = PlanOutput(**plan_data)
    except (json.JSONDecodeError, TypeError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Returned a Non-JSON or invalid plan format from RAG model."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing the plan."
        )

    session_title = validated_plan.tasks[0].title if validated_plan.tasks else "Untitled Session"
    new_session = VoiceSession(
        title=session_title,
        transcript=transcribed_text,
        user_id=current_user.id
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    new_tasks = []
    for task_data in validated_plan.tasks:
        new_task = Task(
            title=task_data.title,
            description=task_data.description,
            priority=task_data.priority,
            time_estimate=task_data.time_estimate,
            session_id=new_session.id
        )
        new_tasks.append(new_task)
    db.add_all(new_tasks)
    db.commit()
    return validated_plan

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


class TaskOutput(BaseModel):
    title: str
    description: str | None
    priority: int
    time_estimate: str | None


class PlanOutput(BaseModel):
    tasks: list[TaskOutput]


class TaskRead(BaseModel):
    id: int
    title: str
    description: str | None
    priority: int
    time_estimate: str | None
    completed: bool

    class Config:
        from_attributes = True


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    priority: int | None = None
    time_estimate: str | None = None
    completed: bool | None = None


@app.get("/tasks", response_model=List[TaskRead])
def get_user_tasks(
    db: Session = Depends(get_db),
    current_user: DBuser = Depends(get_current_active_user)
):
    statement = (
        select(Task)
        .join(VoiceSession)
        .where(VoiceSession.user_id == current_user.id)
        .order_by(Task.created_at.desc())
    )

    tasks = db.exec(statement).all()
    return tasks

@app.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(
        task_id: int,
        task_update: TaskUpdate,
        db: Session = Depends(get_db),
        current_user: DBuser = Depends(get_current_active_user)):
    task_statement = (
        select(Task)
        .join(VoiceSession)
        .where(Task.id == task_id)
        .where(VoiceSession.user_id == current_user.id)
    )
    task = db.exec(task_statement).first()

    if not task:
        # Returns 404 if the task doesn't exist OR if it doesn't belong to the user
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or user unauthorized"
        )

    update_data = task_update.model_dump(exclude_unset=True)

    # Apply the updates using SQLModel's utility method
    task.sqlmodel_update(update_data)

    # 3. Save changes and refresh the object to get the latest data (e.g., modified_at timestamp)
    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: DBuser = Depends(get_current_active_user)
):
    # 1. Query the database for the task, joining with VoiceSession to check ownership
    # This ensures a user can only delete their own tasks.
    task_statement = (
        select(Task)
        .join(VoiceSession)
        .where(Task.id == task_id)
        .where(VoiceSession.user_id == current_user.id)
    )
    task = db.exec(task_statement).first()

    if not task:
        # Returns 404 if the task ID is invalid OR if it belongs to another user
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or user unauthorized to delete"
        )

    # 2. Delete the task and commit the transaction
    db.delete(task)
    db.commit()

    # 3. Return None to send an implicit HTTP 204 No Content response (Standard for successful deletion)
    return


class VoiceSessionRead(BaseModel):
    id: int
    title: str
    transcript: str
    timestamp: datetime
    
    class Config:
        from_attributes = True


@app.get("/history/sessions", response_model=List[VoiceSessionRead])
def get_history_sessions(
    db: Session = Depends(get_db),
    current_user: DBuser = Depends(get_current_active_user)
):
    # Retrieve all VoiceSession records owned by the current user
    statement = (
        select(VoiceSession)
        .where(VoiceSession.user_id == current_user.id)
        .order_by(VoiceSession.timestamp.desc())
    )

    sessions = db.exec(statement).all()
    return sessions
