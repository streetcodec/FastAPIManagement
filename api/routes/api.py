from fastapi import APIRouter, Depends, HTTPException, status, Header, Request, Security
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer, HTTPBearer
from datetime import timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from api.models import schemas
from api.core import crud, security
from api.core.database import get_db
from api.core.security import get_current_user, get_cached_token, clear_token_cache
from api.config import settings

router = APIRouter()

# Add these security schemes
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")
security_bearer = HTTPBearer()

@router.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # No authentication required
    db_user = await crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return await crud.create_user(db=db, user=user)

async def authenticate_user(db: Session, email: str, password: str):
    user = await crud.get_user_by_email(db, email=email)
    if not user:
        return False
    if not security.verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict):
    to_encode = data.copy()
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return security.create_access_token(data=to_encode, expires_delta=expires_delta)

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout", tags=["auth"])
async def logout():
    clear_token_cache()
    return {"message": "Successfully logged out"}

@router.post("/cars/", response_model=schemas.Car, tags=["cars"], 
            summary="Create a new car",
            responses={
                401: {"description": "Not authenticated"},
                400: {"description": "Bad request"}
            })
async def create_car(
    car: schemas.CarCreate,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new car with authentication required.
    
    - **Authorization**: Bearer token required
    - **title**: Car title
    - **description**: Car description
    - **images**: List of image URLs
    - **car_type**: Type of car
    - **company**: Car manufacturer
    - **dealer**: Car dealer
    - **tags**: List of tags
    """
    try:
        return await crud.create_car(db=db, car=car, owner_id=current_user.id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/cars/", response_model=List[schemas.Car])
async def get_cars(
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cars = await crud.get_cars(db, owner_id=current_user.id, search=search, skip=skip, limit=limit)
    return cars

@router.get("/cars/{car_id}", response_model=schemas.Car)
async def get_car(
    car_id: str,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        car = await crud.get_car(db, car_id=car_id)
        if car is None or car.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Car not found"
            )
        return car
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/cars/{car_id}", response_model=schemas.Car)
async def update_car(
    car_id: str,
    car: schemas.CarUpdate,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_car = await crud.get_car(db, car_id=car_id)
        if db_car is None or db_car.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Car not found"
            )
        updated_car = await crud.update_car(db=db, car_id=car_id, car=car)
        return updated_car
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/cars/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_car(
    car_id: str,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_car = await crud.get_car(db, car_id=car_id)
        if db_car is None or db_car.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Car not found"
            )
        await crud.delete_car(db=db, car_id=car_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 