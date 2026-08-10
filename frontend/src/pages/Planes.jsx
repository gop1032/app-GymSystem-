import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Award, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export default function Planes() {
  const { user } = useContext(AuthContext);

  const planes = [
    {
      nombre: "Plan Mensual",
      ciclo: "30 días",
      precio: "80",
      features: ["Acceso ilimitado", "Clases grupales", "Evaluación inicial"],
      highlight: false
    },
    {
      nombre: "Plan Trimestral",
      ciclo: "90 días",
      precio: "210",
      features: ["Todo lo del mensual", "Descuento especial", "Seguimiento mensual"],
      highlight: true
    },
    {
      nombre: "Plan Semestral",
      ciclo: "180 días",
      precio: "390",
      features: ["Todo incluido", "Evaluación quincenal", "Congelamiento 1 semana"],
      highlight: false
    },
    {
      nombre: "Plan Anual",
      ciclo: "365 días",
      precio: "720",
      features: ["Beneficios VIP", "Entrenador personal", "Máximo ahorro"],
      highlight: false
    },
  ];

  const content = (
    <div style={{ padding: user ? '0' : '4rem 2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
        <div>
          <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>Membresías</p>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>Nuestros Planes</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '8px' }}>Elige el plan que mejor se adapte a tus objetivos.</p>
        </div>
        {!user && (
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
            ← Volver al inicio
          </Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {planes.map((plan, index) => (
          <div key={index} style={{
            background: plan.highlight ? 'linear-gradient(165deg, rgba(251,191,36,0.08) 0%, rgba(217,119,6,0.05) 100%)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${plan.highlight ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative',
            boxShadow: plan.highlight ? '0 12px 40px rgba(251,191,36,0.1)' : 'none'
          }}>
            {plan.highlight && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#030712',
                padding: '4px 16px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 900, whiteSpace: 'nowrap'
              }}><Zap size={10} style={{ display: 'inline', marginRight: '4px' }} /> MÁS POPULAR</div>
            )}
            
            <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>{plan.ciclo}</p>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, marginTop: '8px' }}>{plan.nombre}</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '16px', marginBottom: '24px' }}>
              <span style={{ color: '#fbbf24', fontSize: '1.2rem', fontWeight: 700 }}>S/.</span>
              <span style={{ color: '#fbbf24', fontSize: '2.5rem', fontWeight: 900 }}>{plan.precio}</span>
            </div>

            <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', margin: 0, padding: 0, listStyle: 'none' }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d1d5db', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} color={plan.highlight ? '#fbbf24' : '#6b7280'} /> {f}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '2rem' }}>
              {user ? (
                <button style={{
                  width: '100%', padding: '12px', borderRadius: '14px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', border: 'none',
                  background: plan.highlight ? 'linear-gradient(135deg,#fbbf24,#d97706)' : 'rgba(255,255,255,0.06)',
                  color: plan.highlight ? '#030712' : '#fff', transition: 'all 0.2s'
                }}>
                  Consultar Plan
                </button>
              ) : (
                <Link to="/login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  width: '100%', padding: '12px', borderRadius: '14px', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none',
                  background: plan.highlight ? 'linear-gradient(135deg,#fbbf24,#d97706)' : 'rgba(255,255,255,0.06)',
                  color: plan.highlight ? '#030712' : '#fff', transition: 'all 0.2s'
                }}>
                  Adquirir Plan <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (user) return content;
  return <div style={{ minHeight: '100vh', background: '#030712' }}>{content}</div>;
}
