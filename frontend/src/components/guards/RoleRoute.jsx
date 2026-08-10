import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

export default function RoleRoute({ roles, children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="route-loading">Validando permisos...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}