import { useEffect, useState } from "react";
import { obtenerReporte } from "../services/membresiaService";
import { obtenerEstadisticas } from "../services/asistenciaService";
import "../styles/reportes.css";

function Reportes() {
  const [membresias, setMembresias] = useState(null);
  const [asistencia, setAsistencia] = useState(null);
  const [dias, setDias] = useState(30);

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dias]);

  async function cargar() {
    const [resMembresias, resAsistencia] = await Promise.all([
      obtenerReporte(),
      obtenerEstadisticas(dias),
    ]);
    setMembresias(resMembresias.data);
    setAsistencia(resAsistencia.data);
  }

  return (
    <div className="modulo">
      <div className="reportes-header">
        <div>
          <h1>Reportes</h1>
          <p>Estado general del gimnasio en un vistazo.</p>
        </div>

        <div className="reportes-filtro">
          <label>Periodo de asistencia:</label>
          <select value={dias} onChange={(e) => setDias(Number(e.target.value))}>
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>
        </div>
      </div>

      <div className="reportes-grid">
        {membresias && (
          <div className="reporte-card">
            <h3 className="reporte-titulo">MEMBRESÍAS</h3>
            <div className="reporte-filas">
              <div className="reporte-fila">
                <span>Activas</span>
                <strong className="valor-mint">{membresias.activas}</strong>
              </div>
              <div className="reporte-fila">
                <span>Por vencer (7 días)</span>
                <strong className="valor-brass">{membresias.porVencer}</strong>
              </div>
              <div className="reporte-fila">
                <span>Vencidas</span>
                <strong className="valor-alert">{membresias.vencidas}</strong>
              </div>
              <div className="reporte-fila">
                <span>Nuevas este mes</span>
                <strong>{membresias.nuevasEsteMes}</strong>
              </div>
              <div className="reporte-fila">
                <span>Renovadas este mes</span>
                <strong>{membresias.renovadas}</strong>
              </div>
            </div>
          </div>
        )}

        {asistencia && (
          <div className="reporte-card">
            <h3 className="reporte-titulo">ASISTENCIA</h3>
            <div className="reporte-filas">
              <div className="reporte-fila">
                <span>Promedio diario</span>
                <strong>{asistencia.promedioDiario}</strong>
              </div>
              <div className="reporte-fila">
                <span>Máximo</span>
                <strong className="valor-mint">{asistencia.maximo}</strong>
              </div>
              <div className="reporte-fila">
                <span>Mínimo</span>
                <strong className="valor-alert">{asistencia.minimo}</strong>
              </div>
            </div>

            {asistencia.horaPico && (
              <div className="reporte-hora reporte-hora-pico">
                <span>🔥 Hora pico</span>
                <strong>{asistencia.horaPico.inicio} – {asistencia.horaPico.fin}</strong>
              </div>
            )}

            {asistencia.horaMenosConcurrida && (
              <div className="reporte-hora reporte-hora-valle">
                <span>🟢 Hora menos concurrida</span>
                <strong>{asistencia.horaMenosConcurrida.inicio} – {asistencia.horaMenosConcurrida.fin}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;
