import React, { createContext, useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import api, { clearStoredAuth, setStoredAuth } from '../config/api'
import { signInWithGoogleFirebase } from '../config/firebase'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem('gymsystem_token') || sessionStorage.getItem('gymsystem_token')

      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        setStoredAuth(storedToken, true) // ensure axios interceptor picks it up
        const { data } = await api.get('/auth/me')
        setUser(data.data)
        setToken(storedToken)
      } catch (_error) {
        clearStoredAuth()
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [])

  const applyAuth = (payload, remember = true) => {
    const nextToken = payload?.token || null
    const nextUser = payload?.user || null

    if (nextToken) {
      setStoredAuth(nextToken, Boolean(remember))
    }

    setToken(nextToken)
    setUser(nextUser)
    return payload
  }

  const login = async (credentials) => {
    const { remember = true, ...creds } = credentials
    const { data } = await api.post('/auth/login', creds)
    return applyAuth(data.data, remember)
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    return applyAuth(data.data)
  }

  const logout = async () => {
    clearStoredAuth()
    setUser(null)
    setToken(null)
    await Swal.fire({ icon: 'success', title: 'Sesión cerrada', timer: 900, showConfirmButton: false })
  }

  const forgotPassword = async (payload) => {
    const { data } = await api.post('/auth/forgot-password', payload)
    return data.data
  }

  const resetPassword = async (payload) => {
    const { data } = await api.post('/auth/reset-password', payload)
    return data.data
  }

  const loginWithGoogle = async (roleObj = {}) => {
    const firebaseUser = await signInWithGoogleFirebase()
    const { data } = await api.post('/auth/google-login', { ...firebaseUser, ...roleObj })
    return applyAuth(data.data, true)
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    loginWithGoogle,
    logout,
    forgotPassword,
    resetPassword
  }), [loading, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}