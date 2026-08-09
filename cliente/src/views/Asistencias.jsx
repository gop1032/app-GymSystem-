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
  const [historial, setHistorial] = useState({ totalVisitantes: 0, ingresosDia: 0, registros: [] });

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
        // Se detectó un QR: se pausa para evitar lecturas repetidas mientras se procesa.
        // trim() por seguridad: algunos lectores de cámara agregan espacios/saltos
        // de línea invisibles al texto decodificado, lo que rompería la comparación
        // exacta contra el código guardado en la base de datos.
        scanner.pause(true);
        await procesarAcceso({ qrCode: qrCode.trim() });
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
      ["Tipo", "Nombre", "DNI", "Hora", "Monto pagado"],
      ...historial.registros.map((r) => [
        r.tipo === "socio" ? "Socio" : "Pase diario",
        r.nombre,
        r.dni,
        new Date(r.hora).toLocaleTimeString(),
        r.monto.toFixed(2),
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
          {fechaHistorial}: <strong>{historial.totalVisitantes}</strong> visitantes — Ingresos del día: <strong>S/. {historial.ingresosDia.toFixed(2)}</strong>
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Hora</th>
              <th>Monto pagado</th>
            </tr>
          </thead>
          <tbody>
            {historial.registros.map((r, i) => (
              <tr key={i}>
                <td>
                  <span className={`badge-tipo ${r.tipo === "socio" ? "instructor" : "personal"}`}>
                    {r.tipo === "socio" ? "Socio" : "Pase diario"}
                  </span>
                </td>
                <td>{r.nombre}</td>
                <td>{r.dni}</td>
                <td>{new Date(r.hora).toLocaleTimeString()}</td>
                <td>{r.monto > 0 ? `S/. ${r.monto.toFixed(2)}` : "—"}</td>
              </tr>
            ))}
            {historial.registros.length === 0 && (
              <tr>
                <td colSpan={5}>No hay asistencias registradas ese día.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Asistencias;
