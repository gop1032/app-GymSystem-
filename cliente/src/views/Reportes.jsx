import { useEffect, useState } from "react";
import { obtenerReporte } from "../services/membresiaService";
import { obtenerEstadisticas, obtenerAsistencias } from "../services/asistenciaService";
import { obtenerResumenPorMetodo, obtenerResumenMensual } from "../services/pagoService";
import "../styles/reportes.css";

const ETIQUETAS_METODO = { EFECTIVO: "Efectivo", YAPE: "Yape", PLIN: "Plin", TARJETA: "Tarjeta", TRANSFERENCIA: "Transferencia" };

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function descargarCSV(nombreArchivo, filas) {
  const csv = filas.map((fila) => fila.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}

function Reportes() {
  const [membresias, setMembresias] = useState(null);
  const [asistencia, setAsistencia] = useState(null);
  const [ingresos, setIngresos] = useState(null);
  const [resumenMes, setResumenMes] = useState(null);
  const [dias, setDias] = useState(30);

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dias]);

  async function cargar() {
    const [resMembresias, resAsistencia, resIngresos, resMes] = await Promise.all([
      obtenerReporte(),
      obtenerEstadisticas(dias),
      obtenerResumenPorMetodo(),
      obtenerResumenMensual(),
    ]);
    setMembresias(resMembresias.data);
    setAsistencia(resAsistencia.data);
    setIngresos(resIngresos.data);
    setResumenMes(resMes.data);
  }

  async function exportarAsistenciasHoy() {
    const { data } = await obtenerAsistencias(hoyISO());
    const filas = [
      ["Tipo", "Nombre", "DNI", "Hora", "Monto pagado"],
      ...data.registros.map((r) => [
        r.tipo === "socio" ? "Socio" : "Pase diario",
        r.nombre,
        r.dni,
        new Date(r.hora).toLocaleTimeString(),
        r.monto.toFixed(2),
      ]),
    ];
    descargarCSV(`asistencias-${hoyISO()}.csv`, filas);
  }

  function exportarIngresos() {
    if (!ingresos || !resumenMes) return;

    const filas = [
      ["Reporte de ingresos", hoyISO()],
      [],
      ["Ingresos de hoy", `S/. ${ingresos.totalHoy.toFixed(2)}`],
      ["Ingresos del mes", `S/. ${resumenMes.ingresosTotales.toFixed(2)}`],
      [],
      ["Desglose de HOY por método", ""],
      ...Object.entries(ingresos.hoyPorMetodo).map(([m, monto]) => [ETIQUETAS_METODO[m] || m, `S/. ${monto.toFixed(2)}`]),
      [],
      ["Desglose del MES por método", ""],
      ...Object.entries(ingresos.mesPorMetodo).map(([m, monto]) => [ETIQUETAS_METODO[m] || m, `S/. ${monto.toFixed(2)}`]),
    ];
    descargarCSV(`ingresos-${hoyISO()}.csv`, filas);
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
          <button className="btn-secundario" onClick={exportarAsistenciasHoy}>⬇ Asistencias de hoy (CSV)</button>
          <button className="btn-secundario" onClick={exportarIngresos}>⬇ Ingresos (CSV)</button>
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

        {ingresos && (
          <div className="reporte-card">
            <h3 className="reporte-titulo">INGRESOS</h3>
            <div className="reporte-filas">
              <div className="reporte-fila">
                <span>Hoy</span>
                <strong className="valor-mint">S/. {ingresos.totalHoy.toFixed(2)}</strong>
              </div>
              <div className="reporte-fila">
                <span>Este mes</span>
                <strong className="valor-brass">S/. {ingresos.totalMes.toFixed(2)}</strong>
              </div>
            </div>

            <h4 className="reporte-subtitulo">Desglose de hoy por método</h4>
            <div className="reporte-filas">
              {Object.entries(ingresos.hoyPorMetodo).length > 0 ? (
                Object.entries(ingresos.hoyPorMetodo).map(([metodo, monto]) => (
                  <div className="reporte-fila" key={metodo}>
                    <span>{ETIQUETAS_METODO[metodo] || metodo}</span>
                    <strong>S/. {monto.toFixed(2)}</strong>
                  </div>
                ))
              ) : (
                <p className="reporte-vacio">Sin ingresos registrados hoy todavía.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;
