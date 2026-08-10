import React from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, Shield, Users, BarChart3, Clock } from 'lucide-react'

const features = [
  { icon: Shield, text: 'Sistema seguro con JWT' },
  { icon: Users, text: 'Roles diferenciados' },
  { icon: BarChart3, text: 'Reportes en tiempo real' },
  { icon: Clock, text: 'Control de horarios' },
]

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#030712',
      display: 'flex',
      alignItems: 'stretch',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Left Brand Panel */}
      <aside style={{
        width: '42%',
        minHeight: '100vh',
        background: 'linear-gradient(165deg, #030712 0%, #0d1629 100%)',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid rgba(251,191,36,0.12)'
      }}>
        {/* Background gym image with overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/gym_hero.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.18)'
        }} />
        {/* Amber gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(165deg, rgba(251,191,36,0.05) 0%, rgba(3,7,18,0.9) 100%)'
        }} />
        {/* Glowing orb */}
        <div style={{
          position: 'absolute', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)',
          top: '-100px', left: '-100px', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px',
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(251,191,36,0.3)'
            }}>
              <Dumbbell size={22} color="#030712" strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '.05em', lineHeight: 1 }}>
                Gym <span style={{ color: '#fbbf24' }}>System</span>
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                Plataforma de Gestión
              </p>
            </div>
          </Link>

          <div style={{ marginTop: '3rem' }}>
            <h1 style={{
              fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.15, color: '#fff',
              marginBottom: '1rem'
            }}>
              {title}
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 400
            }}>
              {subtitle}
            </p>
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'rgba(251,191,36,0.06)', borderRadius: '12px', padding: '10px 14px',
                  border: '1px solid rgba(251,191,36,0.12)'
                }}>
                  <div style={{
                    width: '32px', height: '32px', background: 'rgba(251,191,36,0.15)',
                    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Icon size={16} color="#fbbf24" />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', fontWeight: 600 }}>{f.text}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom quote */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)',
            borderRadius: '16px', padding: '16px 20px'
          }}>
            <p style={{ color: '#fbbf24', fontStyle: 'italic', fontSize: '0.9rem', fontWeight: 600 }}>
              "El dolor que sientes hoy es la fuerza que sentirás mañana."
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '6px' }}>— Gym System, Puerto Maldonado</p>
          </div>
        </div>
      </aside>

      {/* Right Form Panel */}
      <div style={{
        flex: 1,
        background: '#0d1629',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        position: 'relative'
      }}>
        {/* Subtle background pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(rgba(251,191,36,0.04) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }} />

        <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 2 }}>
          {/* Logo mark on mobile / card */}
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '60px', height: '60px',
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(251,191,36,0.3)'
            }}>
              <Dumbbell size={28} color="#030712" strokeWidth={2.5} />
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px', padding: '2.5rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
          }}>
            {children}
          </div>

          {footer && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
              {footer}
            </div>
          )}

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/" style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}