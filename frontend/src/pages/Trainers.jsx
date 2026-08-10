import React, { useMemo, useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useTrainers } from '../hooks/useTrainers'
import { AuthContext } from '../context/AuthContext'
import { Dumbbell, Edit2, Trash2, Plus, Users, ClipboardList } from 'lucide-react'

const initialValues = { specialty: '', bio: '', userId: '', isActive: true }

export default function Trainers() {
  const { user } = useContext(AuthContext)
  const canManage = user?.role === 'ADMIN'

  const { trainers, loading, createTrainer, updateTrainer, deleteTrainer } = useTrainers()
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: initialValues })

  const isEditing = Boolean(selectedTrainer)
  const submitLabel = useMemo(() => (isEditing ? 'Actualizar' : 'Guardar'), [isEditing])

  const onSubmit = async (values) => {
    if (!canManage) return
    try {
      const payload = { ...values, isActive: values.isActive === 'true' || values.isActive === true }
      if (isEditing) {
        await updateTrainer(selectedTrainer.id, payload)
        Swal.fire({ icon: 'success', title: 'Entrenador actualizado', timer: 1200, showConfirmButton: false, background: '#111827', color: '#fff' })
      } else {
        await createTrainer(payload)
        Swal.fire({ icon: 'success', title: 'Entrenador creado', timer: 1200, showConfirmButton: false, background: '#111827', color: '#fff' })
      }
      setSelectedTrainer(null)
      setShowForm(false)
      reset(initialValues)
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error?.response?.data?.message || error.message, background: '#111827', color: '#fff' })
    }
  }

  const handleEdit = (trainer) => {
    setSelectedTrainer(trainer)
    setShowForm(true)
    reset({
      specialty: trainer.specialty || '',
      bio: trainer.bio || '',
      userId: trainer.userId || '',
      isActive: trainer.isActive
    })
  }

  const handleDelete = async (trainer) => {
    const result = await Swal.fire({
      title: 'Desactivar entrenador',
      text: `¿Deseas desactivar a ${trainer.specialty}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      background: '#111827', color: '#fff',
      confirmButtonColor: '#ef4444'
    })

    if (!result.isConfirmed) return

    try {
      await deleteTrainer(trainer.id)
      Swal.fire({ icon: 'success', title: 'Entrenador desactivado', timer: 1000, showConfirmButton: false, background: '#111827', color: '#fff' })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error?.response?.data?.message || error.message, background: '#111827', color: '#fff' })
    }
  }

  const inputS = { width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', boxSizing: 'border-box' }
  const labelS = { color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', display: 'block' }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>Gestión de Equipo</p>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>Entrenadores</h1>
        </div>
        {canManage && (
          <button
            onClick={() => { setShowForm(s => !s); setSelectedTrainer(null); reset(initialValues) }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px',
              background: showForm ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#fbbf24,#d97706)',
              color: showForm ? '#9ca3af' : '#030712', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer'
            }}
          >
            <Plus size={18} /> {showForm ? 'Cancelar' : 'Nuevo Entrenador'}
          </button>
        )}
      </div>

      {canManage && showForm && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>{isEditing ? '✏️ Editar entrenador' : '➕ Nuevo entrenador'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div><label style={labelS}>Especialidad</label><input style={inputS} {...register('specialty', { required: true })} /></div>
              <div><label style={labelS}>Usuario Vinculado (ID)</label><input style={inputS} {...register('userId')} /></div>
              <div><label style={labelS}>Estado</label>
                <select style={inputS} {...register('isActive')}>
                  <option value={true}>Activo</option>
                  <option value={false}>Inactivo</option>
                </select>
              </div>
            </div>
            <div><label style={labelS}>Bio</label><textarea style={{ ...inputS, minHeight: '60px' }} {...register('bio')} /></div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" disabled={isSubmitting} style={{ padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#030712', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                {isSubmitting ? '...' : submitLabel}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ color: '#9ca3af', padding: '2rem' }}>Cargando entrenadores...</div>
        ) : trainers.filter(t => canManage || t.isActive).length === 0 ? (
          <div style={{ color: '#6b7280', padding: '3rem', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>No hay entrenadores registrados.</div>
        ) : (
          trainers.filter(t => canManage || t.isActive).map((trainer) => (
            <div key={trainer.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '46px', height: '46px', background: 'rgba(251,191,36,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Dumbbell size={24} color="#fbbf24" />
                  </div>
                  <div>
                    <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{trainer.specialty}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '2px 0 0' }}>Usuario ID: {trainer.userId || 'N/A'}</p>
                  </div>
                </div>
                {canManage && (
                  <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 800, background: trainer.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: trainer.isActive ? '#10b981' : '#6b7280' }}>
                    {trainer.isActive ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                )}
              </div>
              
              <div style={{ flex: 1, marginBottom: '20px' }}>
                <p style={{ color: '#d1d5db', fontSize: '0.85rem', lineHeight: 1.5 }}>{trainer.bio || <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Sin biografía</span>}</p>
              </div>

              {canManage && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="#6b7280" />
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Clientes</p>
                      <p style={{ color: '#e5e7eb', fontSize: '0.9rem', fontWeight: 800, marginTop: '2px' }}>{trainer._count?.clients ?? 0}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClipboardList size={16} color="#6b7280" />
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Rutinas</p>
                      <p style={{ color: '#e5e7eb', fontSize: '0.9rem', fontWeight: 800, marginTop: '2px' }}>{trainer._count?.routines ?? 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {canManage && (
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button onClick={() => handleEdit(trainer)} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Edit2 size={16} /> Editar</button>
                  <button onClick={() => handleDelete(trainer)} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Trash2 size={16} /> Desactivar</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
