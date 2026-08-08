import { useEffect, useState } from "react";
import {
  obtenerEntrenadores,
  obtenerEntrenador,
  crearEntrenador,
  actualizarEntrenador,
  eliminarEntrenador,
} from "../services/entrenadorService";
import useAuth from "../hooks/useAuth";
import "../styles/modulos.css";

const VACIO = { nombre: "", especialidad: "", telefono: "" };

function Entrenadores() {
  const { esAdmin } = useAuth();
  const [entrenadores, setEntrenadores] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [detalle, setDetalle] = useState(null); // entrenador seleccionado + sus alumnos

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const { data } = await obtenerEntrenadores();
    setEntrenadores(data);
  }

  async function verDetalle(id) {
    const { data } = await obtenerEntrenador(id);
    setDetalle(data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editandoId) {
      await actualizarEntrenador(editandoId, form);
    } else {
      await crearEntrenador(form);
    }
    setForm(VACIO);
    setEditandoId(null);
    cargar();
  }

  function handleEditar(ent) {
    setForm({ nombre: ent.nombre, especialidad: ent.especialidad || "", telefono: ent.telefono || "" });
    setEditandoId(ent.id);
  }

  async function handleEliminar(id) {
    if (!confirm("¿Desactivar este entrenador?")) return;
    await eliminarEntrenador(id);
    if (detalle?.id === id) setDetalle(null);
    cargar();
  }

  return (
    <div className="modulo">
      <h1>Entrenadores</h1>
      <p>Registro del staff de entrenamiento y sus clientes asignados.</p>

      {esAdmin && (
        <form className="form-inline" onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
          <input name="especialidad" placeholder="Especialidad (ej: Crossfit, Boxeo)" value={form.especialidad} onChange={handleChange} />
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
          <button type="submit">{editandoId ? "Guardar cambios" : "Registrar entrenador"}</button>
          {editandoId && (
            <button type="button" className="btn-secundario" onClick={() => { setForm(VACIO); setEditandoId(null); }}>
              Cancelar
            </button>
          )}
        </form>
      )}

      <div className="acceso-grid">
        <div className="acceso-panel">
          <h3>Listado</h3>
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Alumnos</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {entrenadores.map((ent) => (
                <tr key={ent.id} onClick={() => verDetalle(ent.id)} style={{ cursor: "pointer" }}>
                  <td>{ent.nombre}</td>
                  <td>{ent.especialidad || "—"}</td>
                  <td>{ent._count?.clientes ?? 0}</td>
                  {esAdmin && (
                    <td>
                      <button onClick={(e) => { e.stopPropagation(); handleEditar(ent); }}>✏️</button>
                      <button onClick={(e) => { e.stopPropagation(); handleEliminar(ent.id); }}>🗑️</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="acceso-panel">
          <h3>{detalle ? `Alumnos de ${detalle.nombre}` : "Selecciona un entrenador"}</h3>

          {detalle ? (
            detalle.clientes?.length > 0 ? (
              <ul className="lista-busqueda">
                {detalle.clientes.map((c) => (
                  <li key={c.id} style={{ cursor: "default" }}>
                    {c.nombre} — DNI {c.dni}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Este entrenador todavía no tiene clientes asignados.</p>
            )
          ) : (
            <p>Haz clic en un entrenador de la lista para ver su roster de alumnos.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Entrenadores;
