import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Uso:
 *   <ProtectedRoute><Home /></ProtectedRoute>                          -> solo exige login
 *   <ProtectedRoute rolesPermitidos={["ADMIN"]}><Planes /></ProtectedRoute>  -> exige login + rol
 */
function ProtectedRoute({ children, rolesPermitidos }) {
  const { autenticado, cargando, usuario } = useAuth();

  if (cargando) {
    return <div className="cargando-auth">Cargando...</div>;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
