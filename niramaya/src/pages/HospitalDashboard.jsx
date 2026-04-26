import React, { useState } from 'react'
import { Bed, AlertCircle, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react'

const INCOMING = [
  { id: 'NRM-001', severity: 'CRITICAL', symptoms: 'Chest pain, shortness of breath', eta: '4 min', triage: 1 },
  { id: 'NRM-002', severity: 'HIGH', symptoms: 'Head trauma, loss of consciousness', eta: '9 min', triage: 2 },
  { id: 'NRM-003', severity: 'MODERATE', symptoms: 'Fracture, heavy bleeding', eta: '14 min', triage: 3 },
]

const BEDS = [
  { type: 'ICU', total: 20, available: 4 },
  { type: 'General', total: 80, available: 23 },
  { type: 'Trauma', total: 15, available: 6 },
  { type: 'Pediatric', total: 12, available: 3 },
]

const SEVERITY_COLORS = { CRITICAL: '#ff3b3b', HIGH: '#ffaa00', MODERATE: '#4d9fff' }

export default function HospitalDashboard() {
  const [accepted, setAccepted] = useState([])

  const accept = (id) => setAccepted(prev => [...prev, id])

  return (
    <div style={{ minHeight: '100vh', padding: '90px 2rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em' }}>
          Hospital Dashboard
        </h1>
        <p style={{ color: 'var(--clr-text-muted)', marginTop: '4px' }}>AIIMS Bhubaneswar — Live Emergency Feed</p>
      </div>

      {/* Bed summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {BEDS.map((b, i) => (
          <div key={i} className="glass" style={{ borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.type}</span>
              <Bed size={16} color="var(--clr-text-muted)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: b.available < 5 ? 'var(--clr-red)' : 'var(--clr-green)', lineHeight: 1 }}>
              {b.available}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginTop: '4px' }}>of {b.total} available</div>
            <div style={{ marginTop: '10px', height: 4, background: 'var(--clr-border)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(b.available / b.total) * 100}%`, background: b.available < 5 ? 'var(--clr-red)' : 'var(--clr-green)', borderRadius: '99px', transition: 'width 0.5s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Incoming cases */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--clr-text-dim)' }}>
        INCOMING CASES
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {INCOMING.map((c) => {
          const isAccepted = accepted.includes(c.id)
          return (
            <div key={c.id} className="glass" style={{
              borderRadius: 'var(--radius-md)', padding: '1.5rem',
              borderColor: isAccepted ? 'rgba(0,229,122,0.3)' : `${SEVERITY_COLORS[c.severity]}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '1rem',
              transition: 'border-color 0.3s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: SEVERITY_COLORS[c.severity] + '15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertCircle size={20} color={SEVERITY_COLORS[c.severity]} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>{c.id}</span>
                    <span style={{
                      background: SEVERITY_COLORS[c.severity] + '18',
                      color: SEVERITY_COLORS[c.severity],
                      fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px',
                      border: `1px solid ${SEVERITY_COLORS[c.severity]}33`,
                    }}>
                      {c.severity}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--clr-text-dim)' }}>{c.symptoms}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ETA</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--clr-amber)' }}>{c.eta}</div>
                </div>

                {isAccepted ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--clr-green)', fontSize: '0.9rem', fontWeight: 600 }}>
                    <CheckCircle size={18} /> Accepted
                  </div>
                ) : (
                  <button onClick={() => accept(c.id)} style={{
                    background: 'var(--clr-green)', color: '#0a0d12',
                    border: 'none', borderRadius: '8px',
                    padding: '8px 20px', cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem',
                    transition: 'opacity 0.2s',
                  }}>
                    Accept
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
