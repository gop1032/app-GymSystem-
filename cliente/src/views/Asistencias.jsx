import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { validarAcceso, buscarClientes, obtenerAsistencias } from "../services/asistenciaService";
import "../styles/modulos.css";

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function Asistencias() {
  const [escaneando, setEscaneando] = useState(false);
  const [resultado, setResultado] = useState(null); // respuesta de validarAcceso
  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const scannerRef = useRef(null);

  const [fechaHistorial, setFechaHistorial] = useState(hoyISO());
  const [historial, setHistorial] = useState({ total: 0, asistencias: [] });

  useEffect(() => {
    cargarHistorial(fechaHistorial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaHistorial]);

  async function cargarHistorial(fecha) {
    const { data } = await obtenerAsistencias(fecha);
    setHistorial(data);
  }

  // Inicia/detiene el lector de cámara cuando se activa el modo escaneo
  useEffect(() => {
    if (!escaneando) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (qrCode) => {
        // Se detectó un QR: se pausa para evitar lecturas repetidas mientras se procesa
        scanner.pause(true);
        await procesarAcceso({ qrCode });
      },
      () => {} // errores de lectura frame a frame, se ignoran (es normal mientras enfoca)
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [escaneando]);

  async function procesarAcceso(payload) {
    try {
      const { data } = await validarAcceso(payload);
      setResultado(data);
      if (data.acceso && fechaHistorial === hoyISO()) {
        cargarHistorial(fechaHistorial); // refresca la lista de hoy con el nuevo ingreso
      }
    } catch (error) {
      setResultado({
        acceso: false,
        mensaje: error.response?.data?.mensaje || "Error al validar el acceso.",
      });
    }
  }

  function reanudarEscaneo() {
    setResultado(null);
    scannerRef.current?.resume();
  }

  async function handleBuscar(e) {
    e.preventDefault();
    if (!busqueda.trim()) return;
    const { data } = await buscarClientes(busqueda.trim());
    setResultadosBusqueda(data);
  }

  async function handleSeleccionarCliente(clienteId) {
    setResultadosBusqueda([]);
    setBusqueda("");
    await procesarAcceso({ clienteId });
  }

  function exportarCSV() {
    const filas = [
      ["Cliente", "DNI", "Hora"],
      ...historial.asistencias.map((a) => [
        a.cliente.nombre,
        a.cliente.dni,
        new Date(a.fechaHora).toLocaleTimeString(),
      ]),
    ];

    const csv = filas.map((fila) => fila.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `asistencias-${fechaHistorial}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="modulo">
      <h1>Control de Acceso</h1>
      <p>Escanea el QR del cliente o búscalo manualmente para registrar su ingreso.</p>

      <div className="acceso-grid">
        <div className="acceso-panel">
          <h3>Escanear QR</h3>

          {!escaneando ? (
            <button className="btn-primario" onClick={() => setEscaneando(true)}>
              📷 Activar cámara
            </button>
          ) : (
            <>
              <div id="qr-reader" />
              <button className="btn-secundario" onClick={() => setEscaneando(false)}>
                Apagar cámara
              </button>
            </>
          )}
        </div>

        <div className="acceso-panel">
          <h3>Búsqueda manual (respaldo)</h3>

          <form onSubmit={handleBuscar} className="form-busqueda">
            <input
              type="text"
              placeholder="Nombre o DNI del cliente"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>

          {resultadosBusqueda.length > 0 && (
            <ul className="lista-busqueda">
              {resultadosBusqueda.map((c) => (
                <li key={c.id} onClick={() => handleSeleccionarCliente(c.id)}>
                  {c.nombre} — DNI {c.dni}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {resultado && (
        <div className={`resultado-acceso ${resultado.acceso ? "ok" : "denegado"}`}>
          <h3>{resultado.acceso ? "✅ Acceso permitido" : "⛔ Acceso denegado"}</h3>
          <p>{resultado.mensaje}</p>
          <button onClick={reanudarEscaneo}>Escanear siguiente</button>
        </div>
      )}

      <div className="reporte-asistencias">
        <div className="reporte-header">
          <div>
            <h2>Historial de asistencias</h2>
            <p>Consulta quiénes asistieron en un día específico.</p>
          </div>

          <div className="reporte-acciones">
            <input
              type="date"
              value={fechaHistorial}
              max={hoyISO()}
              onChange={(e) => setFechaHistorial(e.target.value)}
            />
            <button className="btn-secundario" onClick={() => window.print()}>🖨 Imprimir</button>
            <button className="btn-secundario" onClick={exportarCSV}>⬇ Exportar CSV</button>
          </div>
        </div>

        <div className="reporte-total">
          Total de asistencias el {fechaHistorial}: <strong>{historial.total}</strong>
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>DNI</th>
              <th>Hora de ingreso</th>
            </tr>
          </thead>
          <tbody>
            {historial.asistencias.map((a) => (
              <tr key={a.id}>
                <td>{a.cliente.nombre}</td>
                <td>{a.cliente.dni}</td>
                <td>{new Date(a.fechaHora).toLocaleTimeString()}</td>
              </tr>
            ))}
            {historial.asistencias.length === 0 && (
              <tr>
                <td colSpan={3}>No hay asistencias registradas ese día.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Asistencias;
