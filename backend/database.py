import os
from sqlmodel import Relationship, SQLModel, create_engine, Session, Field
from datetime import datetime, timezone
from typing import Optional, List

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'db', 'voxa.db')}"

engine = create_engine(DATABASE_URL, echo=True)

class User(SQLModel, table=True):
    """User model for authentication and authorization."""

    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str
    disabled: bool | None = False

    # Relationships
    sessions: List["VoiceSession"] = Relationship(back_populates="user")


class VoiceSession(SQLModel, table=True):
    """Voice session model to store transcribed audio sessions."""

    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    transcript: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    user_id: int = Field(foreign_key="user.id", index=True)

    # Relationships
    user: "User" = Relationship(back_populates="sessions")
    tasks: List["Task"] = Relationship(back_populates="session")


class Task(SQLModel, table=True):
    """Task model for individual tasks within a voice session."""

    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    priority: int = Field(default=3)  # 1-5, where 1 is highest priority
    time_estimate: Optional[str] = None
    completed: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    session_id: int = Field(foreign_key="voicesession.id", index=True)

    # Relationships
    session: "VoiceSession" = Relationship(back_populates="tasks")

def create_db_and_tables():
    """Create database and all tables defined in SQLModel metadata."""
    SQLModel.metadata.create_all(engine)


def get_db():
    """Dependency function to get database session for FastAPI routes."""
    with Session(engine) as session:
        yield session

if __name__ == "__main__":
    create_db_and_tables()
    print("Database and tables created successfully.")
