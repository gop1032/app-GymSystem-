import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Dumbbell, Star, ChevronRight, Zap, Users, Trophy, Heart } from 'lucide-react'

const GYM_IMAGES = {
  hero: '/images/gym_hero.jpg',
  musculacion: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  cardio: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
  clases: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  nutricion: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80',
}

const stats = [
  { icon: Users, value: '500+', label: 'Miembros activos' },
  { icon: Dumbbell, value: '15+', label: 'Máquinas premium' },
  { icon: Trophy, value: '8+', label: 'Años de experiencia' },
  { icon: Heart, value: '6', label: 'Entrenadores certificados' },
]

const services = [
  {
    label: 'Área de Musculación',
    img: GYM_IMAGES.musculacion,
    desc: 'Máquinas de poleas, mancuernas importadas y press de banca de alto rendimiento.',
    tag: 'Fuerza',
  },
  {
    label: 'Zona Cardiovascular',
    img: GYM_IMAGES.cardio,
    desc: 'Caminadoras avanzadas, elípticas y bicicletas estáticas de última generación.',
    tag: 'Cardio',
  },
  {
    label: 'Clases Grupales',
    img: GYM_IMAGES.clases,
    desc: 'Spinning, funcional, Zumba y Yoga dirigidos por entrenadores certificados.',
    tag: 'Grupal',
  },
  {
    label: 'Nutrición Deportiva',
    img: GYM_IMAGES.nutricion,
    desc: 'Plan nutricional personalizado y seguimiento de macronutrientes con tu nutricionista.',
    tag: 'Nutrición',
  },
]

const plans = [
  {
    name: 'Pase Diario',
    cycle: '1 día',
    price: 'S/. 10',
    features: ['Acceso completo al gym', 'Uso de máquinas', 'Vestuarios'],
    highlight: false,
    color: 'border-gray-700',
  },
  {
    name: 'Plan Mensual',
    cycle: '30 días',
    price: 'S/. 80',
    features: ['Acceso ilimitado', 'Clases grupales', 'Evaluación inicial', 'Vestuarios premium'],
    highlight: true,
    color: 'border-amber-500',
  },
  {
    name: 'Plan Trimestral',
    cycle: '90 días',
    price: 'S/. 210',
    features: ['Todo lo del mensual', 'Descuento especial', 'Seguimiento mensual'],
    highlight: false,
    color: 'border-gray-700',
  },
  {
    name: 'Plan Anual',
    cycle: '365 días',
    price: 'S/. 700',
    features: ['Todo incluido', 'Máximo ahorro', 'Entrenador personalizado', 'Nutrición incluida'],
    highlight: false,
    color: 'border-gray-700',
  },
]

export default function Landing() {
  const [activeService, setActiveService] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ─── Sticky Navbar ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backdropFilter: 'blur(16px)',
        background: scrolled ? 'rgba(3,7,18,0.92)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(251,191,36,0.15)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: 'linear-gradient(135deg, #fbbf24, #d97706)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Dumbbell size={20} color="#030712" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '.05em' }}>
            Gym <span style={{ color: '#fbbf24' }}>System</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="#servicios" style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Servicios</a>
          <a href="#planes" style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Planes</a>
          <a href="#contacto" style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Contacto</a>
          <Link to="/login" style={{
            padding: '8px 20px', background: 'linear-gradient(135deg, #fbbf24, #d97706)',
            borderRadius: '999px', color: '#030712', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none'
          }}>Ingresar</Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '64px', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${GYM_IMAGES.hero})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.25)'
        }} />
        {/* Amber gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, transparent 60%, rgba(217,119,6,0.05) 100%)'
        }} />
        {/* Glowing orbs */}
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)', top: '-100px', left: '-100px', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%)', bottom: '0', right: '0', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            {/* Left: Text */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)',
                borderRadius: '999px', padding: '6px 16px', marginBottom: '24px'
              }}>
                <ShieldCheck size={14} color="#fbbf24" />
                <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.08em' }}>
                  SEDE TAMBOPATA · MADRE DE DIOS
                </span>
              </div>

              <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Entrena como<br />
                un <span style={{ color: '#fbbf24', position: 'relative' }}>Campeón</span>
              </h1>

              <p style={{ color: '#9ca3af', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '480px' }}>
                Puerto Maldonado's premier fitness center. Fuerza, resistencia y salud en un espacio de primer nivel con entrenadores certificados.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/register" style={{
                  padding: '14px 32px', background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                  color: '#030712', fontWeight: 800, fontSize: '1rem', borderRadius: '999px',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 8px 24px rgba(251,191,36,0.3)', transition: 'all 0.3s'
                }}>
                  <Zap size={18} /> Comenzar Ahora
                </Link>
                <Link to="/login" style={{
                  padding: '14px 32px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700,
                  fontSize: '1rem', borderRadius: '999px', textDecoration: 'none',
                  backdropFilter: 'blur(8px)', transition: 'all 0.3s'
                }}>
                  Iniciar Sesión →
                </Link>
              </div>

              {/* Mini stats */}
              <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                {stats.map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fbbf24' }}>{stat.value}</p>
                    <p style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, marginTop: '2px' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero Image Card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '24px', overflow: 'hidden',
                border: '1px solid rgba(251,191,36,0.2)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 60px rgba(251,191,36,0.05)'
              }}>
                <img src={GYM_IMAGES.musculacion} alt="Gym interior" style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(3,7,18,0.8) 0%, transparent 50%)'
                }} />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                  <div style={{
                    background: 'rgba(3,7,18,0.7)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(251,191,36,0.2)', borderRadius: '16px', padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: '12px'
                  }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#fbbf24,#d97706)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Dumbbell size={20} color="#030712" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, letterSpacing: '.05em' }}>ZONA DE PESAS</p>
                      <p style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, marginTop: '2px' }}>Equipamiento importado de alto nivel</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div style={{
                position: 'absolute', top: '-16px', right: '-16px',
                background: 'linear-gradient(135deg, #fbbf24, #d97706)', borderRadius: '16px',
                padding: '12px 16px', boxShadow: '0 8px 24px rgba(251,191,36,0.4)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#030712" color="#030712" />)}
                </div>
                <p style={{ color: '#030712', fontSize: '0.7rem', fontWeight: 800, marginTop: '2px' }}>Mejor Gym 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INFO BAR ─── */}
      <section id="contacto" style={{
        background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
        padding: '1.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="#030712" />
            <div>
              <p style={{ fontWeight: 800, color: '#030712', fontSize: '0.85rem' }}>Horario de Atención</p>
              <p style={{ color: 'rgba(3,7,18,0.7)', fontSize: '0.75rem' }}>Mar–Dom: 5:30 AM – 1:00 PM · 2:00 PM – 10:00 PM | Lunes: Cerrado</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={20} color="#030712" />
            <div>
              <p style={{ fontWeight: 800, color: '#030712', fontSize: '0.85rem' }}>Ubicación</p>
              <p style={{ color: 'rgba(3,7,18,0.7)', fontSize: '0.75rem' }}>Lambayeque J-10, Puerto Maldonado 17001, Tambopata</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="tel:+51913986141" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(3,7,18,0.15)', color: '#030712', padding: '8px 16px',
              borderRadius: '999px', fontWeight: 800, fontSize: '0.8rem', textDecoration: 'none'
            }}>
              <Phone size={14} /> Llamar
            </a>
            <a href="https://wa.me/51913986141" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#25d366', color: '#fff', padding: '8px 16px',
              borderRadius: '999px', fontWeight: 800, fontSize: '0.8rem', textDecoration: 'none'
            }}>
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── SERVICES SECTION ─── */}
      <section id="servicios" style={{ padding: '6rem 2rem', background: '#070d1a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Lo que ofrecemos</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '8px', color: '#fff' }}>Servicios e Instalaciones</h2>
            <p style={{ color: '#6b7280', marginTop: '12px', maxWidth: '500px', margin: '12px auto 0' }}>Instalaciones de primer nivel diseñadas para ayudarte a alcanzar tus metas.</p>
          </div>

          {/* Service selector tabs */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {services.map((s, i) => (
              <button key={i} onClick={() => setActiveService(i)} style={{
                padding: '8px 20px', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                background: activeService === i ? 'linear-gradient(135deg,#fbbf24,#d97706)' : 'rgba(255,255,255,0.05)',
                color: activeService === i ? '#030712' : '#9ca3af',
                boxShadow: activeService === i ? '0 4px 12px rgba(251,191,36,0.3)' : 'none'
              }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Active service showcase */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px', overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src={services[activeService].img}
                alt={services[activeService].label}
                style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block', transition: 'all 0.5s' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, #070d1a 100%)' }} />
              <span style={{
                position: 'absolute', top: '20px', left: '20px',
                background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#030712',
                padding: '6px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800
              }}>{services[activeService].tag}</span>
            </div>
            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>{services[activeService].label}</h3>
              <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1rem' }}>{services[activeService].desc}</p>
              <a href="https://wa.me/51913986141" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#030712',
                padding: '12px 24px', borderRadius: '999px', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem', width: 'fit-content'
              }}>
                Consultar este servicio <ChevronRight size={16} />
              </a>
            </div>
          </div>

          {/* Service cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
            {services.map((s, i) => (
              <div key={i} onClick={() => setActiveService(i)} style={{
                cursor: 'pointer', borderRadius: '20px', overflow: 'hidden',
                border: `1px solid ${activeService === i ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.3s',
                transform: activeService === i ? 'translateY(-4px)' : 'none',
                boxShadow: activeService === i ? '0 8px 24px rgba(251,191,36,0.15)' : 'none'
              }}>
                <img src={s.img} alt={s.label} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.8rem' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLANS SECTION ─── */}
      <section id="planes" style={{ padding: '6rem 2rem', background: '#030712' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Elige tu plan</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '8px', color: '#fff' }}>Planes de Membresía</h2>
            <p style={{ color: '#6b7280', marginTop: '12px' }}>Opciones flexibles para cada estilo de vida.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {plans.map((plan, i) => (
              <div key={i} style={{
                background: plan.highlight ? 'linear-gradient(165deg, rgba(251,191,36,0.08) 0%, rgba(217,119,6,0.05) 100%)' : 'rgba(255,255,255,0.02)',
                border: `2px solid ${plan.highlight ? '#fbbf24' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '24px', padding: '2rem',
                display: 'flex', flexDirection: 'column',
                position: 'relative', transition: 'all 0.3s',
                boxShadow: plan.highlight ? '0 8px 32px rgba(251,191,36,0.15)' : 'none'
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#030712',
                    padding: '4px 16px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 900, whiteSpace: 'nowrap'
                  }}>⚡ MÁS POPULAR</div>
                )}
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>{plan.cycle}</p>
                  <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 900, marginTop: '8px' }}>{plan.name}</h3>
                  <p style={{ color: '#fbbf24', fontSize: '2rem', fontWeight: 900, marginTop: '16px' }}>{plan.price}</p>
                  <ul style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '0.85rem' }}>
                        <span style={{ color: '#fbbf24', fontWeight: 900 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <a href="https://wa.me/51913986141" target="_blank" rel="noopener noreferrer" style={{
                  marginTop: '2rem', display: 'block', textAlign: 'center',
                  padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none',
                  background: plan.highlight ? 'linear-gradient(135deg,#fbbf24,#d97706)' : 'rgba(255,255,255,0.06)',
                  color: plan.highlight ? '#030712' : '#fff',
                  border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s'
                }}>
                  Consultar plan
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAP / LOCATION SECTION ─── */}
      <section style={{ padding: '4rem 2rem', background: '#070d1a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Encuéntranos</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: '8px', marginBottom: '1rem' }}>Nuestra Ubicación</h2>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                Estamos ubicados en el corazón de Puerto Maldonado, de fácil acceso para toda la ciudad.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <MapPin size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Dirección</p>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Lambayeque J-10, Puerto Maldonado 17001, Tambopata, Madre de Dios</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Phone size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Teléfono</p>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>+51 913 986 141</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Clock size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Horarios</p>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Mar–Dom: 5:30 AM–1:00 PM y 2:00 PM–10:00 PM<br />Lunes: Cerrado</p>
                  </div>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=-12.5985936%2C-69.1887054"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '1.5rem',
                  background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#030712',
                  padding: '10px 20px', borderRadius: '999px', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none'
                }}>
                <MapPin size={14} /> Ver en Google Maps
              </a>
            </div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(251,191,36,0.2)', height: '300px' }}>
              <iframe
                title="Ubicación Gym System"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3896.2!2d-69.1887054!3d-12.5985936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDM1JzU1LjAiUyA2OcKwMTEnMTkuMyJX!5e0!3m2!1ses!2spe!4v1600000000000"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#030712', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#fbbf24,#d97706)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={16} color="#030712" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1rem' }}>Gym <span style={{ color: '#fbbf24' }}>System</span></span>
          </div>
          <p style={{ color: '#374151', fontSize: '0.8rem' }}>© 2025 Gym System · Puerto Maldonado, Tambopata · Todos los derechos reservados</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="#servicios" style={{ color: '#9ca3af', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>Servicios</a>
            <a href="#planes" style={{ color: '#9ca3af', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>Planes</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
