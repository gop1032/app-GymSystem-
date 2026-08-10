import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import RoleRoute from '../components/guards/RoleRoute'
import ProtectedRoute from '../components/guards/ProtectedRoute'
import Dashboard from '../pages/Dashboard'
import MainLayout from '../components/layout/MainLayout'
import ForgotPassword from '../pages/auth/ForgotPassword'
import Landing from '../pages/Landing'
import Login from '../pages/auth/Login'
import Inventory from '../pages/Inventory'
import Register from '../pages/auth/Register'
import ResetPassword from '../pages/auth/ResetPassword'
import Routines from '../pages/Routines'
import Trainers from '../pages/Trainers'
import Clientes from '../pages/Clientes'
import Asistencias from '../pages/Asistencias'
import Pagos from '../pages/Pagos'
import Planes from '../pages/Planes'
import Reports from '../pages/Reports'
import Schedules from '../pages/Schedules'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/planes" element={<Planes />} />
      
      {/* Rutas protegidas (Todos los logueados) */}
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/schedules" element={<ProtectedRoute><MainLayout><Schedules /></MainLayout></ProtectedRoute>} />

      {/* Rutas con restricción de roles */}
      <Route
        path="/trainers"
        element={(
          <ProtectedRoute>
            <RoleRoute roles={['ADMIN', 'CLIENT']}>
              <MainLayout>
                <Trainers />
              </MainLayout>
            </RoleRoute>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/routines"
        element={(
          <ProtectedRoute>
            <RoleRoute roles={['ADMIN', 'TRAINER', 'CLIENT', 'NUTRITIONIST']}>
              <MainLayout>
                <Routines />
              </MainLayout>
            </RoleRoute>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/inventory"
        element={(
          <ProtectedRoute>
            <RoleRoute roles={['ADMIN', 'RECEPTIONIST', 'CLIENT', 'NUTRITIONIST']}>
              <MainLayout>
                <Inventory />
              </MainLayout>
            </RoleRoute>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/clientes"
        element={(
          <ProtectedRoute>
            <RoleRoute roles={['ADMIN', 'RECEPTIONIST', 'TRAINER', 'NUTRITIONIST', 'ACCOUNTANT']}>
              <MainLayout>
                <Clientes />
              </MainLayout>
            </RoleRoute>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/asistencias"
        element={(
          <ProtectedRoute>
            <RoleRoute roles={['ADMIN', 'RECEPTIONIST']}>
              <MainLayout>
                <Asistencias />
              </MainLayout>
            </RoleRoute>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/pagos"
        element={(
          <ProtectedRoute>
            <RoleRoute roles={['ADMIN', 'RECEPTIONIST', 'ACCOUNTANT']}>
              <MainLayout>
                <Pagos />
              </MainLayout>
            </RoleRoute>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/reports"
        element={(
          <ProtectedRoute>
            <RoleRoute roles={['ADMIN', 'ACCOUNTANT']}>
              <MainLayout>
                <Reports />
              </MainLayout>
            </RoleRoute>
          </ProtectedRoute>
        )}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
