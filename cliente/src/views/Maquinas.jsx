import { useEffect, useState } from "react";
import {
  obtenerMaquinas,
  obtenerResumenMaquinas,
  crearMaquina,
  actualizarMaquina,
  eliminarMaquina,
} from "../services/maquinaService";
import useAuth from "../hooks/useAuth";
import "../styles/clientes.css";
import "../styles/modulos.css";

const VACIO = { nombre: "", tipo: "CARDIO", cantidad: 1, estado: "OPERATIVA", imagenUrl: "" };

const ETIQUETAS_TIPO = {
  CARDIO: "Cardio",
  FUERZA: "Fuerza",
  PESO_LIBRE: "Peso libre",
  FUNCIONAL: "Funcional",
  OTRO: "Otro",
};

// Representación visual automática por tipo — sin depender de subir archivos.
const EMOJI_TIPO = {
  CARDIO: "🏃",
  FUERZA: "🏋️",
  PESO_LIBRE: "🔩",
  FUNCIONAL: "🤸",
  OTRO: "⚙️",
};

const ETIQUETAS_ESTADO = {
  OPERATIVA: "Operativa",
  MANTENIMIENTO: "En mantenimiento",
  FUERA_DE_SERVICIO: "Fuera de servicio",
};

function Maquinas() {
  const { esAdmin } = useAuth();
  const [maquinas, setMaquinas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const [resMaquinas, resResumen] = await Promise.all([obtenerMaquinas(), obtenerResumenMaquinas()]);
    setMaquinas(resMaquinas.data);
    setResumen(resResumen.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, cantidad: Number(form.cantidad) };

    if (editandoId) {
      await actualizarMaquina(editandoId, payload);
    } else {
      await crearMaquina(payload);
    }

    setForm(VACIO);
    setEditandoId(null);
    cargar();
  }

  function handleEditar(m) {
    setForm({ nombre: m.nombre, tipo: m.tipo, cantidad: m.cantidad, estado: m.estado, imagenUrl: m.imagenUrl || "" });
    setEditandoId(m.id);
  }

  async function handleEliminar(id) {
    if (!confirm("¿Eliminar esta máquina del inventario?")) return;
    await eliminarMaquina(id);
    cargar();
  }

  return (
    <div className="modulo">
      <h1>Equipamiento</h1>
      <p>Inventario de máquinas y equipos del gimnasio.</p>

      {resumen && (
        <div className="cards-clientes" style={{ marginBottom: 24 }}>
          <div className="card">
            <h4>Modelos distintos</h4>
            <h2>{resumen.totalModelos}</h2>
          </div>
          <div className="card">
            <h4>Unidades totales</h4>
            <h2>{resumen.totalUnidades}</h2>
          </div>
          <div className="card">
            <h4>Tipo con más equipos</h4>
            <h2 style={{ fontSize: 20 }}>
              {Object.entries(resumen.porTipo).sort((a, b) => b[1] - a[1])[0]?.[0]
                ? ETIQUETAS_TIPO[Object.entries(resumen.porTipo).sort((a, b) => b[1] - a[1])[0][0]]
                : "—"}
            </h2>
          </div>
        </div>
      )}

      {esAdmin && (
        <form className="form-inline" onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre (ej: Caminadora)" value={form.nombre} onChange={handleChange} required />
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            {Object.entries(ETIQUETAS_TIPO).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>{etiqueta}</option>
            ))}
          </select>
          <input name="cantidad" type="number" min="1" placeholder="Cantidad" value={form.cantidad} onChange={handleChange} required />
          <select name="estado" value={form.estado} onChange={handleChange}>
            {Object.entries(ETIQUETAS_ESTADO).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>{etiqueta}</option>
            ))}
          </select>
          <input
            name="imagenUrl"
            placeholder="Link a foto (opcional)"
            value={form.imagenUrl}
            onChange={handleChange}
            style={{ minWidth: 200 }}
          />
          <button type="submit">{editandoId ? "Guardar cambios" : "Agregar máquina"}</button>
          {editandoId && (
            <button type="button" className="btn-secundario" onClick={() => { setForm(VACIO); setEditandoId(null); }}>
              Cancelar
            </button>
          )}
        </form>
      )}

      <table className="tabla">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Estado</th>
            {esAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {maquinas.map((m) => (
            <tr key={m.id}>
              <td>
                {m.imagenUrl ? (
                  <img src={m.imagenUrl} alt={m.nombre} className="miniatura-maquina" />
                ) : (
                  <span className="emoji-maquina">{EMOJI_TIPO[m.tipo]}</span>
                )}
              </td>
              <td>{m.nombre}</td>
              <td>{ETIQUETAS_TIPO[m.tipo]}</td>
              <td>{m.cantidad}</td>
              <td>
                <span className={`badge ${m.estado === "OPERATIVA" ? "activo" : "inactivo"}`}>
                  {ETIQUETAS_ESTADO[m.estado]}
                </span>
              </td>
              {esAdmin && (
                <td>
                  <button onClick={() => handleEditar(m)}>✏️</button>
                  <button onClick={() => handleEliminar(m.id)}>🗑️</button>
                </td>
              )}
            </tr>
          ))}
          {maquinas.length === 0 && (
            <tr>
              <td colSpan={6}>Todavía no hay máquinas registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Maquinas;
