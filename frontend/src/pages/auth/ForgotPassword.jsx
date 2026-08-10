import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import AuthLayout from '../../components/auth/AuthLayout'
import { AuthContext } from '../../context/AuthContext'

export default function ForgotPassword() {
  const { forgotPassword } = useContext(AuthContext)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (values) => {
    try {
      const result = await forgotPassword(values)
      await Swal.fire({ icon: 'success', title: 'Solicitud enviada', text: result?.message || 'Revisa tu correo', background: '#111827', color: '#f3f4f6', iconColor: '#fbbf24' })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'No se pudo procesar', text: error?.response?.data?.message || error.message, background: '#111827', color: '#f3f4f6' })
    }
  }

  return (
    <AuthLayout
      title="Recupera tu acceso"
      subtitle="Te enviaremos un enlace de recuperación al correo registrado."
      footer={<span style={{ color: '#9ca3af' }}>¿Recordaste tu contraseña? <Link to="/login" style={{ color: '#fbbf24', fontWeight: 'bold', textDecoration: 'none' }}>Volver al acceso</Link></span>}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '8px' }}>Correo</label>
          <input 
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)', color: '#fff',
              border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
              fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
            }}
            type="email" placeholder="usuario@gymsystem.com" {...register('email', { required: 'El correo es obligatorio' })} 
          />
          {errors.email ? <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email.message}</p> : null}
        </div>

        <button 
          style={{
            width: '100%', padding: '13px',
            background: isSubmitting ? 'rgba(251,191,36,0.5)' : 'linear-gradient(135deg, #fbbf24, #d97706)',
            color: '#030712', fontWeight: 800, fontSize: '0.95rem',
            borderRadius: '12px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 16px rgba(251,191,36,0.25)', transition: 'all 0.2s', marginTop: '8px'
          }}
          type="submit" disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
        </button>
      </form>
    </AuthLayout>
  )
}