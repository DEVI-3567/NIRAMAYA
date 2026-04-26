import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Loader, AlertTriangle, Activity, ChevronRight, User, Stethoscope, ImagePlus, X, Phone } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { triageSymptoms, triageWithImage } from '../utils/gemini'

const DEMO_HOSPITALS = [
  { name: 'AIIMS Bhubaneswar', address: 'Sijua, Bhubaneswar', beds: 45, distance: '3.2 km' },
  { name: 'SCB Medical College', address: 'Mangalabag, Cuttack', beds: 32, distance: '8.1 km' },
  { name: 'KIMS Hospital', address: 'KIIT Road, Bhubaneswar', beds: 67, distance: '5.5 km' },
]

export default function SOSPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('form')
  const [location, setLocation] = useState(null)
  const [form, setForm] = useState({ name: '', age: '', symptoms: '' })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ lat: 20.2961, lng: 85.8245 })
    )
  }, [])

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = () => setImage({ base64: reader.result.split(',')[1], mimeType: file.type })
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.symptoms) { setError('Please fill in your name and describe symptoms.'); return }
    setError(''); setStep('loading')
    try {
      const triage = image
        ? await triageWithImage(form.symptoms, parseInt(form.age) || 30, image.base64, image.mimeType)
        : await triageSymptoms(form.symptoms, parseInt(form.age) || 30)

      const hospital = DEMO_HOSPITALS[triage.severity === 'CRITICAL' ? 0 : triage.severity === 'HIGH' ? 0 : 1]
      setResult({
        sos_id: `SOS-${Date.now().toString().slice(-4)}`,
        triage,
        ambulance: { vehicle_number: 'OD-02-AB-1234', driver_name: 'Ramesh Kumar', driver_phone: '9876543210' },
        hospital: { name: hospital.name, address: hospital.address, available_beds: hospital.beds },
        route: { duration_min: triage.severity === 'CRITICAL' ? 5 : 8 }
      })
      setStep('done')
    } catch {
      setError('Failed to process. Call 108 immediately.')
      setStep('form')
    }
  }

  return (
    <AppLayout title="Emergency SOS">
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {step === 'form' && (
          <div className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--rose-dim)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius)', padding: '0.9rem 1.25rem', marginBottom: '1.5rem' }}>
              <span className="status-dot dot-red" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--rose)' }}>EMERGENCY MODE — Gemini AI will triage instantly on submission</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="card">
                <div className="card-header">
                  <span className="card-title"><User size={12} style={{ display: 'inline', marginRight: 5 }} />Patient Information</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><label>Full Name</label><input placeholder="Patient's full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                  <div><label>Age</label><input type="number" placeholder="Age in years" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} /></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.875rem', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <MapPin size={14} color={location ? 'var(--emerald)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '0.82rem', color: location ? 'var(--emerald)' : 'var(--text-muted)' }}>
                      {location ? `GPS locked (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : 'Acquiring GPS...'}
                    </span>
                  </div>
                  {/* Image upload */}
                  <div>
                    <label>Photo of Condition (Optional)</label>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                    {imagePreview ? (
                      <div className="image-dropzone has-image" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={imagePreview} alt="Upload" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />
                        <div style={{ flex: 1, fontSize: '0.78rem', color: 'var(--emerald)' }}>Image attached for AI analysis ✓</div>
                        <button onClick={() => { setImage(null); setImagePreview(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={14} /></button>
                      </div>
                    ) : (
                      <div className="image-dropzone" onClick={() => fileRef.current?.click()} style={{ padding: '1rem' }}>
                        <ImagePlus size={18} color="var(--text-muted)" />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Upload photo for Gemini AI analysis</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title"><Stethoscope size={12} style={{ display: 'inline', marginRight: 5 }} />Describe Emergency</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>Gemini AI</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label>Symptoms / Situation</label>
                    <textarea rows={5} placeholder="e.g. Severe chest pain radiating to left arm, difficulty breathing, sweating for 10 minutes..." value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6, padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    💡 <strong style={{ color: 'var(--text-dim)' }}>Tip:</strong> Be specific — mention location of pain, duration, and any known conditions. Gemini AI will assess severity.
                  </div>
                  {error && (
                    <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--rose)', fontSize: '0.82rem', background: 'var(--rose-dim)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />{error}
                    </div>
                  )}
                  <button className="btn btn-red btn-full" onClick={handleSubmit} style={{ padding: '0.8rem', fontSize: '0.88rem' }}>
                    <Activity size={15} /> DISPATCH EMERGENCY RESPONSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="fade-up card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1.5rem' }}>
            <Loader size={44} color="var(--emerald)" className="spin" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.5rem' }}>Gemini AI Triage in progress...</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analyzing symptoms · Finding nearest unit · Calculating route</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Triage', 'Dispatch', 'Route'].map((s, i) => (
                <div key={s} style={{ padding: '0.35rem 0.85rem', background: 'var(--emerald-dim)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '999px', fontSize: '0.7rem', color: 'var(--emerald)', fontFamily: 'var(--font-mono)', animation: `pulse-dot ${0.8 + i * 0.3}s infinite` }}>{s}</div>
              ))}
            </div>
          </div>
        )}

        {step === 'done' && result && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'var(--emerald-dim)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="status-dot dot-green" />
                <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>Help dispatched — {result.sos_id}</span>
              </div>
              <button className="btn btn-green" onClick={() => navigate(`/track/${result.sos_id}`)}>
                Track Live <ChevronRight size={13} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">AI Assessment</span>
                  <span className={`badge badge-${result.triage?.severity?.toLowerCase()}`}>{result.triage?.severity}</span>
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-dim)', lineHeight: 1.65, marginBottom: '0.75rem' }}>{result.triage?.summary}</p>
                {result.triage?.first_aid && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--sky)', background: 'var(--sky-dim)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                    💊 {result.triage.first_aid}
                  </div>
                )}
                {result.triage?.golden_hour_risk && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--rose)', background: 'var(--rose-dim)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)' }}>⚠ GOLDEN HOUR RISK</div>
                )}
              </div>

              <div className="card">
                <div className="card-header"><span className="card-title">🚑 Ambulance</span></div>
                {result.ambulance ? <>
                  <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{result.ambulance.vehicle_number}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: '0.5rem' }}>{result.ambulance.driver_name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald)', fontSize: '0.83rem', marginBottom: '0.75rem' }}>
                    <Phone size={13} /> {result.ambulance.driver_phone}
                  </div>
                  {result.route?.duration_min && <div style={{ background: 'var(--amber-dim)', border: '1px solid rgba(251,191,36,0.15)', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>ETA: ~{result.route.duration_min} min</div>}
                </> : <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>Searching for available unit...</div>}
              </div>

              <div className="card">
                <div className="card-header"><span className="card-title">🏥 Hospital</span></div>
                {result.hospital ? <>
                  <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{result.hospital.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{result.hospital.address}</div>
                  <span className="badge badge-active">{result.hospital.available_beds} beds available</span>
                </> : <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>Finding hospital...</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
