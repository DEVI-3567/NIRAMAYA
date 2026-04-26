import { useNavigate } from 'react-router-dom'
import { Heart, Building2, BarChart3, Shield, ChevronRight, Zap, MapPin, Brain, Clock } from 'lucide-react'

const ROLES = [
  {
    key: 'patient', icon: Heart, title: 'Patient / Public',
    desc: 'Trigger SOS, track ambulance in real-time, AI health assistant & emergency history.',
    color: '#f43f5e', dim: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)',
    tag: 'Zero-friction emergency access', gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
  },
  {
    key: 'hospital', icon: Building2, title: 'Hospital Admin',
    desc: 'Manage bed availability, view incoming triage queue, coordinate ambulance dispatch.',
    color: '#34d399', dim: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)',
    tag: 'Operational command center', gradient: 'linear-gradient(135deg, #34d399, #10b981)',
  },
  {
    key: 'government', icon: BarChart3, title: 'Government / Research',
    desc: 'City-wide emergency analytics, response time trends, outbreak signals & infrastructure data.',
    color: '#38bdf8', dim: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)',
    tag: 'Data intelligence platform', gradient: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
  },
]

const FEATURES = [
  { icon: Brain, label: 'Gemini AI Triage', desc: 'Instant severity scoring with image analysis', color: '#a78bfa' },
  { icon: MapPin, label: 'Live GPS Tracking', desc: 'Real-time ambulance route on Google Maps', color: '#34d399' },
  { icon: Zap, label: 'Golden Hour', desc: 'Zero-delay AI-powered dispatch system', color: '#f43f5e' },
  { icon: Clock, label: 'Response Analytics', desc: 'City-wide health intelligence dashboard', color: '#fbbf24' },
]

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Animated background orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite 2s', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(8,12,22,0.8)', backdropFilter: 'blur(20px)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #f43f5e, #e11d48)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 4px 16px rgba(244,63,94,0.3)' }}>🏥</div>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            NIRA<span style={{ color: 'var(--emerald)' }}>MAYA</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Shield size={12} color="var(--emerald)" />
          <span>Powered by Gemini AI & Google Maps</span>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--rose-dim)', border: '1px solid rgba(244,63,94,0.15)', padding: '0.35rem 1rem', borderRadius: '999px', marginBottom: '1.75rem' }}>
          <span className="status-dot dot-red" />
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--rose)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}>Emergency Response System — Live</span>
        </div>

        <h1 className="fade-up-2" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '1rem', maxWidth: '640px' }}>
          Who are you accessing<br /><span className="gradient-text-rose">Niramaya</span> as?
        </h1>
        <p className="fade-up-3" style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: '440px', lineHeight: 1.7 }}>
          Each role has a tailored interface built for your specific needs in the emergency healthcare ecosystem.
        </p>

        {/* Role Cards */}
        <div className="fade-up-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', maxWidth: '940px', width: '100%' }}>
          {ROLES.map(({ key, icon: Icon, title, desc, color, dim, border, tag, gradient }) => (
            <div key={key}
              onClick={() => navigate(`/login/${key}`)}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '1.75rem', textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', position: 'relative', overflow: 'hidden',
                backdropFilter: 'blur(16px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = border
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 12px 40px ${dim}, 0 0 0 1px ${border}`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Glow */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: dim, borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

              <div style={{
                width: 48, height: 48, background: gradient, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem',
                boxShadow: `0 4px 16px ${dim}`
              }}>
                <Icon size={22} color="white" />
              </div>

              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>{tag}</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.6rem' }}>{title}</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.25rem' }}>{desc}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color, fontSize: '0.82rem', fontWeight: 600, transition: 'gap 0.2s' }}>
                Get Started <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Feature Strip */}
        <div className="fade-up-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: '940px', width: '100%', marginTop: '2.5rem' }}>
          {FEATURES.map(({ icon: Icon, label, desc, color }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              padding: '0.875rem', background: 'var(--bg-glass)', border: '1px solid var(--border)',
              borderRadius: 12, transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${color}40`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ width: 32, height: 32, background: `${color}15`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color={color} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.15rem' }}>{label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ padding: '1rem 2.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Google Hackathon 2025 Submission</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Built with Gemini AI & Google Maps Platform</span>
      </footer>
    </div>
  )
}
