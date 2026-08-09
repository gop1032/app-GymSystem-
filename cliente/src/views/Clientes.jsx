import { useEffect, useState } from "react";
import ClienteForm from "../components/ClienteForm";
import ClienteTable from "../components/ClienteTable";
import useAuth from "../hooks/useAuth";
import {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  obtenerQR,
  regenerarQR,
} from "../services/clienteService";
import { obtenerPlanes } from "../services/planService";
import { crearMembresia } from "../services/membresiaService";

import "../styles/clientes.css";

function membresiaVigente(cliente) {
  const m = cliente.membresias?.[0];
  return m && new Date(m.fechaFin) >= new Date() && m.estado === "ACTIVA";
}

function Clientes() {
  const { esAdmin } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [qrModal, setQrModal] = useState(null); // { nombre, imagen }
  const [planModal, setPlanModal] = useState(null); // { id, nombre }
  const [planes, setPlanes] = useState([]);
  const [formPlan, setFormPlan] = useState({ planId: "", registrarPago: true, monto: "", metodo: "EFECTIVO" });

  const listarClientes = async () => {
    const res = await obtenerClientes();
    setClientes(res.data);
  };

  useEffect(() => {
    listarClientes();
  }, []);

  const guardarCliente = async (cliente) => {
    await crearCliente(cliente);
    listarClientes();
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar cliente?")) return;
    await eliminarCliente(id);
    listarClientes();
  };

  const verQR = async (cliente) => {
    const { data } = await obtenerQR(cliente.id);
    setQrModal({ id: cliente.id, nombre: cliente.nombre, imagen: data.imagen });
  };

  const abrirAsignarPlan = async (cliente) => {
    if (planes.length === 0) {
      const { data } = await obtenerPlanes();
      setPlanes(data);
    }
    setFormPlan({ planId: "", registrarPago: true, monto: "", metodo: "EFECTIVO" });
    setPlanModal({ id: cliente.id, nombre: cliente.nombre });
  };

  const handleGuardarPlan = async (e) => {
    e.preventDefault();
    const planSeleccionado = planes.find((p) => p.id === Number(formPlan.planId));

    await crearMembresia({
      clienteId: planModal.id,
      planId: formPlan.planId,
      registrarPago: formPlan.registrarPago,
      monto: formPlan.monto ? Number(formPlan.monto) : planSeleccionado?.precio,
      metodo: formPlan.metodo,
    });

    setPlanModal(null);
    listarClientes();
  };

  const handleRegenerarQR = async () => {
    if (!window.confirm(`¿Invalidar el QR actual de ${qrModal.nombre} y generar uno nuevo? El QR viejo dejará de servir de inmediato.`)) return;
    const { data } = await regenerarQR(qrModal.id);
    setQrModal({ ...qrModal, imagen: data.imagen });
  };

  const descargarQR = () => {
    const a = document.createElement("a");
    a.href = qrModal.imagen;
    a.download = `QR-${qrModal.nombre.replace(/\s+/g, "-")}.png`;
    a.click();
  };

  const imprimirQR = () => {
    window.print();
  };

  const compartirQR = async () => {
    try {
      const blob = await (await fetch(qrModal.imagen)).blob();
      const archivo = new File([blob], `QR-${qrModal.nombre}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
        await navigator.share({
          files: [archivo],
          title: "Pase de acceso GymSystem",
          text: `Pase de acceso de ${qrModal.nombre}`,
        });
        return;
      }
    } catch {
      // si el usuario cancela el share nativo, no hacemos nada más
    }

    // Respaldo en escritorio (sin Web Share API): abre WhatsApp Web con el mensaje
    // listo; la imagen hay que adjuntarla manualmente (las URLs de WhatsApp no
    // permiten adjuntar archivos automáticamente).
    const texto = encodeURIComponent(
      `Pase de acceso GymSystem — ${qrModal.nombre}. Descarga la imagen QR adjunta y muéstrala en recepción para ingresar.`
    );
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  };

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
      cliente.dni.includes(buscar)
  );

  const activos = clientes.filter(membresiaVigente).length;

  return (
    <>
      <div className="cards-clientes">
        <div className="card">
          <h4>Total Clientes</h4>
          <h2>{clientes.length}</h2>
        </div>

        <div className="card">
          <h4>Activos</h4>
          <h2>{activos}</h2>
        </div>

        <div className="card">
          <h4>Vencidos / Sin plan</h4>
          <h2>{clientes.length - activos}</h2>
        </div>
      </div>

      <h1 className="titulo">Gestión de Socios</h1>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar socio..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />

        <button className="btn-nuevo" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          + Nuevo Socio
        </button>
      </div>

      {mostrarFormulario && (
        <div className="modal">
          <div className="modal-content">
            <ClienteForm onGuardar={guardarCliente} cerrar={() => setMostrarFormulario(false)} />
          </div>
        </div>
      )}

      {qrModal && (
        <div className="modal" onClick={() => setQrModal(null)}>
          <div className="modal-content qr-modal" onClick={(e) => e.stopPropagation()}>
            <h2>QR de {qrModal.nombre}</h2>
            <img src={qrModal.imagen} alt={`QR de ${qrModal.nombre}`} />
            <p>Este código es el pase de acceso del cliente al gimnasio.</p>

            <div className="qr-acciones">
              <button onClick={descargarQR}>⬇ Descargar</button>
              <button onClick={imprimirQR}>🖨 Imprimir</button>
              <button onClick={compartirQR}>📤 WhatsApp</button>
            </div>

            {esAdmin && (
              <button className="btn-regenerar-qr" onClick={handleRegenerarQR}>
                🔄 Regenerar QR (invalidar el actual)
              </button>
            )}

            <button className="guardar" onClick={() => setQrModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {planModal && (
        <div className="modal" onClick={() => setPlanModal(null)}>
          <div className="modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <div>
                <h2>Asignar plan a {planModal.nombre}</h2>
                <p>Crea una nueva membresía para este cliente (sirve para renovar o para asignar el primer plan).</p>
              </div>
              <button type="button" className="cerrar" onClick={() => setPlanModal(null)}>✕</button>
            </div>

            <form onSubmit={handleGuardarPlan}>
              <div className="grupo" style={{ marginBottom: 14 }}>
                <label>Plan</label>
                <select
                  value={formPlan.planId}
                  onChange={(e) => setFormPlan({ ...formPlan, planId: e.target.value })}
                  required
                >
                  <option value="">Selecciona un plan</option>
                  {planes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} — S/. {p.precio} ({p.duracionDias} días)
                    </option>
                  ))}
                </select>
              </div>

              <label className="toggle-pase-diario" style={{ marginBottom: 14 }}>
                <input
                  type="checkbox"
                  checked={formPlan.registrarPago}
                  onChange={(e) => setFormPlan({ ...formPlan, registrarPago: e.target.checked })}
                />
                Registrar el pago junto con la membresía
              </label>

              {formPlan.registrarPago && (
                <div className="form-grid" style={{ marginBottom: 14 }}>
                  <div className="grupo">
                    <label>Monto (S/., opcional)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Usa el precio del plan"
                      value={formPlan.monto}
                      onChange={(e) => setFormPlan({ ...formPlan, monto: e.target.value })}
                    />
                  </div>
                  <div className="grupo">
                    <label>Método de pago</label>
                    <select
                      value={formPlan.metodo}
                      onChange={(e) => setFormPlan({ ...formPlan, metodo: e.target.value })}
                    >
                      <option value="EFECTIVO">Efectivo</option>
                      <option value="TARJETA">Tarjeta</option>
                      <option value="YAPE">Yape</option>
                      <option value="PLIN">Plin</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="acciones-form">
                <button type="button" className="cancelar" onClick={() => setPlanModal(null)}>Cancelar</button>
                <button className="guardar">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ClienteTable clientes={clientesFiltrados} eliminar={eliminar} verQR={verQR} asignarPlan={abrirAsignarPlan} />
    </>
  );
}

export default Clientes;
