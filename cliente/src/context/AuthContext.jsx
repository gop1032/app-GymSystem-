import { createContext, useState, useEffect } from "react";
import { obtenerPerfil, cerrarSesion as cerrarSesionService } from "../services/authService";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargarPerfil() {
    const token = localStorage.getItem("token");

    if (!token) {
      setUsuario(null);
      setCargando(false);
      return;
    }

    try {
      const { data } = await obtenerPerfil();
      // data.rol viene como { nombre: "ADMIN" | "EMPLEADO" } desde el backend
      setUsuario({ ...data, rol: data.rol?.nombre });
    } catch (error) {
      // Token inválido/expirado: el interceptor de axios ya limpia el token y redirige
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPerfil();
  }, []);

  function guardarToken(token) {
    localStorage.setItem("token", token);
    setCargando(true);
    cargarPerfil();
  }

  function cerrarSesion() {
    setUsuario(null);
    cerrarSesionService();
  }

  const value = {
    usuario,
    cargando,
    autenticado: !!usuario,
    esAdmin: usuario?.rol === "ADMIN",
    guardarToken,
    cerrarSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
