import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv("GEMMA_API_KEY"))

TRIAGE_PROMPT = """You are an emergency medical triage AI. Analyze the patient's symptoms and return ONLY a JSON response with no extra text.

Patient symptoms: {symptoms}
Patient age: {age}

Return this exact JSON:
{{
  "severity": "CRITICAL|HIGH|MODERATE|LOW",
  "severity_score": <1-10>,
  "summary": "<2-3 sentence clinical summary>",
  "recommended_action": "<immediate action required>",
  "possible_conditions": ["<condition1>", "<condition2>"],
  "golden_hour_risk": true|false
}}
"""

async def analyze_symptoms(symptoms: str, age: int = 30) -> dict:
    try:
        model = genai.GenerativeModel("gemma-3-27b-it")
        prompt = TRIAGE_PROMPT.format(symptoms=symptoms, age=age)
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Strip markdown fences if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except Exception as e:
        # Fallback triage if API fails
        return {
            "severity": "HIGH",
            "severity_score": 7,
            "summary": "Unable to complete AI triage. Manual assessment required.",
            "recommended_action": "Dispatch ambulance immediately pending manual review.",
            "possible_conditions": ["Unknown"],
            "golden_hour_risk": True
        }
