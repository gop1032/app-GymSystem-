import { useEffect, useState } from "react";
import { obtenerPlanes, crearPlan, actualizarPlan, eliminarPlan } from "../services/planService";
import "../styles/modulos.css";

const VACIO = { nombre: "", descripcion: "", precio: "", duracionDias: "" };

function Planes() {
  const [planes, setPlanes] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const { data } = await obtenerPlanes();
    setPlanes(data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      precio: Number(form.precio),
      duracionDias: Number(form.duracionDias),
    };

    if (editandoId) {
      await actualizarPlan(editandoId, payload);
    } else {
      await crearPlan(payload);
    }

    setForm(VACIO);
    setEditandoId(null);
    cargar();
  }

  function handleEditar(plan) {
    setForm({
      nombre: plan.nombre,
      descripcion: plan.descripcion || "",
      precio: plan.precio,
      duracionDias: plan.duracionDias,
    });
    setEditandoId(plan.id);
  }

  async function handleEliminar(id) {
    if (!confirm("¿Desactivar este plan?")) return;
    await eliminarPlan(id);
    cargar();
  }

  return (
    <div className="modulo">
      <h1>Planes</h1>

      <form className="form-inline" onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre (ej: Mensual)" value={form.nombre} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción (opcional)" value={form.descripcion} onChange={handleChange} />
        <input name="precio" type="number" step="0.01" placeholder="Precio S/." value={form.precio} onChange={handleChange} required />
        <input name="duracionDias" type="number" placeholder="Duración (días)" value={form.duracionDias} onChange={handleChange} required />
        <button type="submit">{editandoId ? "Guardar cambios" : "Crear plan"}</button>
        {editandoId && (
          <button type="button" className="btn-secundario" onClick={() => { setForm(VACIO); setEditandoId(null); }}>
            Cancelar
          </button>
        )}
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {planes.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>S/. {p.precio}</td>
              <td>{p.duracionDias} días</td>
              <td>{p.activo ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => handleEditar(p)}>✏️</button>
                <button onClick={() => handleEliminar(p.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Planes;
