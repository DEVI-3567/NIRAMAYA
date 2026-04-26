import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Activity, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/patient', label: 'Patient' },
    { to: '/hospital', label: 'Hospital' },
    { to: '/ambulance', label: 'Ambulance' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 2rem',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(10,13,18,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--clr-border)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 34, height: 34, borderRadius: '10px',
          background: 'var(--clr-red)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px var(--clr-red-glow)',
        }}>
          <Activity size={18} color="white" />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--clr-text)', letterSpacing: '-0.02em' }}>
          NIRAMAYA
        </span>
      </Link>

      {/* Desktop links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: location.pathname === l.to ? 'var(--clr-red-soft)' : 'var(--clr-text-dim)',
            transition: 'color 0.2s',
          }}>
            {l.label}
          </Link>
        ))}
        <Link to="/sos" style={{
          textDecoration: 'none',
          background: 'var(--clr-red)',
          color: 'white',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          padding: '8px 20px',
          borderRadius: '99px',
          boxShadow: '0 0 20px rgba(255,59,59,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.target.style.transform='scale(1.05)'; e.target.style.boxShadow='0 0 30px rgba(255,59,59,0.5)' }}
        onMouseLeave={e => { e.target.style.transform='scale(1)'; e.target.style.boxShadow='0 0 20px rgba(255,59,59,0.3)' }}
        >
          SOS
        </Link>
      </div>
    </nav>
  )
}
