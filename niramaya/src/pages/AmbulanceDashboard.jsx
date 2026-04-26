import React, { useState } from 'react'
import { Navigation, AlertCircle, CheckCircle, Radio, Zap } from 'lucide-react'

export default function AmbulanceDashboard() {
  const [status, setStatus] = useState('en-route') // en-route | arrived | handoff

  return (
    <div style={{ minHeight: '100vh', padding: '90px 2rem 4rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em' }}>
            Unit A-14
          </h1>
          <span style={{
            background: 'rgba(0,229,122,0.12)', color: 'var(--clr-green)',
            fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '99px',
            border: '1px solid rgba(0,229,122,0.25)',
          }}>
            ACTIVE
          </span>
        </div>
        <p style={{ color: 'var(--clr-text-muted)' }}>Ambulance Driver View — Case NRM-001</p>
      </div>

      {/* Active case card */}
      <div style={{
        background: 'rgba(255,59,59,0.06)', border: '1px solid rgba(255,59,59,0.25)',
        borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Active Case</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>NRM-001</div>
          </div>
          <span style={{
            background: 'rgba(255,59,59,0.15)', color: 'var(--clr-red)',
            fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '99px',
            border: '1px solid rgba(255,59,59,0.3)',
          }}>CRITICAL</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-dim)', marginBottom: '1rem' }}>
          Chest pain, shortness of breath, heavy sweating. Possible cardiac event.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, background: 'var(--clr-bg-glass)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', border: '1px solid var(--clr-border)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distance</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--clr-amber)' }}>1.8 km</div>
          </div>
          <div style={{ flex: 1, background: 'var(--clr-bg-glass)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', border: '1px solid var(--clr-border)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ETA</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--clr-green)' }}>4 min</div>
          </div>
          <div style={{ flex: 1, background: 'var(--clr-bg-glass)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', border: '1px solid var(--clr-border)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hospital</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--clr-blue)' }}>AIIMS</div>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="glass" style={{
        borderRadius: 'var(--radius-lg)', height: '220px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(77,159,255,0.05), rgba(10,13,18,0.8))',
      }}>
        <Navigation size={32} color="var(--clr-blue)" />
        <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>Google Maps — Live Route</p>
        <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', background: 'var(--clr-bg-glass)', padding: '4px 12px', borderRadius: '99px', border: '1px solid var(--clr-border)' }}>
          Add VITE_GOOGLE_MAPS_API_KEY to .env
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {status === 'en-route' && (
          <button onClick={() => setStatus('arrived')} style={{
            width: '100%', padding: '14px',
            background: 'var(--clr-amber)', color: '#0a0d12',
            border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <CheckCircle size={18} /> Mark as Arrived at Patient
          </button>
        )}
        {status === 'arrived' && (
          <button onClick={() => setStatus('handoff')} style={{
            width: '100%', padding: '14px',
            background: 'var(--clr-green)', color: '#0a0d12',
            border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <Zap size={18} /> Complete Hospital Handoff
          </button>
        )}
        {status === 'handoff' && (
          <div style={{
            background: 'rgba(0,229,122,0.07)', border: '1px solid rgba(0,229,122,0.2)',
            borderRadius: 'var(--radius-md)', padding: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            color: 'var(--clr-green)', fontWeight: 600,
          }}>
            <CheckCircle size={20} /> Case closed. Data synced to government DB.
          </div>
        )}
        <button style={{
          width: '100%', padding: '12px',
          background: 'transparent', color: 'var(--clr-text-muted)',
          border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          <Radio size={16} /> Contact Dispatch
        </button>
      </div>
    </div>
  )
}
