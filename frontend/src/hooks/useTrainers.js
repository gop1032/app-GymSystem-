import { useCallback, useEffect, useState } from 'react'
import api from '../config/api'

export function useTrainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadTrainers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/trainers')
      setTrainers(data.data || [])
    } finally {
      setLoading(false)
    }
  }, [])

  const createTrainer = async (payload) => {
    const { data } = await api.post('/trainers', payload)
    await loadTrainers()
    return data.data
  }

  const updateTrainer = async (id, payload) => {
    const { data } = await api.put(`/trainers/${id}`, payload)
    await loadTrainers()
    return data.data
  }

  const deleteTrainer = async (id) => {
    const { data } = await api.delete(`/trainers/${id}`)
    await loadTrainers()
    return data.data
  }

  useEffect(() => {
    loadTrainers()
  }, [loadTrainers])

  return { trainers, loading, loadTrainers, createTrainer, updateTrainer, deleteTrainer }
}
