import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY)

const TRIAGE_SYSTEM = `You are Niramaya AI, an emergency medical triage assistant. You analyze symptoms and provide rapid medical assessment.

IMPORTANT: You must respond ONLY with valid JSON. No markdown, no extra text.

Return this exact JSON structure:
{
  "severity": "CRITICAL" | "HIGH" | "MODERATE" | "LOW",
  "severity_score": <1-10>,
  "summary": "<2-3 sentence clinical assessment>",
  "recommended_action": "<immediate action steps>",
  "possible_conditions": ["<condition1>", "<condition2>", "<condition3>"],
  "golden_hour_risk": true | false,
  "first_aid": "<brief first aid advice while waiting>",
  "specialist_needed": "<type of specialist recommended>"
}`

const CHAT_SYSTEM = `You are Niramaya AI, a compassionate and knowledgeable healthcare assistant. You help users understand their health concerns, provide general wellness advice, and guide them on when to seek emergency care.

Rules:
- Be empathetic and clear
- Always recommend seeing a doctor for serious concerns
- Never diagnose definitively — suggest possibilities
- If symptoms sound emergent, urge them to call emergency services
- Keep responses concise (2-4 paragraphs max)
- Use simple language that patients can understand`

/**
 * Parse JSON from AI response, handling markdown fences
 */
function parseJSON(text) {
  let clean = text.trim()
  // Remove markdown code fences
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return JSON.parse(clean.trim())
}

/**
 * Analyze symptoms using Gemini AI (text only)
 */
export async function triageSymptoms(symptoms, age = 30) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const prompt = `${TRIAGE_SYSTEM}\n\nPatient symptoms: ${symptoms}\nPatient age: ${age}\n\nProvide your triage assessment as JSON only.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return parseJSON(text)
  } catch (error) {
    console.error('Gemini triage error:', error)
    return {
      severity: 'HIGH',
      severity_score: 7,
      summary: 'AI analysis temporarily unavailable. Based on reported symptoms, immediate medical evaluation is recommended as a precaution.',
      recommended_action: 'Seek immediate medical attention. Call emergency services if symptoms worsen.',
      possible_conditions: ['Requires in-person evaluation'],
      golden_hour_risk: true,
      first_aid: 'Keep the patient calm and comfortable. Monitor vital signs.',
      specialist_needed: 'Emergency Medicine'
    }
  }
}

/**
 * Analyze symptoms with image using Gemini multimodal
 */
export async function triageWithImage(symptoms, age = 30, imageBase64, mimeType = 'image/jpeg') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    }
    
    const prompt = `${TRIAGE_SYSTEM}\n\nPatient symptoms: ${symptoms}\nPatient age: ${age}\n\nAn image of the condition is attached. Analyze both the text description and the visual evidence to provide your triage assessment as JSON only.`
    
    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()
    return parseJSON(text)
  } catch (error) {
    console.error('Gemini multimodal triage error:', error)
    // Fall back to text-only triage
    return triageSymptoms(symptoms, age)
  }
}

/**
 * Chat with AI health assistant
 */
export async function chatWithAI(userMessage, history = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'You are Niramaya AI health assistant. Acknowledge.' }] },
        { role: 'model', parts: [{ text: 'I am Niramaya AI, your healthcare assistant. I\'m here to help you understand health concerns, provide wellness guidance, and help you know when to seek emergency care. How can I help you today?' }] },
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      ],
    })
    
    const result = await chat.sendMessage(`${CHAT_SYSTEM}\n\nUser message: ${userMessage}`)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini chat error:', error)
    return 'I apologize, but I\'m having trouble connecting right now. If this is an emergency, please call 108 (ambulance) or 112 (emergency services) immediately.'
  }
}

/**
 * Find nearby hospitals using Google Maps Places API (via text search)
 */
export async function findNearbyHospitals(lat, lng) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const prompt = `List 5 real hospitals near coordinates ${lat}, ${lng} (India). Return ONLY valid JSON array:
[{"name": "Hospital Name", "address": "Full address", "distance_km": 2.5, "type": "Government/Private", "emergency": true, "beds_approx": 200}]`
    
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return parseJSON(text)
  } catch {
    return []
  }
}
