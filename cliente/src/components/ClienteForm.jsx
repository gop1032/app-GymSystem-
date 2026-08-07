import { useEffect, useState } from "react";
import { obtenerPlanes } from "../services/planService";
import { obtenerEntrenadores } from "../services/entrenadorService";

function ClienteForm({ onGuardar, cerrar }) {
  const [cliente, setCliente] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    correo: "",
    entrenadorId: "",
    planId: "",
  });
  const [planes, setPlanes] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);

  useEffect(() => {
    obtenerPlanes().then((res) => setPlanes(res.data));
    obtenerEntrenadores().then((res) => setEntrenadores(res.data));
  }, []);

  const cambiar = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const guardar = (e) => {
    e.preventDefault();
    onGuardar({
      ...cliente,
      entrenadorId: cliente.entrenadorId || null,
      planId: cliente.planId || null,
    });
    cerrar();
  };

  return (
    <form className="cliente-form" onSubmit={guardar}>
      <div className="form-header">
        <div>
          <h2>Nuevo Cliente</h2>
          <p>Complete la información del socio.</p>
        </div>
        <button type="button" className="cerrar" onClick={cerrar}>✕</button>
      </div>

      <div className="form-grid">
        <div className="grupo">
          <label>Nombre</label>
          <input type="text" name="nombre" placeholder="Ingrese el nombre" onChange={cambiar} required />
        </div>

        <div className="grupo">
          <label>DNI</label>
          <input type="text" name="dni" placeholder="Ingrese el DNI" onChange={cambiar} required />
        </div>

        <div className="grupo">
          <label>Teléfono</label>
          <input type="text" name="telefono" placeholder="Ingrese el teléfono" onChange={cambiar} />
        </div>

        <div className="grupo">
          <label>Correo</label>
          <input type="email" name="correo" placeholder="Ingrese el correo" onChange={cambiar} />
        </div>

        <div className="grupo">
          <label>Entrenador (opcional)</label>
          <select name="entrenadorId" onChange={cambiar}>
            <option value="">Sin asignar</option>
            {entrenadores.map((ent) => (
              <option key={ent.id} value={ent.id}>{ent.nombre}</option>
            ))}
          </select>
        </div>

        <div className="grupo full">
          <label>Plan inicial (opcional, puede asignarse después)</label>
          <select name="planId" onChange={cambiar}>
            <option value="">Sin plan por ahora</option>
            {planes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} — S/. {p.precio} ({p.duracionDias} días)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="acciones-form">
        <button type="button" className="cancelar" onClick={cerrar}>Cancelar</button>
        <button className="guardar">Registrar</button>
      </div>
    </form>
  );
}

export default ClienteForm;
