import { useState } from "react";
import "../styles/login.css";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const ingresar = (e) => {
    e.preventDefault();

    console.log({
      correo,
      password,
    });
  };

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

            <li>Registro de Asistencias</li>
          </ul>
        </div>
      </div>

      <div className="login-right">
        <form className="login-card" onSubmit={ingresar}>
          <h2>Iniciar Sesión</h2>

          <p>Ingrese sus credenciales</p>

          <label>Correo electrónico</label>

          <input
            type="email"
            placeholder="admin@gym.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <label>Contraseña</label>

          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="recordar">
            <input type="checkbox" />

            <span>Recordarme</span>
          </div>

          <button>Iniciar Sesión</button>

          <small>GymSystem © 2026</small>
        </form>
      </div>
    </div>
  );
}

export default Login;
