import os
from sqlmodel import SQLModel, create_engine, Session, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'db', 'voxa.db')}"

engine = create_engine(DATABASE_URL, echo=True)

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str
    disabled: bool | None = False


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    
def get_db():
    with Session(engine) as session:
        yield session

if __name__ == "__main__":
    create_db_and_tables()
    print("Database and tables created.")