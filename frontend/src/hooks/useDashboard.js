import { useCallback, useEffect, useState } from 'react'
import api from '../config/api'

export function useDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/reports/dashboard')
      setSummary(data.data)
    } catch (e) {
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { summary, loading, reload: load }
}
