import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import AuthLayout from '../../components/auth/AuthLayout'
import { AuthContext } from '../../context/AuthContext'

export default function ResetPassword() {
  const { resetPassword } = useContext(AuthContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { token } })

  const onSubmit = async (values) => {
    try {
      await resetPassword(values)
      await Swal.fire({ icon: 'success', title: 'Contraseña actualizada', timer: 1200, showConfirmButton: false, background: '#111827', color: '#f3f4f6', iconColor: '#fbbf24' })
      navigate('/login', { replace: true })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'No se pudo restablecer', text: error?.response?.data?.message || error.message, background: '#111827', color: '#f3f4f6' })
    }
  }

  return (
    <AuthLayout
      title="Establece una nueva contraseña"
      subtitle="Ingresa el token recibido y define tu nueva clave de acceso."
      footer={<span style={{ color: '#9ca3af' }}>¿Volver al acceso? <Link to="/login" style={{ color: '#fbbf24', fontWeight: 'bold', textDecoration: 'none' }}>Iniciar sesión</Link></span>}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '8px' }}>Token</label>
          <input 
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)', color: '#fff',
              border: errors.token ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
              fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
            }}
            type="text" placeholder="Pega aquí el token recibido" {...register('token', { required: 'El token es obligatorio' })} 
          />
          {errors.token ? <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.token.message}</p> : null}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '8px' }}>Nueva contraseña</label>
          <input 
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)', color: '#fff',
              border: errors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
              fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
            }}
            type="password" placeholder="Mínimo 6 caracteres" {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} 
          />
          {errors.password ? <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.password.message}</p> : null}
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
          {isSubmitting ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </AuthLayout>
  )
}