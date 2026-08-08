import { useEffect, useState } from "react";
import { obtenerConfiguracion, actualizarConfiguracion } from "../services/configuracionService";
import "../styles/clientes.css";
import "../styles/modulos.css";

function Configuracion() {
  const [form, setForm] = useState({ horaApertura: "", horaCierre: "", diasAtencion: "" });
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    obtenerConfiguracion().then((res) => setForm(res.data));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await actualizarConfiguracion(form);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  return (
    <div className="modulo">
      <h1>Configuración del Gimnasio</h1>
      <p>Horario de atención general, visible para todo el equipo.</p>

      <form className="acceso-panel" style={{ maxWidth: 480 }} onSubmit={handleSubmit}>
        <div className="grupo" style={{ marginBottom: 16 }}>
          <label>Hora de apertura</label>
          <input
            type="time"
            value={form.horaApertura}
            onChange={(e) => setForm({ ...form, horaApertura: e.target.value })}
            required
          />
        </div>

        <div className="grupo" style={{ marginBottom: 16 }}>
          <label>Hora de cierre</label>
          <input
            type="time"
            value={form.horaCierre}
            onChange={(e) => setForm({ ...form, horaCierre: e.target.value })}
            required
          />
        </div>

        <div className="grupo" style={{ marginBottom: 20 }}>
          <label>Días de atención</label>
          <input
            type="text"
            placeholder="Ej: Lunes a Domingo"
            value={form.diasAtencion}
            onChange={(e) => setForm({ ...form, diasAtencion: e.target.value })}
            required
          />
        </div>

        <button className="btn-primario" type="submit">Guardar cambios</button>
        {guardado && <span className="config-guardado">✅ Guardado</span>}
      </form>
    </div>
  );
}

export default Configuracion;
