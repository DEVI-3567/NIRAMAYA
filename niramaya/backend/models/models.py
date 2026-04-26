from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class SeverityLevel(str, enum.Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MODERATE = "MODERATE"
    LOW = "LOW"

class SOSStatus(str, enum.Enum):
    PENDING = "PENDING"
    DISPATCHED = "DISPATCHED"
    EN_ROUTE = "EN_ROUTE"
    ARRIVED = "ARRIVED"
    RESOLVED = "RESOLVED"

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    blood_group = Column(String)
    phone = Column(String)
    medical_history = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sos_requests = relationship("SOSRequest", back_populates="patient")

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    total_beds = Column(Integer, default=0)
    available_beds = Column(Integer, default=0)
    icu_beds = Column(Integer, default=0)
    phone = Column(String)
    specializations = Column(Text)  # comma-separated
    is_active = Column(Boolean, default=True)

class Ambulance(Base):
    __tablename__ = "ambulances"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_number = Column(String, unique=True)
    driver_name = Column(String)
    driver_phone = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    is_available = Column(Boolean, default=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=True)

class SOSRequest(Base):
    __tablename__ = "sos_requests"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    patient_lat = Column(Float)
    patient_lng = Column(Float)
    symptoms = Column(Text)
    severity = Column(Enum(SeverityLevel), default=SeverityLevel.MODERATE)
    triage_summary = Column(Text)
    status = Column(Enum(SOSStatus), default=SOSStatus.PENDING)
    assigned_ambulance_id = Column(Integer, ForeignKey("ambulances.id"), nullable=True)
    assigned_hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    patient = relationship("Patient", back_populates="sos_requests")

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(Integer, primary_key=True, index=True)
    sos_id = Column(Integer, ForeignKey("sos_requests.id"))
    patient_id = Column(Integer, ForeignKey("patients.id"))
    diagnosis = Column(Text)
    treatment = Column(Text)
    medications = Column(Text)
    doctor_notes = Column(Text)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
