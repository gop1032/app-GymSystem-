import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gymsystem_token') || sessionStorage.getItem('gymsystem_token')

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function setStoredAuth(token, persist = true) {
  if (persist) {
    localStorage.setItem('gymsystem_token', token)
  } else {
    sessionStorage.setItem('gymsystem_token', token)
  }
}

export function clearStoredAuth() {
  localStorage.removeItem('gymsystem_token')
  sessionStorage.removeItem('gymsystem_token')
}

export default api