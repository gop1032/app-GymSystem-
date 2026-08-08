import { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerRoles,
} from "../services/usuarioService";
import useAuth from "../hooks/useAuth";
import "../styles/modulos.css";

const VACIO = { nombre: "", correo: "", rolId: "" };

function Usuarios() {
  const { usuario: yo } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState("");

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const [resUsuarios, resRoles] = await Promise.all([obtenerUsuarios(), obtenerRoles()]);
    setUsuarios(resUsuarios.data);
    setRoles(resRoles.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await crearUsuario(form);
      setForm(VACIO);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo registrar el usuario.");
    }
  }

  async function toggleActivo(u) {
    await actualizarUsuario(u.id, { activo: !u.activo });
    cargar();
  }

  async function cambiarRol(u, rolId) {
    await actualizarUsuario(u.id, { rolId });
    cargar();
  }

  async function handleEliminar(id) {
    if (!confirm("¿Desactivar este usuario? No podrá volver a iniciar sesión.")) return;
    try {
      await eliminarUsuario(id);
      cargar();
    } catch (err) {
      alert(err.response?.data?.mensaje || "No se pudo desactivar.");
    }
  }

  return (
    <div className="modulo">
      <h1>Gestión de Usuarios</h1>
      <p>
        Registra aquí a los Administradores/Empleados que podrán loguearse con Google.
        Solo necesitas su nombre y correo de Gmail — el sistema los vincula
        automáticamente la primera vez que inicien sesión.
      </p>

      <form className="form-inline" onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} required />
        <input name="correo" type="email" placeholder="Correo de Gmail" value={form.correo} onChange={handleChange} required />
        <select name="rolId" value={form.rolId} onChange={handleChange} required>
          <option value="">Selecciona un rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>
        <button type="submit">Registrar usuario</button>
      </form>

      {error && <div className="login-error" style={{ marginBottom: 20 }}>{error}</div>}

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Vinculado con Google</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>
                <select value={u.rolId} onChange={(e) => cambiarRol(u, e.target.value)} disabled={u.id === yo?.id}>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </td>
              <td>{u.googleId ? "✅ Sí" : "— Aún no inicia sesión"}</td>
              <td>{u.activo ? "Activo" : "Desactivado"}</td>
              <td>
                <button onClick={() => toggleActivo(u)} disabled={u.id === yo?.id}>
                  {u.activo ? "Desactivar" : "Reactivar"}
                </button>
                <button onClick={() => handleEliminar(u.id)} disabled={u.id === yo?.id}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;
