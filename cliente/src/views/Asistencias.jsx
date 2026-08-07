import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { validarAcceso, buscarClientes } from "../services/asistenciaService";
import "../styles/modulos.css";

function Asistencias() {
  const [escaneando, setEscaneando] = useState(false);
  const [resultado, setResultado] = useState(null); // respuesta de validarAcceso
  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const scannerRef = useRef(null);

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
    </div>
  );
}

export default Asistencias;
