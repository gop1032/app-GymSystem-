import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PulseLine from "./PulseLine";
import RelojEnVivo from "./RelojEnVivo";
import "../styles/layout.css";

function Layout() {
  const location = useLocation();
  const { usuario, esAdmin, cerrarSesion } = useAuth();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // Cierra el panel automáticamente al navegar a otra sección (celular/tablet)
  useEffect(() => {
    setSidebarAbierto(false);
  }, [location.pathname]);

  return (
    <div className="layout">
      {/* Fondo oscuro detrás del panel cuando está abierto en pantallas chicas */}
      {sidebarAbierto && (
        <div className="sidebar-overlay" onClick={() => setSidebarAbierto(false)} />
      )}

      <aside className={`sidebar ${sidebarAbierto ? "sidebar-abierta" : ""}`}>
        <div className="logo">
          <h1>GYMSYSTEM</h1>
          <span>Control de acceso</span>
          <PulseLine />
        </div>

        <nav>
          <Link className={location.pathname === "/" ? "active" : ""} to="/">
            🏠 Inicio
          </Link>

          <Link
            className={location.pathname === "/clientes" ? "active" : ""}
            to="/clientes"
          >
            👥 Clientes
          </Link>

          <Link
            className={location.pathname === "/entrenadores" ? "active" : ""}
            to="/entrenadores"
          >
            🏋️ Entrenadores
          </Link>

          {esAdmin && (
            <Link
              className={location.pathname === "/planes" ? "active" : ""}
              to="/planes"
            >
              📋 Planes
            </Link>
          )}

          <Link
            className={location.pathname === "/pagos" ? "active" : ""}
            to="/pagos"
          >
            💳 Pagos
          </Link>

          <Link
            className={location.pathname === "/maquinas" ? "active" : ""}
            to="/maquinas"
          >
            🏋️‍♂️ Equipamiento
          </Link>

          <Link
            className={location.pathname === "/asistencias" ? "active" : ""}
            to="/asistencias"
          >
            📅 Asistencias / Acceso QR
          </Link>

          <Link
            className={location.pathname === "/reportes" ? "active" : ""}
            to="/reportes"
          >
            📈 Reportes
          </Link>

          {esAdmin && (
            <Link
              className={location.pathname === "/usuarios" ? "active" : ""}
              to="/usuarios"
            >
              🔑 Usuarios
            </Link>
          )}

          {esAdmin && (
            <Link
              className={location.pathname === "/configuracion" ? "active" : ""}
              to="/configuracion"
            >
              ⚙️ Configuración
            </Link>
          )}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-izquierda">
            <button
              className="btn-hamburguesa"
              onClick={() => setSidebarAbierto(!sidebarAbierto)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <h2>GymSystem</h2>
          </div>

          <RelojEnVivo />

          <div className="topbar-right">
            <input type="text" placeholder="Buscar..." />

            <span className="usuario-nombre">
              {usuario?.nombre} <small>({usuario?.rol})</small>
            </span>

            <div className="avatar" title={usuario?.correo}>
              {usuario?.nombre?.charAt(0).toUpperCase() || "?"}
            </div>

            <button className="btn-logout" onClick={cerrarSesion} title="Cerrar sesión">
              Salir
            </button>
          </div>
        </header>

        <section className="contenido">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default Layout;
