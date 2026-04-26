from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.models import MedicalRecord

router = APIRouter()

class RecordCreate(BaseModel):
    sos_id: int
    patient_id: int
    hospital_id: int
    diagnosis: str
    treatment: str
    medications: str = ""
    doctor_notes: str = ""

@router.post("/")
def create_record(payload: RecordCreate, db: Session = Depends(get_db)):
    record = MedicalRecord(**payload.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/patient/{patient_id}")
def get_patient_records(patient_id: int, db: Session = Depends(get_db)):
    return db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).all()

@router.get("/")
def list_records(db: Session = Depends(get_db)):
    return db.query(MedicalRecord).order_by(MedicalRecord.created_at.desc()).limit(100).all()
