import { useNavigate } from 'react-router-dom'
import { Activity, MapPin, AlertCircle, Database, ChevronRight, Shield } from 'lucide-react'

const FEATURES = [
  { icon: Activity, label: 'AI Triage', desc: 'Gemma-powered instant severity scoring', color: 'var(--green)' },
  { icon: MapPin, label: 'Live Routing', desc: 'Real-time ambulance GPS tracking', color: 'var(--blue)' },
  { icon: AlertCircle, label: 'Golden Hour', desc: 'Zero-delay automated dispatch', color: 'var(--red)' },
  { icon: Database, label: 'Gov Analytics', desc: 'Case data for health research', color: 'var(--amber)' },
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 30, height: 30, background: 'var(--red)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚑</div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>NIRA<span style={{ color: 'var(--green)' }}>MAYA</span></span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="btn btn-red" onClick={() => navigate('/sos')}><AlertCircle size={14} /> Emergency SOS</button>
        </div>
      </nav>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.2)', padding: '0.3rem 0.9rem', borderRadius: '999px', marginBottom: '2rem' }}>
          <Shield size={12} color="var(--green)" />
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>Google Hackathon 2025 — AI Emergency Infrastructure</span>
        </div>
        <h1 className="fade-up-2" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem', maxWidth: '750px' }}>
          AI-powered emergency<br /><span style={{ color: 'var(--red)' }}>response</span> that saves lives
        </h1>
        <p className="fade-up-3" style={{ color: 'var(--text-muted)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '3rem', fontSize: '1rem' }}>
          Niramaya connects patients to the nearest ambulance and hospital in seconds — using Gemma AI triage to prioritize the golden hour.
        </p>
        <div className="fade-up-4" style={{ marginBottom: '1.5rem' }}>
          <div className="sos-btn-wrap" style={{ width: 160, height: 160 }}>
            <div className="sos-ring" />
            <div className="sos-ring" />
            <div className="sos-ring" />
            <button className="sos-btn" onClick={() => navigate('/sos')}>SOS</button>
          </div>
        </div>
        <p className="fade-up-5" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4rem' }}>Tap to trigger emergency response</p>
        <div className="fade-up-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: '860px', width: '100%' }}>
          {FEATURES.map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className="card" style={{ textAlign: 'left', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = color}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ width: 32, height: 32, background: `${color}20`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <Icon size={16} color={color} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div className="fade-up-5" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-green" onClick={() => navigate('/dashboard')} style={{ padding: '0.65rem 1.5rem' }}>Open Dashboard <ChevronRight size={14} /></button>
          <button className="btn btn-ghost" onClick={() => navigate('/triage')} style={{ padding: '0.65rem 1.5rem' }}>Try AI Triage</button>
        </div>
      </main>
      <footer style={{ padding: '1rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Google Hackathon 2025 Submission</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Powered by Gemma & Google Maps</span>
      </footer>
    </div>
  )
}
