from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import sos, ambulance, hospital, triage, records

app = FastAPI(title="Niramaya API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sos.router, prefix="/api/sos", tags=["SOS"])
app.include_router(ambulance.router, prefix="/api/ambulance", tags=["Ambulance"])
app.include_router(hospital.router, prefix="/api/hospital", tags=["Hospital"])
app.include_router(triage.router, prefix="/api/triage", tags=["Triage"])
app.include_router(records.router, prefix="/api/records", tags=["Records"])

@app.get("/")
def root():
    return {"status": "Niramaya API is running"}
