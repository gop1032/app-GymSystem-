import { useCallback, useEffect, useState } from 'react'
import api from '../config/api'

export function useRoutines() {
  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)

  const loadRoutines = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/routines')
      setRoutines(data.data || [])
    } finally {
      setLoading(false)
    }
  }, [])

  const createRoutine = async (payload) => {
    const { data } = await api.post('/routines', payload)
    await loadRoutines()
    return data.data
  }

  const updateRoutine = async (id, payload) => {
    const { data } = await api.put(`/routines/${id}`, payload)
    await loadRoutines()
    return data.data
  }

  const deleteRoutine = async (id) => {
    const { data } = await api.delete(`/routines/${id}`)
    await loadRoutines()
    return data.data
  }

  useEffect(() => {
    loadRoutines()
  }, [loadRoutines])

  return { routines, loading, loadRoutines, createRoutine, updateRoutine, deleteRoutine }
}
