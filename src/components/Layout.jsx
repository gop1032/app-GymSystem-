import { Link, Outlet } from "react-router-dom";
import "../styles/layout.css";

function Layout() {
  return (
    <div className="layout">

      <aside className="sidebar">

        <div className="logo">
          <h2>GymSystem</h2>
          <p>Management</p>
        </div>

        <nav>

          <Link to="/">🏠 Inicio</Link>

          <Link to="/clientes">👥 Clientes</Link>

          <Link to="/planes">📋 Planes</Link>

          <Link to="/pagos">💳 Pagos</Link>

          <Link to="/asistencias">📅 Asistencias</Link>

        </nav>

      </aside>

      <main className="content">

        <header className="topbar">

          <h2>GymSystem</h2>

          <input
            type="text"
            placeholder="Buscar..."
          />

        </header>

        <section className="page">

          <Outlet />

        </section>

      </main>

    </div>
  );
}

export default Layout;