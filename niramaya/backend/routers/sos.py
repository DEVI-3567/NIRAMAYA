from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.models import SOSRequest, Patient, Ambulance, Hospital, SOSStatus
from services.triage_service import analyze_symptoms
from services.routing_service import find_nearest_available_ambulance, find_best_hospital, get_route

router = APIRouter()

class SOSCreate(BaseModel):
    patient_id: int
    patient_lat: float
    patient_lng: float
    symptoms: str
    age: int = 30

class SOSUpdate(BaseModel):
    status: SOSStatus

@router.post("/trigger")
async def trigger_sos(payload: SOSCreate, db: Session = Depends(get_db)):
    # 1. AI Triage
    triage = await analyze_symptoms(payload.symptoms, payload.age)

    # 2. Find nearest ambulance
    ambulances = db.query(Ambulance).all()
    nearest_amb = await find_nearest_available_ambulance(payload.patient_lat, payload.patient_lng, ambulances)

    # 3. Find best hospital
    hospitals = db.query(Hospital).all()
    best_hospital = await find_best_hospital(payload.patient_lat, payload.patient_lng, hospitals, triage["severity"])

    # 4. Get route
    route = {}
    if nearest_amb and best_hospital:
        route = await get_route(nearest_amb.latitude, nearest_amb.longitude, payload.patient_lat, payload.patient_lng)

    # 5. Create SOS record
    sos = SOSRequest(
        patient_id=payload.patient_id,
        patient_lat=payload.patient_lat,
        patient_lng=payload.patient_lng,
        symptoms=payload.symptoms,
        severity=triage["severity"],
        triage_summary=triage["summary"],
        status=SOSStatus.DISPATCHED if nearest_amb else SOSStatus.PENDING,
        assigned_ambulance_id=nearest_amb.id if nearest_amb else None,
        assigned_hospital_id=best_hospital.id if best_hospital else None,
    )
    db.add(sos)

    # 6. Mark ambulance as unavailable
    if nearest_amb:
        nearest_amb.is_available = False

    db.commit()
    db.refresh(sos)

    return {
        "sos_id": sos.id,
        "status": sos.status,
        "triage": triage,
        "ambulance": {
            "id": nearest_amb.id,
            "vehicle_number": nearest_amb.vehicle_number,
            "driver_name": nearest_amb.driver_name,
            "driver_phone": nearest_amb.driver_phone,
            "lat": nearest_amb.latitude,
            "lng": nearest_amb.longitude,
        } if nearest_amb else None,
        "hospital": {
            "id": best_hospital.id,
            "name": best_hospital.name,
            "address": best_hospital.address,
            "lat": best_hospital.latitude,
            "lng": best_hospital.longitude,
            "available_beds": best_hospital.available_beds,
        } if best_hospital else None,
        "route": route,
    }

@router.get("/{sos_id}")
def get_sos(sos_id: int, db: Session = Depends(get_db)):
    sos = db.query(SOSRequest).filter(SOSRequest.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS request not found")
    return sos

@router.patch("/{sos_id}/status")
def update_sos_status(sos_id: int, payload: SOSUpdate, db: Session = Depends(get_db)):
    sos = db.query(SOSRequest).filter(SOSRequest.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS not found")
    sos.status = payload.status
    db.commit()
    return {"sos_id": sos_id, "status": sos.status}

@router.get("/")
def list_sos(db: Session = Depends(get_db)):
    return db.query(SOSRequest).order_by(SOSRequest.created_at.desc()).limit(50).all()
