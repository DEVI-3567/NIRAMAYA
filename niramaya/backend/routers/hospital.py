from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.models import Hospital

router = APIRouter()

class HospitalCreate(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    total_beds: int
    available_beds: int
    icu_beds: int
    phone: str
    specializations: str = ""

class BedUpdate(BaseModel):
    available_beds: int
    icu_beds: int

@router.post("/")
def create_hospital(payload: HospitalCreate, db: Session = Depends(get_db)):
    hospital = Hospital(**payload.dict())
    db.add(hospital)
    db.commit()
    db.refresh(hospital)
    return hospital

@router.get("/")
def list_hospitals(db: Session = Depends(get_db)):
    return db.query(Hospital).filter(Hospital.is_active == True).all()

@router.get("/{hospital_id}")
def get_hospital(hospital_id: int, db: Session = Depends(get_db)):
    h = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return h

@router.patch("/{hospital_id}/beds")
def update_beds(hospital_id: int, payload: BedUpdate, db: Session = Depends(get_db)):
    h = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    h.available_beds = payload.available_beds
    h.icu_beds = payload.icu_beds
    db.commit()
    return {"id": hospital_id, "available_beds": h.available_beds, "icu_beds": h.icu_beds}
