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
import "../styles/clientes.css";
import "../styles/modulos.css";

const VACIO = {
  nombre: "",
  tipo: "INSTRUCTOR",
  dni: "",
  especialidad: "",
  direccion: "",
  telefono: "",
  correo: "",
  fotoUrl: "",
  disponibilidad: "",
};

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function etiquetaTipo(tipo) {
  return tipo === "PERSONALIZADO" ? "Entrenador Personal" : "Instructor de Gimnasio";
}

function Entrenadores() {
  const { esAdmin } = useAuth();
  const [entrenadores, setEntrenadores] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState("");
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
    setError("");
    try {
      if (editandoId) {
        await actualizarEntrenador(editandoId, form);
      } else {
        await crearEntrenador(form);
      }
      setForm(VACIO);
      setEditandoId(null);
      setMostrarFormulario(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo guardar el entrenador.");
    }
  }

  function handleEditar(ent) {
    setForm({
      nombre: ent.nombre,
      tipo: ent.tipo,
      dni: ent.dni || "",
      especialidad: ent.especialidad || "",
      direccion: ent.direccion || "",
      telefono: ent.telefono || "",
      correo: ent.correo || "",
      fotoUrl: ent.fotoUrl || "",
      disponibilidad: ent.disponibilidad || "",
    });
    setEditandoId(ent.id);
    setMostrarFormulario(true);
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
    verDetalle(detalle.id);
  }

  async function handleEliminarHorario(horarioId) {
    await eliminarHorario(horarioId);
    verDetalle(detalle.id);
  }

  return (
    <div className="modulo">
      <h1>Entrenadores</h1>
      <p>Personal, instructores, especialidades, horarios y alumnos asignados.</p>

      {esAdmin && (
        <button className="btn-nuevo" style={{ marginBottom: 20 }} onClick={() => { setForm(VACIO); setEditandoId(null); setMostrarFormulario(true); }}>
          + Nuevo Entrenador
        </button>
      )}

      {mostrarFormulario && (
        <div className="modal" onClick={() => setMostrarFormulario(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="form-header">
                <div>
                  <h2>{editandoId ? "Editar Entrenador" : "Nuevo Entrenador"}</h2>
                  <p>Perfil completo del entrenador.</p>
                </div>
                <button type="button" className="cerrar" onClick={() => setMostrarFormulario(false)}>✕</button>
              </div>

              {error && <div className="login-error">{error}</div>}

              <div className="form-grid">
                <div className="grupo">
                  <label>Nombre completo</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>

                <div className="grupo">
                  <label>Tipo</label>
                  <select name="tipo" value={form.tipo} onChange={handleChange}>
                    <option value="INSTRUCTOR">Instructor de Gimnasio</option>
                    <option value="PERSONALIZADO">Entrenador Personal</option>
                  </select>
                </div>

                <div className="grupo">
                  <label>DNI</label>
                  <input name="dni" value={form.dni} onChange={handleChange} required />
                </div>

                <div className="grupo">
                  <label>Especialidad</label>
                  <input name="especialidad" placeholder="Ej: Crossfit, Boxeo" value={form.especialidad} onChange={handleChange} required />
                </div>

                <div className="grupo">
                  <label>Teléfono celular</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} required />
                </div>

                <div className="grupo">
                  <label>Correo (opcional)</label>
                  <input name="correo" type="email" value={form.correo} onChange={handleChange} />
                </div>

                <div className="grupo full">
                  <label>Dirección</label>
                  <input name="direccion" value={form.direccion} onChange={handleChange} required />
                </div>

                <div className="grupo full">
                  <label>Foto de perfil (link a imagen)</label>
                  <input name="fotoUrl" placeholder="https://..." value={form.fotoUrl} onChange={handleChange} />
                </div>

                {form.tipo === "PERSONALIZADO" && (
                  <div className="grupo full">
                    <label>Disponibilidad general</label>
                    <input
                      name="disponibilidad"
                      placeholder="Ej: coordina por WhatsApp, tardes"
                      value={form.disponibilidad}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <div className="acciones-form">
                <button type="button" className="cancelar" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                <button className="guardar">{editandoId ? "Guardar cambios" : "Registrar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="perfiles-grid">
        {entrenadores.map((ent) => (
          <div key={ent.id} className="perfil-card" onClick={() => verDetalle(ent.id)}>
            {ent.fotoUrl ? (
              <img src={ent.fotoUrl} alt={ent.nombre} className="perfil-foto" />
            ) : (
              <div className="perfil-foto perfil-foto-placeholder">{ent.nombre.charAt(0)}</div>
            )}
            <h3>{ent.nombre}</h3>
            <span className={`badge-tipo ${ent.tipo === "PERSONALIZADO" ? "personal" : "instructor"}`}>
              {etiquetaTipo(ent.tipo)}
            </span>
            <p className="perfil-especialidad">{ent.especialidad || "Sin especialidad registrada"}</p>
            {ent.tipo === "PERSONALIZADO" ? (
              <p className="perfil-meta">👥 {ent._count?.clientes ?? 0} alumnos</p>
            ) : (
              <p className="perfil-meta">🕒 {ent.horarios?.length ?? 0} turnos</p>
            )}
          </div>
        ))}
        {entrenadores.length === 0 && <p>Todavía no hay entrenadores registrados.</p>}
      </div>

      {detalle && (
        <div className="modal" onClick={() => setDetalle(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <div className="perfil-detalle-header">
                {detalle.fotoUrl ? (
                  <img src={detalle.fotoUrl} alt={detalle.nombre} className="perfil-foto-grande" />
                ) : (
                  <div className="perfil-foto-grande perfil-foto-placeholder">{detalle.nombre.charAt(0)}</div>
                )}
                <div>
                  <h2>{detalle.nombre}</h2>
                  <span className={`badge-tipo ${detalle.tipo === "PERSONALIZADO" ? "personal" : "instructor"}`}>
                    {etiquetaTipo(detalle.tipo)}
                  </span>
                </div>
              </div>
              <button type="button" className="cerrar" onClick={() => setDetalle(null)}>✕</button>
            </div>

            <ul className="ficha-datos">
              <li><strong>DNI:</strong> {detalle.dni || "—"}</li>
              <li><strong>Especialidad:</strong> {detalle.especialidad || "—"}</li>
              <li><strong>Teléfono:</strong> {detalle.telefono || "—"}</li>
              <li><strong>Correo:</strong> {detalle.correo || "—"}</li>
              <li><strong>Dirección:</strong> {detalle.direccion || "—"}</li>
            </ul>

            {esAdmin && (
              <button className="btn-secundario" onClick={() => { setDetalle(null); handleEditar(detalle); }}>
                ✏️ Editar perfil
              </button>
            )}
            {esAdmin && (
              <button className="btn-secundario" style={{ marginLeft: 10 }} onClick={() => handleEliminar(detalle.id)}>
                🗑️ Desactivar
              </button>
            )}

            {detalle.tipo === "PERSONALIZADO" ? (
              <>
                <h4 className="subtitulo-detalle">Disponibilidad</h4>
                <p>{detalle.disponibilidad || "No se registró información de disponibilidad."}</p>
                <p className="nota-personalizado">
                  Los entrenadores personales coordinan el horario directamente con cada
                  alumno fuera del sistema — no se gestionan citas aquí.
                </p>

                <h4 className="subtitulo-detalle">Alumnos asignados</h4>
                {detalle.clientes?.length > 0 ? (
                  <ul className="lista-busqueda">
                    {detalle.clientes.map((c) => (
                      <li key={c.id} style={{ cursor: "default" }}>{c.nombre} — DNI {c.dni}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Este entrenador todavía no tiene alumnos asignados.</p>
                )}
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

                <p className="nota-personalizado">
                  Los instructores de gimnasio cubren un turno general, no se les asignan alumnos individuales.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Entrenadores;
