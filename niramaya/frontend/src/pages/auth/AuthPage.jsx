import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Heart, Building2, BarChart3, Eye, EyeOff, ArrowLeft, Shield, Loader } from 'lucide-react'

const ROLE_CONFIG = {
  patient: {
    icon: Heart, title: 'Patient Portal',
    subtitle: 'Access emergency SOS, live tracking & AI health assistant',
    color: '#f43f5e', dim: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)',
    gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    redirect: '/patient/dashboard',
    demoUser: { name: 'Arjun Sharma', phone: '9876543210', role: 'patient' },
  },
  hospital: {
    icon: Building2, title: 'Hospital Admin',
    subtitle: 'Manage beds, ambulances and incoming patient triage',
    color: '#34d399', dim: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)',
    gradient: 'linear-gradient(135deg, #34d399, #10b981)',
    redirect: '/hospital/dashboard',
    demoUser: { name: 'AIIMS Bhubaneswar', adminName: 'Dr. Priya Das', role: 'hospital' },
  },
  government: {
    icon: BarChart3, title: 'Government Portal',
    subtitle: 'City-wide analytics, outbreak monitoring & infrastructure data',
    color: '#38bdf8', dim: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)',
    gradient: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
    redirect: '/government/dashboard',
    demoUser: { name: 'Odisha Health Dept.', officerName: 'IAS Ravi Kumar', role: 'government' },
  },
}

export default function AuthPage() {
  const { role } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const config = ROLE_CONFIG[role]

  const [mode, setMode] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')

  if (!config) { navigate('/'); return null }
  const Icon = config.icon

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    login({ ...config.demoUser, email: form.email, id: Date.now() })
    navigate(config.redirect)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background orb */}
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: 350, height: 350, background: `radial-gradient(circle, ${config.dim} 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(8,12,22,0.8)', backdropFilter: 'blur(20px)', position: 'relative', zIndex: 10 }}>
        <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ gap: '0.5rem' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #f43f5e, #e11d48)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🏥</div>
          <span style={{ fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>NIRA<span style={{ color: 'var(--emerald)' }}>MAYA</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Shield size={11} color="var(--emerald)" /> Secure Login
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 2 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Role badge */}
          <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem' }}>
            <div style={{ width: 52, height: 52, background: config.gradient, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${config.dim}` }}>
              <Icon size={26} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.01em' }}>{config.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{config.subtitle}</div>
            </div>
          </div>

          {/* Tab */}
          <div className="fade-up-2" style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 10, padding: 4, marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                style={{
                  flex: 1, padding: '0.6rem', border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontFamily: 'var(--font)', fontSize: '0.83rem', fontWeight: 600, transition: 'all 0.2s',
                  background: mode === m ? 'var(--bg-card)' : 'transparent',
                  color: mode === m ? 'var(--text)' : 'var(--text-muted)',
                  boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="card fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: `1px solid ${config.border}` }}>
            {mode === 'register' && (
              <div>
                <label>Full Name</label>
                <input placeholder={role === 'hospital' ? 'Hospital name' : 'Your full name'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div>
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            {mode === 'register' && role === 'patient' && (
              <div><label>Phone Number</label><input type="tel" placeholder="+91 98765 43210" /></div>
            )}
            <div>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: '2.5rem' }} />
                <button onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ fontSize: '0.8rem', color: 'var(--rose)', background: 'var(--rose-dim)', padding: '0.6rem 0.875rem', borderRadius: 'var(--radius-sm)' }}>{error}</div>
            )}

            <button className="btn btn-full" onClick={handleSubmit} disabled={loading}
              style={{ background: config.gradient, color: 'white', padding: '0.75rem', fontSize: '0.88rem', justifyContent: 'center', marginTop: '0.25rem', boxShadow: `0 4px 16px ${config.dim}` }}>
              {loading ? <><Loader size={14} className="spin" /> Signing in...</> : mode === 'login' ? `Sign in as ${config.title}` : 'Create Account'}
            </button>

            {mode === 'login' && (
              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
                <span onClick={() => setMode('register')} style={{ color: config.color, cursor: 'pointer', fontWeight: 600 }}>Register here</span>
              </div>
            )}
          </div>

          <div className="fade-up-4" style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            💡 Demo: use any email + password to log in instantly
          </div>
        </div>
      </main>
    </div>
  )
}
