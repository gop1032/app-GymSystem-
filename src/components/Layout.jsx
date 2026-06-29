import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/layout.css";

function Layout() {

    const location = useLocation();

    return (

        <div className="layout">

            <aside className="sidebar">

                <div className="logo">

                    <h1>GymSystem</h1>

                    <span>Management</span>

                </div>

                <nav>

                    <Link
                        className={location.pathname === "/" ? "active" : ""}
                        to="/"
                    >
                        🏠 Inicio
                    </Link>

                    <Link
                        className={location.pathname === "/clientes" ? "active" : ""}
                        to="/clientes"
                    >
                        👥 Clientes
                    </Link>

                    <Link
                        className={location.pathname === "/planes" ? "active" : ""}
                        to="/planes"
                    >
                        📋 Planes
                    </Link>

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
                        📅 Asistencias
                    </Link>

                </nav>

            </aside>

            <div className="main">

                <header className="topbar">

                    <h2>GymSystem</h2>

                    <div className="topbar-right">

                        <input
                            type="text"
                            placeholder="Buscar..."
                        />

                        <div className="avatar">

                            A

                        </div>

                    </div>

                </header>

                <section className="contenido">

                    <Outlet/>

                </section>

            </div>

        </div>

    );

}

export default Layout;