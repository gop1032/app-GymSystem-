import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PulseLine from "./PulseLine";
import "../styles/layout.css";

function Layout() {
  const location = useLocation();
  const { usuario, esAdmin, cerrarSesion } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
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

          {/* Solo Administrador ve y accede a Planes */}
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
            className={location.pathname === "/asistencias" ? "active" : ""}
            to="/asistencias"
          >
            📅 Asistencias / Acceso QR
          </Link>

          {esAdmin && (
            <Link
              className={location.pathname === "/usuarios" ? "active" : ""}
              to="/usuarios"
            >
              🔑 Usuarios
            </Link>
          )}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <h2>GymSystem</h2>

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
