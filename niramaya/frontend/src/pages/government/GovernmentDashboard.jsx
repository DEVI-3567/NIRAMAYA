import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BarChart3, Map, TrendingUp, FileText, Bell, LogOut, Activity, AlertCircle, Clock, Building2, MapPin } from 'lucide-react'
import { useGoogleMap } from '../../hooks/useGoogleMap'

const MOCK_TRENDS = [
  { label: 'Mon', value: 32 }, { label: 'Tue', value: 41 }, { label: 'Wed', value: 28 },
  { label: 'Thu', value: 55 }, { label: 'Fri', value: 48 }, { label: 'Sat', value: 62 }, { label: 'Sun', value: 45 },
]

const MOCK_BLACKSPOTS = [
  { area: 'NH-16 Bypass, Bhubaneswar', incidents: 18, avg_response: '14.2 min', risk: 'HIGH', lat: 20.325, lng: 85.810 },
  { area: 'Cuttack Ring Road', incidents: 12, avg_response: '11.8 min', risk: 'HIGH', lat: 20.462, lng: 85.883 },
  { area: 'Chandrasekharpur', incidents: 7, avg_response: '8.4 min', risk: 'MODERATE', lat: 20.335, lng: 85.815 },
  { area: 'Unit 4 Market Area', incidents: 5, avg_response: '6.1 min', risk: 'LOW', lat: 20.277, lng: 85.840 },
]

const MOCK_CONDITIONS = [
  { condition: 'Cardiac Arrest', count: 34, trend: '+12%', color: 'var(--rose)' },
  { condition: 'Road Accidents', count: 28, trend: '+3%', color: 'var(--amber)' },
  { condition: 'Respiratory', count: 21, trend: '+18%', color: 'var(--sky)' },
  { condition: 'Stroke', count: 15, trend: '-4%', color: 'var(--emerald)' },
]

export default function GovernmentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const { loaded, addMarker, fitBounds } = useGoogleMap(mapRef, { zoom: 11 })

  const maxVal = Math.max(...MOCK_TRENDS.map(t => t.value))

  useEffect(() => {
    if (!loaded) return
    const riskColors = { HIGH: '#f43f5e', MODERATE: '#fbbf24', LOW: '#34d399' }
    MOCK_BLACKSPOTS.forEach(spot => {
      addMarker({ lat: spot.lat, lng: spot.lng }, spot.incidents.toString(), riskColors[spot.risk], spot.area)
    })
    fitBounds(MOCK_BLACKSPOTS.map(s => ({ lat: s.lat, lng: s.lng })))
  }, [loaded])

  const navItems = [
    { icon: BarChart3, label: 'City Overview' },
    { icon: Map, label: 'Blackspot Map' },
    { icon: TrendingUp, label: 'Trends' },
    { icon: Activity, label: 'Outbreak Monitor' },
    { icon: FileText, label: 'Reports' },
    { icon: Bell, label: 'Alerts' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="sidebar-logo-icon">🏥</div>
          <div className="sidebar-logo-text">NIRA<span>MAYA</span></div>
        </div>
        <div style={{ padding: '0 1.25rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, var(--sky-dim), rgba(56,189,248,0.2))', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--sky)' }}>
              {(user?.name || 'G')[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{user?.name || 'Gov. Official'}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--sky)', fontFamily: 'var(--font-mono)' }}>GOVERNMENT</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ icon: Icon, label }) => (
            <button key={label} className="nav-item"><Icon size={15} />{label}</button>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-ghost btn-full" onClick={() => { logout(); navigate('/') }}><LogOut size={13} /> Sign Out</button>
        </div>
      </aside>

      <div style={{ marginLeft: 240, flex: 1 }}>
        <header className="topbar">
          <span className="topbar-title">Government Intelligence Dashboard</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <span className="status-dot dot-green" /> Live · Odisha State · {new Date().toLocaleDateString()}
          </div>
        </header>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} className="fade-up">
            {[
              { label: 'Total Emergencies', value: 45, icon: AlertCircle, color: 'var(--rose)' },
              { label: 'Avg Response Time', value: '7.2m', icon: Clock, color: 'var(--amber)' },
              { label: 'Hospitals Online', value: 3, icon: Building2, color: 'var(--emerald)' },
              { label: 'Cases Resolved', value: '94%', icon: Activity, color: 'var(--sky)' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{label}</div>
                  <div className="stat-value" style={{ color, fontSize: '1.8rem' }}>{value}</div>
                </div>
                <div style={{ background: `${color}15`, padding: '0.65rem', borderRadius: 10 }}>
                  <Icon size={18} color={color} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Blackspot Map */}
            <div className="card fade-up-2" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="card-title"><MapPin size={12} style={{ display: 'inline', marginRight: 5 }} />Emergency Blackspot Map</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Bhubaneswar-Cuttack</span>
              </div>
              <div ref={mapRef} style={{ width: '100%', height: 280 }} />
            </div>

            {/* Weekly trend */}
            <div className="card fade-up-2">
              <div className="card-header">
                <span className="card-title">Weekly Emergency Calls</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>↑ 8% vs last week</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 140, padding: '0 0.5rem' }}>
                {MOCK_TRENDS.map(({ label, value }, i) => (
                  <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{value}</div>
                    <div style={{
                      width: '100%', borderRadius: '6px 6px 2px 2px',
                      height: `${(value / maxVal) * 100}px`,
                      background: `linear-gradient(180deg, var(--emerald) 0%, rgba(52,211,153,0.4) 100%)`,
                      opacity: i === MOCK_TRENDS.length - 1 ? 1 : 0.6,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = i === MOCK_TRENDS.length - 1 ? '1' : '0.6'}
                    />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Blackspot Table */}
            <div className="card fade-up-3">
              <div className="card-header">
                <span className="card-title">Blackspot Analysis</span>
              </div>
              <table className="table">
                <thead><tr><th>Location</th><th>Incidents</th><th>Avg Response</th><th>Risk</th></tr></thead>
                <tbody>
                  {MOCK_BLACKSPOTS.map(({ area, incidents, avg_response, risk }) => (
                    <tr key={area}>
                      <td style={{ color: 'var(--text)', fontWeight: 500, fontSize: '0.8rem' }}>{area}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{incidents}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: parseFloat(avg_response) > 10 ? 'var(--rose)' : 'var(--emerald)' }}>{avg_response}</td>
                      <td><span className={`badge badge-${risk.toLowerCase()}`}>{risk}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Emergency breakdown */}
            <div className="card fade-up-3">
              <div className="card-header"><span className="card-title">Emergency Type Breakdown</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {MOCK_CONDITIONS.map(({ condition, count, trend, color }) => (
                  <div key={condition}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                        <span style={{ fontSize: '0.82rem' }}>{condition}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.88rem' }}>{count}</span>
                        <span style={{ fontSize: '0.7rem', color: trend.startsWith('+') ? 'var(--rose)' : 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>{trend}</span>
                      </div>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                      <div style={{ width: `${(count / 34) * 100}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Outbreak Monitor */}
          <div className="card fade-up-4">
            <div className="card-header">
              <span className="card-title">🦠 Outbreak Signal Monitor</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
                <span className="status-dot dot-green" /> No active alerts
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { signal: 'Respiratory Spike', zone: 'Chandrasekharpur', change: '+18% this week', level: 'WATCH', color: 'var(--amber)' },
                { signal: 'Cardiac Events', zone: 'Unit 1-4', change: '+12% this week', level: 'ELEVATED', color: 'var(--rose)' },
                { signal: 'Road Accidents', zone: 'NH-16 Corridor', change: 'Stable', level: 'NORMAL', color: 'var(--emerald)' },
              ].map(({ signal, zone, change, level, color }) => (
                <div key={signal} style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 10, border: `1px solid ${color}20`, transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${color}40`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${color}20`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{signal}</span>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color, background: `${color}15`, padding: '2px 8px', borderRadius: 999 }}>{level}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{zone}</div>
                  <div style={{ fontSize: '0.75rem', color, marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>{change}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight */}
          <div style={{ padding: '1rem 1.25rem', background: 'var(--sky-dim)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 'var(--radius)', fontSize: '0.82rem', color: 'var(--sky)', lineHeight: 1.6 }}>
            💡 <strong>AI Insight:</strong> NH-16 Bypass shows consistently high response times. Recommend stationing one additional ambulance unit near Patia junction to reduce avg. response by ~4 minutes.
          </div>
        </div>
      </div>
    </div>
  )
}
