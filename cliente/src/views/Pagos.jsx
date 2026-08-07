import { useEffect, useState } from "react";
import { obtenerPagos } from "../services/pagoService";
import { obtenerPasesDiarios, registrarPaseDiario } from "../services/paseDiarioService";
import "../styles/modulos.css";

function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [pases, setPases] = useState([]);
  const [formPase, setFormPase] = useState({ nombre: "", dni: "", monto: "" });

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const [resPagos, resPases] = await Promise.all([obtenerPagos(), obtenerPasesDiarios()]);
    setPagos(resPagos.data);
    setPases(resPases.data);
  }

  async function handleRegistrarPase(e) {
    e.preventDefault();
    await registrarPaseDiario({ ...formPase, monto: Number(formPase.monto) });
    setFormPase({ nombre: "", dni: "", monto: "" });
    cargar();
  }

  return (
    <div className="modulo">
      <h1>Pagos</h1>

      <div className="acceso-panel" style={{ marginBottom: 24 }}>
        <h3>Registrar pase de un día (visitante sin membresía)</h3>
        <form className="form-inline" onSubmit={handleRegistrarPase}>
          <input
            placeholder="Nombre"
            value={formPase.nombre}
            onChange={(e) => setFormPase({ ...formPase, nombre: e.target.value })}
            required
          />
          <input
            placeholder="DNI (opcional)"
            value={formPase.dni}
            onChange={(e) => setFormPase({ ...formPase, dni: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Monto S/."
            value={formPase.monto}
            onChange={(e) => setFormPase({ ...formPase, monto: e.target.value })}
            required
          />
          <button type="submit">Registrar ingreso</button>
        </form>
      </div>

      <h2>Historial de pagos (membresías)</h2>
      <table className="tabla">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Plan</th>
            <th>Monto</th>
            <th>Método</th>
            <th>Registrado por</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((p) => (
            <tr key={p.id}>
              <td>{p.membresia?.cliente?.nombre}</td>
              <td>{p.membresia?.plan?.nombre}</td>
              <td>S/. {p.monto}</td>
              <td>{p.metodo}</td>
              <td>{p.usuario?.nombre}</td>
              <td>{new Date(p.fecha).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 32 }}>Pases diarios de hoy</h2>
      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Monto</th>
            <th>Registrado por</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {pases.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.dni || "—"}</td>
              <td>S/. {p.monto}</td>
              <td>{p.usuario?.nombre}</td>
              <td>{new Date(p.fecha).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pagos;
