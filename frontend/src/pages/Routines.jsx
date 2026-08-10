import React, { useEffect, useMemo, useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import api from '../config/api'
import { useRoutines } from '../hooks/useRoutines'
import { AuthContext } from '../context/AuthContext'
import { ClipboardList, Edit2, Trash2, Eye, Plus, Dumbbell } from 'lucide-react'

const initialValues = { name: '', description: '', clientId: '', trainerId: '', exercisesJson: '[]' }

export default function Routines() {
  const { user } = useContext(AuthContext)
  const isClient = user?.role === 'CLIENT'
  
  const { routines, loading, createRoutine, updateRoutine, deleteRoutine } = useRoutines()
  const [clients, setClients] = useState([])
  const [trainers, setTrainers] = useState([])
  const [selectedRoutine, setSelectedRoutine] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: initialValues })

  const isEditing = Boolean(selectedRoutine)
  const submitLabel = useMemo(() => (isEditing ? 'Actualizar' : 'Guardar'), [isEditing])

  useEffect(() => {
    if (isClient) return
    const loadCatalogs = async () => {
      const [{ data: clientsData }, { data: trainersData }] = await Promise.all([
        api.get('/clients'),
        api.get('/trainers')
      ])
      setClients(clientsData.data || [])
      setTrainers(trainersData.data || [])
    }
    loadCatalogs()
  }, [isClient])

  const onSubmit = async (values) => {
    try {
      const exercises = JSON.parse(values.exercisesJson || '[]')
      const payload = { name: values.name, description: values.description, clientId: values.clientId, trainerId: values.trainerId, exercises }

      if (isEditing) {
        await updateRoutine(selectedRoutine.id, payload)
        Swal.fire({ icon: 'success', title: 'Rutina actualizada', timer: 1200, showConfirmButton: false, background: '#111827', color: '#fff' })
      } else {
        await createRoutine(payload)
        Swal.fire({ icon: 'success', title: 'Rutina creada', timer: 1200, showConfirmButton: false, background: '#111827', color: '#fff' })
      }

      setSelectedRoutine(null)
      setShowForm(false)
      reset(initialValues)
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error?.response?.data?.message || error.message, background: '#111827', color: '#fff' })
    }
  }

  const handleEdit = (routine) => {
    setSelectedRoutine(routine)
    setShowForm(true)
    reset({
      name: routine.name || '',
      description: routine.description || '',
      clientId: routine.clientId || '',
      trainerId: routine.trainerId || '',
      exercisesJson: JSON.stringify(routine.exercises || [], null, 2)
    })
  }

  const handleDelete = async (routine) => {
    const result = await Swal.fire({
      title: 'Eliminar rutina',
      text: `¿Eliminar ${routine.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      background: '#111827', color: '#fff',
      confirmButtonColor: '#ef4444'
    })

    if (!result.isConfirmed) return

    try {
      await deleteRoutine(routine.id)
      Swal.fire({ icon: 'success', title: 'Rutina eliminada', timer: 1000, showConfirmButton: false, background: '#111827', color: '#fff' })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error?.response?.data?.message || error.message, background: '#111827', color: '#fff' })
    }
  }

  const showExercises = (routine) => {
    const list = routine.exercises?.map(ex => `<div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.1);"><strong style="color: #fbbf24">${ex.name}</strong><br/><span style="color: #9ca3af; font-size: 0.85rem">${ex.sets} series x ${ex.reps} reps (Descanso: ${ex.restSeconds}s)</span></div>`).join('') || '<p style="color: #9ca3af">No hay ejercicios registrados</p>'
    Swal.fire({
      title: `Ejercicios`,
      html: `<div style="text-align: left; margin-top: 16px;">${list}</div>`,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#fbbf24',
      background: '#111827', color: '#fff'
    })
  }

  const inputS = { width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', boxSizing: 'border-box' }
  const labelS = { color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', display: 'block' }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>Gestión de Entrenamiento</p>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>{isClient ? 'Mi Rutina' : 'Rutinas'}</h1>
        </div>
        {!isClient && (
          <button
            onClick={() => { setShowForm(s => !s); setSelectedRoutine(null); reset(initialValues) }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px',
              background: showForm ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#fbbf24,#d97706)',
              color: showForm ? '#9ca3af' : '#030712', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer'
            }}
          >
            <Plus size={18} /> {showForm ? 'Cancelar' : 'Nueva Rutina'}
          </button>
        )}
      </div>

      {showForm && !isClient && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>{isEditing ? '✏️ Editar rutina' : '➕ Nueva rutina'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div><label style={labelS}>Nombre</label><input style={inputS} {...register('name', { required: true })} /></div>
              <div><label style={labelS}>Cliente</label>
                <select style={inputS} {...register('clientId', { required: true })}>
                  <option value="">Seleccionar</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label style={labelS}>Entrenador</label>
                <select style={inputS} {...register('trainerId', { required: true })}>
                  <option value="">Seleccionar</option>
                  {trainers.map(t => <option key={t.id} value={t.id}>{t.specialty}</option>)}
                </select>
              </div>
            </div>
            <div><label style={labelS}>Descripción</label><textarea style={{ ...inputS, minHeight: '60px' }} {...register('description')} /></div>
            <div><label style={labelS}>Ejercicios (JSON)</label><textarea style={{ ...inputS, minHeight: '120px', fontFamily: 'monospace', fontSize: '0.8rem' }} {...register('exercisesJson')} /></div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" disabled={isSubmitting} style={{ padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#030712', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                {isSubmitting ? '...' : submitLabel}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ color: '#9ca3af', padding: '2rem' }}>Cargando rutinas...</div>
        ) : routines.filter(r => !isClient || r.client?.email === user.email).length === 0 ? (
          <div style={{ color: '#6b7280', padding: '3rem', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>No hay rutinas registradas.</div>
        ) : (
          routines.filter(r => !isClient || r.client?.email === user.email).map((routine) => (
            <div key={routine.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(251,191,36,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Dumbbell size={20} color="#fbbf24" />
                </div>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{routine.name}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '2px 0 0' }}>{routine._count?.exercises ?? routine.exercises?.length ?? 0} ejercicios</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Cliente</p>
                  <p style={{ color: '#e5e7eb', fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{routine.client?.name || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Entrenador</p>
                  <p style={{ color: '#e5e7eb', fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{routine.trainer?.specialty || 'N/A'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button onClick={() => showExercises(routine)} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Eye size={16} /> Ver Detalles
                </button>
                {!isClient && (
                  <>
                    <button onClick={() => handleEdit(routine)} style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', color: '#3b82f6', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(routine)} style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
