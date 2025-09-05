from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status
import os
from dotenv import load_dotenv

load_dotenv()
ALGORITHM = "HS256"
SECRET_KEY = os.environ.get("SECRET_KEY_AUTH")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

fake_users_db = {
    "testuser": {
        "username": "testuser",
        "hashed_password": "$2b$12$KIXQ1h8fH6r5Z9e1Z5b8OeF6k1J8y7G9j",
        "disabled": False,
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    
class User(BaseModel):
    username: str
    disabled: Optional[bool] = None
    
class UserInDB(User):
    hashed_password: str
    
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(normal_password, hashed_password):
    return pwd_context.verify(normal_password,hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, username: str):
    pass

def authenticate_user(db, username: str, password: str):
    #Access the sqlite3 db (store the user's data in user)
    if not user:
        return False
    if not verify_password(password,user.hash_password):
        return False
    
    return user