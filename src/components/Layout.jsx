import { Link, Outlet } from "react-router-dom";

function Layout() {
    return (
        <div>
            <h1>GymSystem</h1>

            <nav>
                <Link to="/">Inicio</Link>
                <br />

                <Link to="/clientes">Clientes</Link>
                <br />

                <Link to="/planes">Planes</Link>
                <br />

                <Link to="/pagos">Pagos</Link>
                <br />

                <Link to="/asistencias">Asistencias</Link>
            </nav>

            <hr />

            <Outlet />
        </div>
    );
}

export default Layout;