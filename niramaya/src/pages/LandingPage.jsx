import React from 'react'
import { Link } from 'react-router-dom'
import { Activity, Zap, MapPin, Brain, Shield, ArrowRight, Clock } from 'lucide-react'

const STATS = [
  { value: '< 8 min', label: 'Average Response Time' },
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '500+', label: 'Hospitals Connected' },
  { value: '24/7', label: 'Active Monitoring' },
]

const FEATURES = [
  {
    icon: Brain,
    color: '#ff3b3b',
    title: 'AI-Powered Triage',
    desc: 'Gemini AI analyzes symptoms in natural language and assigns severity scores instantly — no forms, no delays.',
  },
  {
    icon: MapPin,
    color: '#4d9fff',
    title: 'Live Ambulance Tracking',
    desc: 'Real-time Google Maps integration with dynamic traffic routing to minimize golden-hour delays.',
  },
  {
    icon: Activity,
    color: '#00e57a',
    title: 'Hospital Bed Sync',
    desc: 'ICU and bed availability updated live across all connected hospitals so you never get redirected.',
  },
  {
    icon: Shield,
    color: '#ffaa00',
    title: 'Government Data Pipeline',
    desc: 'Anonymized case data flows to health authorities for research, policy, and resource planning.',
  },
  {
    icon: Zap,
    color: '#ff3b3b',
    title: 'SOS in One Tap',
    desc: 'A single button triggers the full emergency chain — location capture, triage, dispatch, hospital alert.',
  },
  {
    icon: Clock,
    color: '#4d9fff',
    title: 'Golden Hour Guard',
    desc: 'Every second of delay is tracked and reduced. The system is obsessed with your first 60 minutes.',
  },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 2rem 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(255,59,59,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'var(--clr-red-glow)', border: '1px solid var(--clr-border-active)',
          borderRadius: '99px', padding: '6px 16px', marginBottom: '2rem',
          animation: 'fadeUp 0.5s ease forwards',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--clr-red)' }} className="pulse-red" />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--clr-red-soft)', fontWeight: 500 }}>
            Emergency Response System — India
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.8rem, 7vw, 6rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
          maxWidth: '800px',
          animation: 'fadeUp 0.6s 0.1s ease both',
        }}>
          Every second is
          <br />
          <span style={{ color: 'var(--clr-red)' }}>someone's life.</span>
        </h1>

        <p style={{
          maxWidth: '520px',
          color: 'var(--clr-text-dim)',
          fontSize: '1.05rem',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          animation: 'fadeUp 0.6s 0.2s ease both',
        }}>
          Niramaya is an AI-powered emergency healthcare platform that synchronizes patients, ambulances, and hospitals in real time — designed to win the golden hour.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.6s 0.3s ease both' }}>
          <Link to="/sos" style={{
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--clr-red)',
            color: 'white',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1rem',
            padding: '14px 32px',
            borderRadius: '99px',
            boxShadow: '0 0 40px rgba(255,59,59,0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          className="pulse-red"
          >
            Trigger SOS Demo <ArrowRight size={16} />
          </Link>
          <Link to="/hospital" style={{
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--clr-bg-glass)',
            border: '1px solid var(--clr-border)',
            color: 'var(--clr-text)',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '1rem',
            padding: '14px 32px',
            borderRadius: '99px',
          }}>
            Hospital Dashboard
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid var(--clr-border)' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem', textAlign: 'center',
        }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--clr-red)', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.03em',
          marginBottom: '0.5rem',
        }}>
          Built for the critical moment.
        </h2>
        <p style={{ color: 'var(--clr-text-muted)', marginBottom: '3rem', maxWidth: '480px' }}>
          Every feature exists to cut time, reduce friction, and save lives.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="glass" style={{
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                transition: 'border-color 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = f.color + '44'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--clr-border)'}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: f.color + '15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  <Icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{
        textAlign: 'center', padding: '6rem 2rem',
        borderTop: '1px solid var(--clr-border)',
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
          Try the demo →
        </h2>
        <p style={{ color: 'var(--clr-text-muted)', marginBottom: '2rem' }}>
          Simulate a full emergency dispatch cycle in under 2 minutes.
        </p>
        <Link to="/sos" style={{
          textDecoration: 'none',
          background: 'var(--clr-red)', color: 'white',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          padding: '16px 40px', borderRadius: '99px',
          fontSize: '1rem',
          boxShadow: '0 0 40px rgba(255,59,59,0.3)',
          display: 'inline-block',
        }}>
          Launch SOS
        </Link>
      </section>
    </div>
  )
}
