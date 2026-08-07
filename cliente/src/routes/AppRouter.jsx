import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../views/Login";
import AuthCallback from "../views/AuthCallback";
import Home from "../views/Home";
import Clientes from "../views/Clientes";
import Planes from "../views/Planes";
import Pagos from "../views/Pagos";
import Asistencias from "../views/Asistencias";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Rutas protegidas: exigen login (Admin o Empleado) */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/asistencias" element={<Asistencias />} />

          {/* Solo Administrador puede crear/editar Planes (regla de negocio definida) */}
          <Route
            path="/planes"
            element={
              <ProtectedRoute rolesPermitidos={["ADMIN"]}>
                <Planes />
              </ProtectedRoute>
            }
          />

          <Route path="/pagos" element={<Pagos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
