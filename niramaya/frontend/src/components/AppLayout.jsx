import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AlertCircle, LayoutDashboard, Map, Activity, FileText, LogOut, Bell } from 'lucide-react'

const NAV = [
  { icon: AlertCircle, label: 'Emergency SOS', path: '/sos' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Map, label: 'Live Tracking', path: '/track' },
  { icon: Activity, label: 'AI Triage', path: '/triage' },
  { icon: FileText, label: 'Records', path: '/records' },
]

export default function AppLayout({ children, title }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="sidebar-logo-icon">🏥</div>
          <div className="sidebar-logo-text">NIRA<span>MAYA</span></div>
        </div>

        {/* User info */}
        {user && (
          <div style={{ padding: '0 1.25rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: 34, height: 34,
                background: 'linear-gradient(135deg, var(--emerald-dim), var(--sky-dim))',
                border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: 'var(--emerald)'
              }}>
                {(user.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{user.name || 'User'}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--emerald)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  {user.role || 'patient'}
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {NAV.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              className={`nav-item ${location.pathname.startsWith(path) ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="status-dot dot-green" />
            <span style={{ fontSize: '0.75rem', color: 'var(--emerald)' }}>Systems Online</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Gemini AI + Google Maps
          </div>
          {user && (
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '0.45rem', fontSize: '0.78rem' }}
              onClick={() => { logout(); navigate('/') }}>
              <LogOut size={13} /> Sign Out
            </button>
          )}
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-actions">
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', padding: 6, borderRadius: 6,
              transition: 'color 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Bell size={16} />
            </button>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--rose-dim)', border: '1px solid rgba(244,63,94,0.15)',
              padding: '0.3rem 0.85rem', borderRadius: '999px', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
              onClick={() => navigate('/sos')}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(244,63,94,0.2)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <span className="status-dot dot-red" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--rose)', fontFamily: 'var(--font-mono)' }}>
                SOS
              </span>
            </div>
          </div>
        </header>
        <div className="page-body">
          {children}
        </div>
      </div>
    </div>
  )
}
