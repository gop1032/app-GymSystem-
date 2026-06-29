import { useState } from "react";

function ClienteForm({ onGuardar, cerrar }) {
  const [cliente, setCliente] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    correo: "",
    plan: "",
    estado: "Activo",
  });

  const cambiar = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = (e) => {
    e.preventDefault();
    onGuardar(cliente);
    cerrar();
  };

  return (
    <form className="cliente-form" onSubmit={guardar}>

      <div className="form-header">

        <div>

          <h2>Nuevo Cliente</h2>

          <p>Complete la información del socio.</p>

        </div>

        <button
          type="button"
          className="cerrar"
          onClick={cerrar}
        >
          ✕
        </button>

      </div>

      <div className="form-grid">

        <div className="grupo">

          <label>Nombre</label>

          <input
            type="text"
            name="nombre"
            placeholder="Ingrese el nombre"
            onChange={cambiar}
          />

        </div>

        <div className="grupo">

          <label>DNI</label>

          <input
            type="text"
            name="dni"
            placeholder="Ingrese el DNI"
            onChange={cambiar}
          />

        </div>

        <div className="grupo">

          <label>Teléfono</label>

          <input
            type="text"
            name="telefono"
            placeholder="Ingrese el teléfono"
            onChange={cambiar}
          />

        </div>

        <div className="grupo">

          <label>Correo</label>

          <input
            type="email"
            name="correo"
            placeholder="Ingrese el correo"
            onChange={cambiar}
          />

        </div>

        <div className="grupo full">

          <label>Plan</label>

          <select
            name="plan"
            onChange={cambiar}
          >
            <option value="">Seleccione</option>
            <option>Mensual</option>
            <option>Trimestral</option>
            <option>Semestral</option>
            <option>Anual</option>
          </select>

        </div>

        <div className="grupo full">

          <label>Estado</label>

          <select
            name="estado"
            defaultValue="Activo"
            onChange={cambiar}
          >
            <option>Activo</option>
            <option>Inactivo</option>
          </select>

        </div>

      </div>

      <div className="acciones-form">

        <button
          type="button"
          className="cancelar"
          onClick={cerrar}
        >
          Cancelar
        </button>

        <button className="guardar">
          Registrar
        </button>

      </div>

    </form>
  );
}

export default ClienteForm;