import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Building2, Bed, Ambulance, ClipboardList, Settings, LogOut, Plus, RefreshCw, AlertTriangle, MapPin } from 'lucide-react'
import { useGoogleMap } from '../../hooks/useGoogleMap'

const MOCK_QUEUE = [
  { id: 'SOS-042', name: 'Arjun Sharma', age: 34, severity: 'CRITICAL', symptoms: 'Chest pain, sweating, left arm numbness', eta: '3 min', ambulance: 'OD-02-AB-1234' },
  { id: 'SOS-041', name: 'Meena Patel', age: 61, severity: 'HIGH', symptoms: 'Breathing difficulty, SpO2 dropping', eta: '7 min', ambulance: 'OD-02-CD-5678' },
  { id: 'SOS-040', name: 'Rohit Das', age: 22, severity: 'MODERATE', symptoms: 'Head injury from road accident', eta: '11 min', ambulance: 'OD-02-EF-9012' },
]

const MOCK_BEDS = { total: 500, available: 45, icu: 12, emergency: 8, general: 25 }

export default function HospitalDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [beds, setBeds] = useState(MOCK_BEDS)
  const [editBeds, setEditBeds] = useState(false)
  const [tempBeds, setTempBeds] = useState({ ...MOCK_BEDS })
  const mapRef = useRef(null)
  const { loaded, addMarker } = useGoogleMap(mapRef, { zoom: 12 })

  useEffect(() => {
    if (!loaded) return
    // Hospital location
    addMarker({ lat: 20.2961, lng: 85.8245 }, 'H', '#34d399', 'AIIMS Bhubaneswar')
    // Incoming ambulances
    addMarker({ lat: 20.3100, lng: 85.8100 }, '🚑', '#f43f5e', 'SOS-042 (CRITICAL)')
    addMarker({ lat: 20.2800, lng: 85.8400 }, '🚑', '#fbbf24', 'SOS-041 (HIGH)')
    addMarker({ lat: 20.3200, lng: 85.8500 }, '🚑', '#38bdf8', 'SOS-040 (MODERATE)')
  }, [loaded])

  const navItems = [
    { icon: Building2, label: 'Overview' },
    { icon: ClipboardList, label: 'Triage Queue' },
    { icon: Bed, label: 'Bed Management' },
    { icon: Ambulance, label: 'Ambulances' },
    { icon: Settings, label: 'Settings' },
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
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, var(--emerald-dim), rgba(52,211,153,0.2))', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--emerald)' }}>
              {(user?.name || 'H')[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{user?.name || 'Hospital'}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>HOSPITAL ADMIN</div>
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
          <span className="topbar-title">Hospital Command Center</span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--rose-dim)', border: '1px solid rgba(244,63,94,0.15)', padding: '0.3rem 0.85rem', borderRadius: 999 }}>
              <span className="status-dot dot-red" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--rose)', fontFamily: 'var(--font-mono)' }}>{MOCK_QUEUE.length} INCOMING</span>
            </div>
          </div>
        </header>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Bed Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }} className="fade-up">
            {[
              { label: 'Total Beds', value: beds.total, color: 'var(--text)' },
              { label: 'Available', value: beds.available, color: 'var(--emerald)' },
              { label: 'ICU Beds', value: beds.icu, color: 'var(--rose)' },
              { label: 'Emergency', value: beds.emergency, color: 'var(--amber)' },
              { label: 'General', value: beds.general, color: 'var(--sky)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{label}</div>
                <div className="stat-value" style={{ color, fontSize: '2rem' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Incoming Map View */}
            <div className="card fade-up-2" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="card-title"><MapPin size={12} style={{ display: 'inline', marginRight: 5 }} />Incoming Ambulances</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--emerald)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}><span className="status-dot dot-green" /> Live</span>
              </div>
              <div ref={mapRef} style={{ width: '100%', height: 300 }} />
            </div>

            {/* Triage Queue */}
            <div className="card fade-up-2">
              <div className="card-header">
                <span className="card-title">🚨 Incoming Triage Queue</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--emerald)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                  <RefreshCw size={11} /> Live
                </div>
              </div>
              {MOCK_QUEUE.map((p, i) => (
                <div key={p.id} style={{ padding: '0.875rem 0', borderBottom: i < MOCK_QUEUE.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.name}, {p.age}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.symptoms}</div>
                    </div>
                    <span className={`badge badge-${p.severity.toLowerCase()}`}>{p.severity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>🚑 {p.ambulance}</span>
                    <span style={{ fontSize: '0.75rem', color: p.severity === 'CRITICAL' ? 'var(--rose)' : 'var(--amber)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>ETA {p.eta}</span>
                  </div>
                  {p.severity === 'CRITICAL' && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--rose)', background: 'var(--rose-dim)', padding: '0.35rem 0.65rem', borderRadius: 6 }}>
                      <AlertTriangle size={11} /> Prep trauma bay immediately
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bed Management + Ambulance Fleet */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem' }}>
            <div className="card fade-up-3">
              <div className="card-header">
                <span className="card-title">Bed Management</span>
                <button className="btn btn-ghost" style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}
                  onClick={() => { if (editBeds) setBeds({ ...tempBeds }); setEditBeds(e => !e) }}>
                  {editBeds ? 'Save' : 'Update'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { key: 'available', label: 'General Available', color: 'var(--emerald)' },
                  { key: 'icu', label: 'ICU Beds', color: 'var(--rose)' },
                  { key: 'emergency', label: 'Emergency Beds', color: 'var(--amber)' },
                ].map(({ key, label, color }) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.875rem', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{label}</span>
                    {editBeds
                      ? <input type="number" value={tempBeds[key]} onChange={e => setTempBeds(b => ({ ...b, [key]: parseInt(e.target.value) || 0 }))} style={{ width: 70, textAlign: 'right', padding: '0.3rem 0.5rem' }} />
                      : <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color }}>{beds[key]}</span>
                    }
                  </div>
                ))}
              </div>
            </div>

            <div className="card fade-up-4">
              <div className="card-header">
                <span className="card-title">Ambulance Fleet Status</span>
                <button className="btn btn-green" style={{ padding: '0.3rem 0.875rem', fontSize: '0.72rem' }}>
                  <Plus size={12} /> Add Unit
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr><th>Vehicle</th><th>Driver</th><th>Phone</th><th>Status</th><th>Assignment</th></tr>
                </thead>
                <tbody>
                  {[
                    { v: 'OD-02-AB-1234', d: 'Ramesh Kumar', p: '9876543210', status: 'EN_ROUTE', assignment: 'SOS-042' },
                    { v: 'OD-02-CD-5678', d: 'Suresh Nayak', p: '9876543211', status: 'EN_ROUTE', assignment: 'SOS-041' },
                    { v: 'OD-02-EF-9012', d: 'Priya Das', p: '9876543212', status: 'AVAILABLE', assignment: '—' },
                  ].map(({ v, d, p, status, assignment }) => (
                    <tr key={v}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{v}</td>
                      <td style={{ color: 'var(--text)' }}>{d}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{p}</td>
                      <td><span className={`badge ${status === 'AVAILABLE' ? 'badge-active' : 'badge-high'}`}>{status}</span></td>
                      <td style={{ fontSize: '0.78rem' }}>{assignment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
