import math
import httpx
import os

MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Returns distance in km between two coordinates."""
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = math.sin(d_lat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lng/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

async def find_nearest_available_ambulance(patient_lat: float, patient_lng: float, ambulances: list) -> dict | None:
    available = [a for a in ambulances if a.is_available]
    if not available:
        return None
    return min(available, key=lambda a: haversine_distance(patient_lat, patient_lng, a.latitude, a.longitude))

async def find_best_hospital(patient_lat: float, patient_lng: float, hospitals: list, severity: str) -> dict | None:
    active = [h for h in hospitals if h.is_active and h.available_beds > 0]
    if not active:
        return None
    if severity == "CRITICAL":
        icu_available = [h for h in active if h.icu_beds > 0]
        if icu_available:
            active = icu_available
    return min(active, key=lambda h: haversine_distance(patient_lat, patient_lng, h.latitude, h.longitude))

async def get_route(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float) -> dict:
    """Get route from Google Maps Directions API."""
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": f"{origin_lat},{origin_lng}",
        "destination": f"{dest_lat},{dest_lng}",
        "mode": "driving",
        "departure_time": "now",
        "traffic_model": "best_guess",
        "key": MAPS_API_KEY
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
    if data.get("routes"):
        route = data["routes"][0]
        leg = route["legs"][0]
        return {
            "distance_km": leg["distance"]["value"] / 1000,
            "duration_min": leg["duration_in_traffic"]["value"] // 60,
            "polyline": route["overview_polyline"]["points"],
            "steps": [s["html_instructions"] for s in leg["steps"]]
        }
    return {"distance_km": 0, "duration_min": 0, "polyline": "", "steps": []}
