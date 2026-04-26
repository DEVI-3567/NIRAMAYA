import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGoogleMap } from '../hooks/useGoogleMap'
import AppLayout from '../components/AppLayout'
import { Navigation, Clock, CheckCircle, MapPin, Phone, AlertTriangle } from 'lucide-react'

const STEPS = ['PENDING', 'DISPATCHED', 'EN_ROUTE', 'ARRIVED', 'RESOLVED']
const STEP_LABELS = { PENDING: 'Locating nearest unit', DISPATCHED: 'Ambulance dispatched', EN_ROUTE: 'En route to patient', ARRIVED: 'Ambulance on scene', RESOLVED: 'Case resolved' }
const STEP_ICONS = { PENDING: '🔍', DISPATCHED: '🚑', EN_ROUTE: '🛣️', ARRIVED: '📍', RESOLVED: '✅' }

export default function TrackingPage() {
  const { sosId } = useParams()
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const { loaded, addMarker, fitBounds } = useGoogleMap(mapRef, { zoom: 14 })
  const [currentStep, setCurrentStep] = useState(1)

  // Simulate ambulance location
  const patientPos = { lat: 20.2961, lng: 85.8245 }
  const ambulancePos = { lat: 20.3050, lng: 85.8150 }
  const hospitalPos = { lat: 20.2890, lng: 85.8340 }

  useEffect(() => {
    if (!loaded) return
    addMarker(patientPos, 'P', '#f43f5e', 'Patient Location')
    addMarker(ambulancePos, '🚑', '#34d399', 'Ambulance')
    addMarker(hospitalPos, 'H', '#38bdf8', 'Hospital')
    fitBounds([patientPos, ambulancePos, hospitalPos])
  }, [loaded])

  // Auto-advance steps for demo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => prev < 4 ? prev + 1 : prev)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <AppLayout title={`Live Tracking — ${sosId || 'SOS'}`}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', height: 'calc(100vh - 130px)' }}>
        {/* Map */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: 400 }} />
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.45rem 0.95rem', borderRadius: '999px', backdropFilter: 'blur(12px)' }}>
            <span className="status-dot dot-green" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--emerald)', fontWeight: 600 }}>LIVE TRACKING</span>
          </div>
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
            {[
              { label: 'Patient', color: '#f43f5e' },
              { label: 'Ambulance', color: '#34d399' },
              { label: 'Hospital', color: '#38bdf8' },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(8,12,22,0.85)', padding: '0.3rem 0.6rem', borderRadius: 6, fontSize: '0.68rem', color: 'var(--text-muted)', backdropFilter: 'blur(8px)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          {/* Status Timeline */}
          <div className="card">
            <div className="card-header"><span className="card-title">Dispatch Status</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)',
                  background: i === currentStep ? 'var(--emerald-dim)' : 'transparent',
                  border: i === currentStep ? '1px solid rgba(52,211,153,0.15)' : '1px solid transparent',
                  transition: 'all 0.3s',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: i < currentStep ? 'var(--emerald)' : i === currentStep ? 'var(--emerald)' : 'var(--bg-elevated)',
                    border: `2px solid ${i <= currentStep ? 'var(--emerald)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, transition: 'all 0.3s',
                    boxShadow: i === currentStep ? '0 0 12px rgba(52,211,153,0.3)' : 'none',
                  }}>
                    {i < currentStep ? <CheckCircle size={12} color="#052e16" /> : i === currentStep ? <span style={{ fontSize: 11 }}>{STEP_ICONS[s]}</span> : null}
                  </div>
                  <span style={{
                    fontSize: '0.8rem',
                    color: i === currentStep ? 'var(--emerald)' : i < currentStep ? 'var(--text-dim)' : 'var(--text-muted)',
                    fontWeight: i === currentStep ? 600 : 400,
                  }}>{STEP_LABELS[s]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Case Info */}
          <div className="card">
            <div className="card-header"><span className="card-title">Case Details</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { label: 'SOS ID', value: sosId || 'SOS-0001' },
                { label: 'Severity', value: <span className="badge badge-high">HIGH</span> },
                { label: 'Status', value: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald)', fontSize: '0.78rem' }}>{STEPS[currentStep]}</span> },
                { label: 'Dispatched', value: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date().toLocaleTimeString()}</span> },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</span>
                  {typeof value === 'string' ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{value}</span> : value}
                </div>
              ))}
            </div>
          </div>

          {/* Ambulance Info */}
          <div className="card" style={{ borderColor: 'rgba(52,211,153,0.15)' }}>
            <div className="card-header"><span className="card-title">🚑 Ambulance Unit</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>OD-02-AB-1234</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Driver: Ramesh Kumar</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald)', fontSize: '0.82rem' }}>
                <Phone size={13} /> 9876543210
              </div>
            </div>
          </div>

          {/* ETA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem', background: 'var(--amber-dim)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 'var(--radius-sm)' }}>
            <Clock size={15} color="var(--amber)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--amber)', fontWeight: 600 }}>ETA: ~{currentStep >= 3 ? 1 : 5 - currentStep} min</span>
          </div>

          <button className="btn btn-ghost btn-full" onClick={() => navigate('/patient/dashboard')}>
            <Navigation size={14} /> Back to Dashboard
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
