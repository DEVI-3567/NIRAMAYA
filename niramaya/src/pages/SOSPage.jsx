import React, { useState } from 'react'
import { AlertTriangle, Phone, MapPin, CheckCircle, Loader, ArrowRight } from 'lucide-react'

const STAGES = ['idle', 'locating', 'triaging', 'dispatching', 'confirmed']

const MOCK_TRIAGE = {
  severity: 'CRITICAL',
  score: 1,
  summary: 'Possible cardiac event detected. Immediate intervention required.',
  action: 'Nearest cardiac-equipped hospital alerted. Ambulance dispatched.',
}

export default function SOSPage() {
  const [stage, setStage] = useState('idle')
  const [symptoms, setSymptoms] = useState('')
  const [ambulanceETA, setAmbulanceETA] = useState(null)

  const handleSOS = async () => {
    setStage('locating')
    await delay(1500)
    setStage('triaging')
    await delay(2000)
    setStage('dispatching')
    await delay(1500)
    setAmbulanceETA(Math.floor(Math.random() * 5) + 4)
    setStage('confirmed')
  }

  const reset = () => { setStage('idle'); setSymptoms(''); setAmbulanceETA(null) }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '100px 1.5rem 4rem',
      position: 'relative',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(255,59,59,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '520px' }}>

        {stage === 'idle' && (
          <div className="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '20px',
                background: 'rgba(255,59,59,0.12)',
                border: '1px solid rgba(255,59,59,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <AlertTriangle size={32} color="var(--clr-red)" />
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                Emergency SOS
              </h1>
              <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>
                Describe your symptoms and tap SOS. We handle everything else.
              </p>
            </div>

            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Describe what's happening
              </label>
              <textarea
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="e.g. Chest tightness, difficulty breathing, sweating heavily..."
                rows={4}
                style={{
                  width: '100%', background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--clr-text)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  lineHeight: 1.6, resize: 'none',
                }}
              />
            </div>

            {/* SOS Button */}
            <button
              onClick={handleSOS}
              className="pulse-red"
              style={{
                width: '100%', padding: '18px',
                background: 'var(--clr-red)', color: 'white', border: 'none',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: '1.1rem', letterSpacing: '0.05em',
                boxShadow: '0 0 40px rgba(255,59,59,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <AlertTriangle size={20} /> SEND SOS NOW
            </button>

            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>
              Your location will be captured automatically
            </p>
          </div>
        )}

        {['locating', 'triaging', 'dispatching'].includes(stage) && (
          <div className="fade-up" style={{ textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: '50%',
              border: '3px solid var(--clr-red)',
              borderTopColor: 'transparent',
              margin: '0 auto 2rem',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {stage === 'locating' && '📍 Capturing your location...'}
              {stage === 'triaging' && '🧠 AI is triaging your case...'}
              {stage === 'dispatching' && '🚑 Dispatching ambulance...'}
            </h2>
            <p style={{ color: 'var(--clr-text-muted)' }}>
              {stage === 'locating' && 'Getting GPS coordinates'}
              {stage === 'triaging' && 'Analyzing symptoms with Gemini AI'}
              {stage === 'dispatching' && 'Alerting nearest available unit'}
            </p>

            {/* Progress steps */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
              {['locating', 'triaging', 'dispatching'].map((s, i) => (
                <div key={i} style={{
                  height: 4, width: 48, borderRadius: '99px',
                  background: ['locating', 'triaging', 'dispatching'].indexOf(stage) >= i
                    ? 'var(--clr-red)' : 'var(--clr-border)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          </div>
        )}

        {stage === 'confirmed' && (
          <div className="fade-up">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(0,229,122,0.12)',
                border: '1px solid rgba(0,229,122,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.2rem',
              }}>
                <CheckCircle size={34} color="var(--clr-green)" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: '0.3rem' }}>
                Help is on the way
              </h2>
              <p style={{ color: 'var(--clr-text-muted)' }}>Stay calm. Keep this screen open.</p>
            </div>

            {/* ETA Card */}
            <div style={{
              background: 'rgba(0,229,122,0.07)', border: '1px solid rgba(0,229,122,0.2)',
              borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '3rem', color: 'var(--clr-green)', lineHeight: 1 }}>
                {ambulanceETA} min
              </div>
              <div style={{ color: 'var(--clr-text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>Estimated ambulance arrival</div>
            </div>

            {/* Triage Result */}
            <div className="glass" style={{ borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>AI Triage Result</span>
                <span style={{
                  background: 'rgba(255,59,59,0.15)', color: 'var(--clr-red)',
                  fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px',
                  border: '1px solid rgba(255,59,59,0.3)',
                }}>
                  {MOCK_TRIAGE.severity}
                </span>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{MOCK_TRIAGE.summary}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>{MOCK_TRIAGE.action}</p>
            </div>

            {/* Info row */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="glass" style={{ flex: 1, borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="var(--clr-blue)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>Location</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Captured ✓</div>
                </div>
              </div>
              <div className="glass" style={{ flex: 1, borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--clr-amber)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>Helpline</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>112</div>
                </div>
              </div>
            </div>

            <button onClick={reset} style={{
              width: '100%', padding: '14px',
              background: 'transparent', color: 'var(--clr-text-muted)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
            }}>
              Reset Demo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms))
}
