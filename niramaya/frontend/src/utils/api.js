import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})

export const triggerSOS = (data) => api.post('/api/sos/trigger', data)
export const getSOSStatus = (id) => api.get(`/api/sos/${id}`)
export const updateSOSStatus = (id, status) => api.patch(`/api/sos/${id}/status`, { status })

export const getHospitals = () => api.get('/api/hospital/')
export const getAmbulances = () => api.get('/api/ambulance/')
export const updateAmbulanceLocation = (id, lat, lng) =>
  api.patch(`/api/ambulance/${id}/location`, { latitude: lat, longitude: lng })

export const analyzeTriage = (symptoms, age) =>
  api.post('/api/triage/analyze', { symptoms, age })

export const getPatientRecords = (patientId) =>
  api.get(`/api/records/patient/${patientId}`)

export default api
