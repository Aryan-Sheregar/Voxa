import os
from sqlmodel import Relationship, SQLModel, create_engine, Session, Field
from datetime import datetime, timezone
from typing import Optional, List

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'db', 'voxa.db')}"

engine = create_engine(DATABASE_URL, echo=True)


class VoiceSession(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    transcript: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))
    user_id: int = Field(foreign_key="user.id", index=True)

    user: "User" = Relationship(back_populates="sessions")
    tasks: List["Task"] = Relationship(back_populates="session")


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str
    disabled: bool | None = False

    sessions: List[VoiceSession] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    priority: int = Field(default=3)
    time_estimate: Optional[str] = None
    completed: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Foreign Key to link task to a voice session
    session_id: int = Field(foreign_key="voicesession.id", index=True)

    # Relationship back to VoiceSession
    session: "VoiceSession" = Relationship(back_populates="tasks")


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_db():
    with Session(engine) as session:
        yield session


if __name__ == "__main__":
    create_db_and_tables()
    print("Database and tables created.")
