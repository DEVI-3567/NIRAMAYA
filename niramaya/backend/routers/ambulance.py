from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.models import Ambulance

router = APIRouter()

class AmbulanceCreate(BaseModel):
    vehicle_number: str
    driver_name: str
    driver_phone: str
    latitude: float
    longitude: float
    hospital_id: int | None = None

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float

@router.post("/")
def create_ambulance(payload: AmbulanceCreate, db: Session = Depends(get_db)):
    amb = Ambulance(**payload.dict())
    db.add(amb)
    db.commit()
    db.refresh(amb)
    return amb

@router.get("/")
def list_ambulances(db: Session = Depends(get_db)):
    return db.query(Ambulance).all()

@router.get("/available")
def available_ambulances(db: Session = Depends(get_db)):
    return db.query(Ambulance).filter(Ambulance.is_available == True).all()

@router.patch("/{ambulance_id}/location")
def update_location(ambulance_id: int, payload: LocationUpdate, db: Session = Depends(get_db)):
    amb = db.query(Ambulance).filter(Ambulance.id == ambulance_id).first()
    if not amb:
        raise HTTPException(status_code=404, detail="Ambulance not found")
    amb.latitude = payload.latitude
    amb.longitude = payload.longitude
    db.commit()
    return {"id": ambulance_id, "lat": amb.latitude, "lng": amb.longitude}

@router.patch("/{ambulance_id}/free")
def free_ambulance(ambulance_id: int, db: Session = Depends(get_db)):
    amb = db.query(Ambulance).filter(Ambulance.id == ambulance_id).first()
    if not amb:
        raise HTTPException(status_code=404, detail="Ambulance not found")
    amb.is_available = True
    db.commit()
    return {"id": ambulance_id, "is_available": True}
