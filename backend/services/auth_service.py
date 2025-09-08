from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status
import os
from dotenv import load_dotenv
from sqlmodel import Session, select
from database import User as DBUser 

load_dotenv()
ALGORITHM = "HS256"
SECRET_KEY = os.environ.get("SECRET_KEY_AUTH")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    
class AuthUser(BaseModel):
    username: str
    disabled: Optional[bool] = None
    
class UserInDB(AuthUser):
    hashed_password: str
    
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(normal_password, hashed_password):
    return pwd_context.verify(normal_password,hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db:Session, username: str):
    """
    Does: Queries the DB to get a user by username.
    """
    user = db.exec(select(DBUser).where(DBUser.username == username)).first()
    return user

def authenticate_user(db: Session, username: str, password: str):
    """
    Does: It verifies the username and password and return the user if the creds match.
    """
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password,user.hashed_password):
        return False
    
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Does: It creates a JWT token with an exp time
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends()):
    """
    Does: It decodes the JWT token to get the username and return the user from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: AuthUser = Depends(get_current_user)):
    """
    Does: It checks if the user is active or not.
    """
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user