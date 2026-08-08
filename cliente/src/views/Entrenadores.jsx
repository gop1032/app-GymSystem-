import { useEffect, useState } from "react";
import {
  obtenerEntrenadores,
  obtenerEntrenador,
  crearEntrenador,
  actualizarEntrenador,
  eliminarEntrenador,
  agregarHorario,
  eliminarHorario,
} from "../services/entrenadorService";
import useAuth from "../hooks/useAuth";
import "../styles/modulos.css";

const VACIO = { nombre: "", tipo: "INSTRUCTOR", especialidad: "", telefono: "", disponibilidad: "" };
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function etiquetaTipo(tipo) {
  return tipo === "PERSONALIZADO" ? "Entrenador Personal" : "Instructor de Gimnasio";
}

function Entrenadores() {
  const { esAdmin } = useAuth();
  const [entrenadores, setEntrenadores] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [detalle, setDetalle] = useState(null); // entrenador seleccionado (con alumnos + horarios)
  const [formHorario, setFormHorario] = useState({ diaSemana: "1", horaInicio: "08:00", horaFin: "12:00" });

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
    setForm({
      nombre: ent.nombre,
      tipo: ent.tipo,
      especialidad: ent.especialidad || "",
      telefono: ent.telefono || "",
      disponibilidad: ent.disponibilidad || "",
    });
    setEditandoId(ent.id);
  }

  async function handleEliminar(id) {
    if (!confirm("¿Desactivar este entrenador?")) return;
    await eliminarEntrenador(id);
    if (detalle?.id === id) setDetalle(null);
    cargar();
  }

  async function handleAgregarHorario(e) {
    e.preventDefault();
    await agregarHorario(detalle.id, {
      diaSemana: Number(formHorario.diaSemana),
      horaInicio: formHorario.horaInicio,
      horaFin: formHorario.horaFin,
    });
    verDetalle(detalle.id); // refresca el detalle con el nuevo horario
  }

  async function handleEliminarHorario(horarioId) {
    await eliminarHorario(horarioId);
    verDetalle(detalle.id);
  }

  return (
    <div className="modulo">
      <h1>Entrenadores</h1>
      <p>Registro del staff de entrenamiento, su tipo, horarios y alumnos asignados.</p>

      {esAdmin && (
        <form className="form-inline" onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="INSTRUCTOR">Instructor de Gimnasio</option>
            <option value="PERSONALIZADO">Entrenador Personal</option>
          </select>
          <input name="especialidad" placeholder="Especialidad (ej: Crossfit, Boxeo)" value={form.especialidad} onChange={handleChange} />
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
          {form.tipo === "PERSONALIZADO" && (
            <input
              name="disponibilidad"
              placeholder="Disponibilidad general (ej: coordina por WhatsApp, tardes)"
              value={form.disponibilidad}
              onChange={handleChange}
              style={{ minWidth: 280 }}
            />
          )}
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
                <th>Tipo</th>
                <th>Alumnos</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {entrenadores.map((ent) => (
                <tr key={ent.id} onClick={() => verDetalle(ent.id)} style={{ cursor: "pointer" }}>
                  <td>{ent.nombre}</td>
                  <td>
                    <span className={`badge-tipo ${ent.tipo === "PERSONALIZADO" ? "personal" : "instructor"}`}>
                      {etiquetaTipo(ent.tipo)}
                    </span>
                  </td>
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
          <h3>{detalle ? detalle.nombre : "Selecciona un entrenador"}</h3>

          {detalle ? (
            <>
              <p style={{ marginBottom: 14 }}>
                <span className={`badge-tipo ${detalle.tipo === "PERSONALIZADO" ? "personal" : "instructor"}`}>
                  {etiquetaTipo(detalle.tipo)}
                </span>
              </p>

              {detalle.tipo === "PERSONALIZADO" ? (
                <>
                  <h4 className="subtitulo-detalle">Disponibilidad</h4>
                  <p>
                    {detalle.disponibilidad || "No se registró información de disponibilidad."}
                  </p>
                  <p className="nota-personalizado">
                    Los entrenadores personales coordinan el horario directamente con cada
                    alumno fuera del sistema — no se gestionan citas aquí.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="subtitulo-detalle">Horarios de turno</h4>
                  {detalle.horarios?.length > 0 ? (
                    <ul className="lista-horarios">
                      {detalle.horarios.map((h) => (
                        <li key={h.id}>
                          <span>{DIAS[h.diaSemana]}: {h.horaInicio} – {h.horaFin}</span>
                          {esAdmin && (
                            <button className="btn-quitar" onClick={() => handleEliminarHorario(h.id)}>✕</button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Sin horarios registrados todavía.</p>
                  )}

                  {esAdmin && (
                    <form className="form-horario" onSubmit={handleAgregarHorario}>
                      <select
                        value={formHorario.diaSemana}
                        onChange={(e) => setFormHorario({ ...formHorario, diaSemana: e.target.value })}
                      >
                        {DIAS.map((d, i) => (
                          <option key={i} value={i}>{d}</option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={formHorario.horaInicio}
                        onChange={(e) => setFormHorario({ ...formHorario, horaInicio: e.target.value })}
                      />
                      <input
                        type="time"
                        value={formHorario.horaFin}
                        onChange={(e) => setFormHorario({ ...formHorario, horaFin: e.target.value })}
                      />
                      <button type="submit">+ Agregar</button>
                    </form>
                  )}
                </>
              )}

              <h4 className="subtitulo-detalle">Alumnos asignados</h4>
              {detalle.clientes?.length > 0 ? (
                <ul className="lista-busqueda">
                  {detalle.clientes.map((c) => (
                    <li key={c.id} style={{ cursor: "default" }}>
                      {c.nombre} — DNI {c.dni}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Este entrenador todavía no tiene clientes asignados.</p>
              )}
            </>
          ) : (
            <p>Haz clic en un entrenador de la lista para ver su detalle completo.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Entrenadores;
