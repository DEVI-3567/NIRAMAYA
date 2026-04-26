from fastapi import APIRouter
from pydantic import BaseModel
from services.triage_service import analyze_symptoms

router = APIRouter()

class TriageRequest(BaseModel):
    symptoms: str
    age: int = 30

@router.post("/analyze")
async def triage(payload: TriageRequest):
    result = await analyze_symptoms(payload.symptoms, payload.age)
    return result
