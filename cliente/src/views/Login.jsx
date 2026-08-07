import { useSearchParams } from "react-router-dom";
import { iniciarLoginGoogle } from "../services/authService";
import "../styles/login.css";

const MENSAJES_ERROR = {
  no_autorizado:
    "Ese correo no está registrado en GymSystem. Pide al administrador que te registre.",
  sin_token: "No se pudo completar el inicio de sesión. Intenta de nuevo.",
};

function Login() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="login-container">
      <div className="login-left">
        <div>
          <h1>GymSystem</h1>
          <h3>Management</h3>
          <p>Sistema de Gestión para Gimnasios</p>

          <ul>
            <li>Gestión de Clientes</li>
            <li>Administración de Planes</li>
            <li>Control de Pagos</li>
            <li>Control de acceso con QR</li>
          </ul>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          <p>Acceso exclusivo para Administradores y Empleados</p>

          {error && <div className="login-error">{MENSAJES_ERROR[error] || "Ocurrió un error al iniciar sesión."}</div>}

          <button type="button" className="btn-google" onClick={iniciarLoginGoogle}>
            <span aria-hidden="true">🔐</span>
            Iniciar sesión con Google
          </button>

          <small>GymSystem © 2026</small>
        </div>
      </div>
    </div>
  );
}

export default Login;
