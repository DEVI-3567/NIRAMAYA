import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Heart, AlertCircle, Clock, FileText, LogOut, MapPin, Activity, ChevronRight, Phone, Brain, Send, ImagePlus, X } from 'lucide-react'
import { triageSymptoms, triageWithImage, chatWithAI } from '../../utils/gemini'
import { useGoogleMap } from '../../hooks/useGoogleMap'

const MOCK_HISTORY = [
  { id: 'SOS-001', date: '2025-04-18', severity: 'HIGH', status: 'RESOLVED', hospital: 'AIIMS Bhubaneswar', eta: '8 min' },
  { id: 'SOS-002', date: '2025-03-02', severity: 'MODERATE', status: 'RESOLVED', hospital: 'SCB Medical', eta: '12 min' },
]

export default function PatientDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sosStep, setSosStep] = useState('idle')
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [location, setLocation] = useState(null)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const fileRef = useRef(null)
  const chatEndRef = useRef(null)
  const mapRef = useRef(null)
  const { loaded, addMarker, searchNearbyHospitals } = useGoogleMap(mapRef, { zoom: 13 })
  const [nearbyHospitals, setNearbyHospitals] = useState([])

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => setLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setLocation({ lat: 20.2961, lng: 85.8245 })
    )
  }, [])

  useEffect(() => {
    if (!loaded || !location) return
    addMarker(location, '📍', '#f43f5e', 'Your Location')
    searchNearbyHospitals(location).then(hospitals => {
      setNearbyHospitals(hospitals)
      hospitals.forEach(h => addMarker({ lat: h.lat, lng: h.lng }, 'H', '#38bdf8', h.name))
    })
  }, [loaded, location])

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = () => setImage({ base64: reader.result.split(',')[1], mimeType: file.type })
    reader.readAsDataURL(file)
  }

  const handleSOS = async () => {
    if (!symptoms) return
    setSosStep('loading')
    try {
      const triage = image
        ? await triageWithImage(symptoms, 28, image.base64, image.mimeType)
        : await triageSymptoms(symptoms, 28)
      setResult({
        sos_id: `SOS-${Date.now().toString().slice(-4)}`, triage,
        ambulance: { vehicle_number: 'OD-02-AB-1234', driver_name: 'Ramesh Kumar', driver_phone: '9876543210' },
        hospital: { name: 'AIIMS Bhubaneswar', available_beds: 45 },
        route: { duration_min: triage.severity === 'CRITICAL' ? 5 : 8 }
      })
      setSosStep('done')
    } catch {
      setResult({
        sos_id: 'SOS-DEMO', triage: { severity: 'HIGH', summary: 'Immediate attention recommended.', golden_hour_risk: true },
        ambulance: { vehicle_number: 'OD-02-AB-1234', driver_name: 'Ramesh Kumar', driver_phone: '9876543210' },
        hospital: { name: 'AIIMS Bhubaneswar', available_beds: 45 },
        route: { duration_min: 7 }
      })
      setSosStep('done')
    }
  }

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const msg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', text: msg }])
    setChatLoading(true)
    try {
      const response = await chatWithAI(msg, chatMessages)
      setChatMessages(prev => [...prev, { role: 'ai', text: response }])
    } catch {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Call 108 if urgent.' }])
    }
    setChatLoading(false)
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const navItems = [
    { icon: Heart, label: 'My Health' },
    { icon: AlertCircle, label: 'Emergency SOS' },
    { icon: Clock, label: 'SOS History' },
    { icon: FileText, label: 'My Records' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="sidebar-logo-icon">🏥</div>
          <div className="sidebar-logo-text">NIRA<span>MAYA</span></div>
        </div>
        <div style={{ padding: '0 1.25rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, var(--rose-dim), rgba(244,63,94,0.2))', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--rose)' }}>
              {(user?.name || 'P')[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{user?.name || 'Patient'}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--rose)', fontFamily: 'var(--font-mono)' }}>PATIENT</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ icon: Icon, label }) => (
            <button key={label} className="nav-item">
              <Icon size={15} />{label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-ghost btn-full" onClick={() => { logout(); navigate('/') }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      <div style={{ marginLeft: 240, flex: 1 }}>
        <header className="topbar">
          <span className="topbar-title">Patient Dashboard</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={12} color={location ? 'var(--emerald)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.7rem', color: location ? 'var(--emerald)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{location ? 'GPS Active' : 'Locating...'}</span>
          </div>
        </header>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} className="fade-up">
            <div className="card" style={{ background: 'linear-gradient(135deg, var(--rose-dim), rgba(244,63,94,0.03))', borderColor: 'rgba(244,63,94,0.15)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--rose)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Welcome back</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user?.name || 'Patient'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Blood: A+ · Age: 28</div>
            </div>
            {[
              { label: 'Total SOS', value: '2', color: 'var(--rose)' },
              { label: 'Avg Response', value: '10m', color: 'var(--amber)' },
              { label: 'Records', value: '4', color: 'var(--emerald)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card">
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>{label}</div>
                <div className="stat-value" style={{ color, fontSize: '1.8rem' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* SOS Panel */}
            <div className="card fade-up-2">
              <div className="card-header">
                <span className="card-title">🚨 Emergency SOS</span>
                {location && <span style={{ fontSize: '0.68rem', color: 'var(--emerald)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}><span className="status-dot dot-green" /> GPS</span>}
              </div>

              {sosStep === 'idle' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1rem 0' }}>
                  <div className="sos-btn-wrap" style={{ width: 120, height: 120 }}>
                    <div className="sos-ring" /><div className="sos-ring" /><div className="sos-ring" />
                    <button className="sos-btn" style={{ width: 120, height: 120, fontSize: '1.1rem' }} onClick={() => setSosStep('form')}>SOS</button>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>Tap to trigger emergency — Gemini AI triage</p>
                </div>
              )}

              {sosStep === 'form' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div><label>Describe emergency</label><textarea rows={3} placeholder="e.g. Severe chest pain..." value={symptoms} onChange={e => setSymptoms(e.target.value)} /></div>
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                    {imagePreview ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--emerald-dim)', borderRadius: 8, border: '1px solid rgba(52,211,153,0.15)' }}>
                        <img src={imagePreview} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--emerald)', flex: 1 }}>Image attached</span>
                        <button onClick={() => { setImage(null); setImagePreview(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                      </div>
                    ) : (
                      <button className="btn btn-ghost btn-full" onClick={() => fileRef.current?.click()} style={{ fontSize: '0.78rem' }}>
                        <ImagePlus size={14} /> Attach Photo
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-red btn-full" onClick={handleSOS} disabled={!symptoms}><Activity size={14} /> Dispatch</button>
                    <button className="btn btn-ghost" onClick={() => setSosStep('idle')}>Cancel</button>
                  </div>
                </div>
              )}

              {sosStep === 'loading' && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Activity size={32} color="var(--emerald)" className="spin" style={{ marginBottom: '0.75rem' }} />
                  <div>Gemini AI Triage in progress...</div>
                </div>
              )}

              {sosStep === 'done' && result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.875rem', background: 'var(--emerald-dim)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 8 }}>
                    <span style={{ fontWeight: 600, color: 'var(--emerald)', fontSize: '0.83rem' }}>✓ Help dispatched!</span>
                    <span className={`badge badge-${result.triage?.severity?.toLowerCase()}`}>{result.triage?.severity}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{result.triage?.summary}</p>
                  {result.ambulance && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>🚑 {result.ambulance.vehicle_number}</span>
                      <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>ETA ~{result.route?.duration_min}m</span>
                    </div>
                  )}
                  <button className="btn btn-green btn-full" onClick={() => navigate(`/track/${result.sos_id}`)}>
                    Track Live <ChevronRight size={13} />
                  </button>
                  <button className="btn btn-ghost btn-full" onClick={() => { setSosStep('idle'); setResult(null); setSymptoms(''); setImage(null); setImagePreview(null) }}>New SOS</button>
                </div>
              )}
            </div>

            {/* AI Health Chat */}
            <div className="card fade-up-3" style={{ display: 'flex', flexDirection: 'column', minHeight: 340 }}>
              <div className="card-header">
                <span className="card-title"><Brain size={12} style={{ display: 'inline', marginRight: 5 }} />AI Health Chat</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>Gemini</span>
              </div>
              <div className="chat-container" style={{ flex: 1 }}>
                {chatMessages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>
                    <Brain size={28} style={{ marginBottom: '0.5rem', opacity: 0.3 }} />
                    <div style={{ fontSize: '0.82rem' }}>Ask me about your health</div>
                    <div style={{ fontSize: '0.72rem', marginTop: 4 }}>Powered by Gemini AI</div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.role}`}>
                    {msg.role === 'ai' && <div style={{ fontSize: '0.65rem', color: 'var(--emerald)', fontWeight: 600, marginBottom: 2, fontFamily: 'var(--font-mono)' }}>AI</div>}
                    {msg.text}
                  </div>
                ))}
                {chatLoading && <div className="typing-indicator"><span /><span /><span /></div>}
                <div ref={chatEndRef} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border)' }}>
                <input placeholder="Ask a health question..." value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  style={{ flex: 1, fontSize: '0.83rem' }} />
                <button className="btn btn-green" onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ padding: '0.5rem 0.75rem' }}>
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Nearby Hospitals Map + History */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
            <div className="card fade-up-4" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <span className="card-title"><MapPin size={12} style={{ display: 'inline', marginRight: 5 }} />Nearby Hospitals</span>
              </div>
              <div ref={mapRef} style={{ width: '100%', height: 260 }} />
              {nearbyHospitals.length > 0 && (
                <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border)', maxHeight: 120, overflowY: 'auto' }}>
                  {nearbyHospitals.slice(0, 3).map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{h.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{h.address}</div>
                      </div>
                      {h.rating && <span style={{ fontSize: '0.72rem', color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>⭐ {h.rating}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card fade-up-4">
              <div className="card-header"><span className="card-title">SOS History</span></div>
              {MOCK_HISTORY.map((h, i) => (
                <div key={h.id} style={{ padding: '0.75rem 0', borderBottom: i < MOCK_HISTORY.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>{h.id}</span>
                    <span className={`badge badge-${h.severity.toLowerCase()}`}>{h.severity}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{h.hospital}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>{h.date} · Response: {h.eta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
