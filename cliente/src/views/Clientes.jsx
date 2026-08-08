import { useEffect, useState } from "react";
import ClienteForm from "../components/ClienteForm";
import ClienteTable from "../components/ClienteTable";
import {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  obtenerQR,
} from "../services/clienteService";

import "../styles/clientes.css";

function membresiaVigente(cliente) {
  const m = cliente.membresias?.[0];
  return m && new Date(m.fechaFin) >= new Date() && m.estado === "ACTIVA";
}

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [qrModal, setQrModal] = useState(null); // { nombre, imagen }

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
    setQrModal({ nombre: cliente.nombre, imagen: data.imagen });
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

            <button className="guardar" onClick={() => setQrModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      <ClienteTable clientes={clientesFiltrados} eliminar={eliminar} verQR={verQR} />
    </>
  );
}

export default Clientes;
