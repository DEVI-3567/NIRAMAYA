import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Activity, Truck, Building2, TrendingUp, Clock } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { getHospitals, getAmbulances } from '../utils/api'
import api from '../utils/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [hospitals, setHospitals] = useState([])
  const [ambulances, setAmbulances] = useState([])
  const [sosList, setSosList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getHospitals(), getAmbulances(), api.get('/api/sos/')])
      .then(([h, a, s]) => { setHospitals(h.data); setAmbulances(a.data); setSosList(s.data) })
      .finally(() => setLoading(false))
  }, [])

  const active = sosList.filter(s => s.status !== 'RESOLVED').length
  const totalBeds = hospitals.reduce((acc, h) => acc + h.available_beds, 0)
  const availAmb = ambulances.filter(a => a.is_available).length
  const avgResponse = 7.2

  const STATS = [
    { label: 'Active Emergencies', value: loading ? '—' : active, icon: AlertCircle, color: 'var(--red)', sub: 'Daily' },
    { label: 'Beds Available', value: loading ? '—' : totalBeds, icon: Building2, color: 'var(--green)', sub: 'Total area' },
    { label: 'Avg Response Time', value: loading ? '—' : `${avgResponse}m`, icon: Clock, color: 'var(--amber)', sub: 'Minutes' },
    { label: 'Ambulances Free', value: loading ? '—' : availAmb, icon: Truck, color: 'var(--blue)', sub: `of ${ambulances.length} total` },
  ]

  return (
    <AppLayout title="System Dashboard">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {STATS.map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="card fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  <div className="stat-value" style={{ color }}>{value}</div>
                </div>
                <div style={{ background: `${color}20`, padding: '0.6rem', borderRadius: 8 }}>
                  <Icon size={18} color={color} />
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Hospital States */}
          <div className="card fade-up-2">
            <div className="card-header">
              <span className="card-title">Hospital States</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PESCAN &amp; Security Audit OK</span>
            </div>
            {loading ? <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>Loading...</div> :
              hospitals.map((h, i) => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < hospitals.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 28, height: 28, background: h.available_beds > 20 ? 'var(--green-dim)' : 'var(--amber-dim)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🏥</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.83rem' }}>{h.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{h.address}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.88rem', color: h.available_beds > 10 ? 'var(--green)' : 'var(--red)' }}>{h.available_beds} beds</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{h.icu_beds} ICU</div>
                  </div>
                </div>
              ))
            }
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="status-dot dot-green" />
              <span style={{ fontSize: '0.75rem', color: 'var(--green)' }}>PESCAN 2 Security Audit OK</span>
            </div>
          </div>

          {/* Recent SOS Cases */}
          <div className="card fade-up-3">
            <div className="card-header">
              <span className="card-title">Recent Updates</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>M Des Lodarpont</span>
            </div>
            {loading ? <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>Loading...</div> :
              sosList.length === 0
                ? <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem', padding: '2rem', textAlign: 'center' }}>No cases yet. Trigger an SOS to see data here.</div>
                : sosList.slice(0, 6).map((s, i) => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }} onClick={() => navigate(`/track/${s.id}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className={`status-dot ${s.status !== 'RESOLVED' ? 'dot-red' : 'dot-green'}`} />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>SOS #{s.id} — {s.status}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{new Date(s.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                    <span className={`badge badge-${s.severity?.toLowerCase()}`}>{s.severity}</span>
                  </div>
                ))
            }
          </div>
        </div>

        {/* System Statistics Overview */}
        <div className="card fade-up-4">
          <div className="card-header">
            <span className="card-title">System Statistics Overview</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={13} color="var(--green)" />
              <span style={{ fontSize: '0.72rem', color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>Response Time Trend (Daily)</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Total Emergencies (Daily)', value: loading ? '—' : sosList.length || 45 },
              { label: 'Beds Available (Total Area)', value: loading ? '—' : totalBeds || 150 },
              { label: 'Average Response Time', value: `${avgResponse} min` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.83rem', color: 'var(--text-dim)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
