import React from 'react'
import { MapPin, Clock, Heart, Phone, Activity } from 'lucide-react'

const VITALS = [
  { label: 'Heart Rate', value: '92 bpm', status: 'elevated', icon: Heart },
  { label: 'Response Time', value: '6 min', status: 'ok', icon: Clock },
  { label: 'Location', value: 'Synced', status: 'ok', icon: MapPin },
  { label: 'Triage Score', value: 'Level 2', status: 'warning', icon: Activity },
]

const STATUS_COLORS = { ok: '#00e57a', elevated: '#ffaa00', warning: '#ff6b6b' }

export default function PatientDashboard() {
  return (
    <div style={{ minHeight: '100vh', padding: '90px 2rem 4rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em' }}>
          Patient Status
        </h1>
        <p style={{ color: 'var(--clr-text-muted)', marginTop: '4px' }}>Live emergency tracking — Case NRM-001</p>
      </div>

      {/* Status banner */}
      <div style={{
        background: 'rgba(0,229,122,0.07)',
        border: '1px solid rgba(0,229,122,0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '2rem',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--clr-green)' }} className="pulse-red" />
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Ambulance dispatched — arriving in <strong style={{ color: 'var(--clr-green)' }}>6 minutes</strong></span>
      </div>

      {/* Vitals grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {VITALS.map((v, i) => {
          const Icon = v.icon
          return (
            <div key={i} className="glass" style={{ borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{v.label}</span>
                <Icon size={15} color="var(--clr-text-muted)" />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: STATUS_COLORS[v.status] }}>
                {v.value}
              </div>
            </div>
          )
        })}
      </div>

      {/* Timeline */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--clr-text-dim)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Timeline
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {[
          { time: '10:42 AM', event: 'SOS triggered', done: true },
          { time: '10:42 AM', event: 'Location captured', done: true },
          { time: '10:43 AM', event: 'AI triage completed — Level 2', done: true },
          { time: '10:43 AM', event: 'Ambulance dispatched (Unit A-14)', done: true },
          { time: '10:49 AM', event: 'Ambulance arrival (estimated)', done: false },
          { time: '—', event: 'Hospital handoff', done: false },
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: t.done ? 'var(--clr-green)' : 'var(--clr-border)', flexShrink: 0, marginTop: '3px' }} />
              {i < 5 && <div style={{ width: 1, flex: 1, background: 'var(--clr-border)', marginTop: '4px' }} />}
            </div>
            <div style={{ paddingBottom: '4px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: t.done ? 500 : 400, color: t.done ? 'var(--clr-text)' : 'var(--clr-text-muted)' }}>{t.event}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginTop: '2px' }}>{t.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency contact */}
      <div className="glass" style={{ borderRadius: 'var(--radius-md)', padding: '1.25rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(77,159,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Phone size={18} color="var(--clr-blue)" />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>Emergency Helpline</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>112</div>
        </div>
      </div>
    </div>
  )
}
