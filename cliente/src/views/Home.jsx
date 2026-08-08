import { useEffect, useState } from "react";
import { obtenerClientes } from "../services/clienteService";
import { obtenerResumenMensual } from "../services/pagoService";
import { obtenerAlertas } from "../services/membresiaService";
import { obtenerPromedioAsistencias } from "../services/asistenciaService";
import { obtenerConfiguracion } from "../services/configuracionService";
import { obtenerResumenMaquinas } from "../services/maquinaService";
import "../styles/home.css";

function Home() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [resumen, setResumen] = useState(null);
  const [alertas, setAlertas] = useState({ vencidas: [], porVencer: [] });
  const [promedioAsistencias, setPromedioAsistencias] = useState(null);
  const [configuracion, setConfiguracion] = useState(null);
  const [resumenMaquinas, setResumenMaquinas] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const [resClientes, resResumen, resAlertas, resPromedio, resConfig, resMaquinas] = await Promise.all([
      obtenerClientes(),
      obtenerResumenMensual(),
      obtenerAlertas(3),
      obtenerPromedioAsistencias(30),
      obtenerConfiguracion(),
      obtenerResumenMaquinas(),
    ]);
    setTotalClientes(resClientes.data.length);
    setResumen(resResumen.data);
    setAlertas(resAlertas.data);
    setPromedioAsistencias(resPromedio.data);
    setConfiguracion(resConfig.data);
    setResumenMaquinas(resMaquinas.data);
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general del gimnasio</p>
        </div>
      </div>

      <div className="dashboard-cards principal">
        <div className="dashboard-card">
          <span>👥</span>
          <h4>Total Clientes</h4>
          <h2>{totalClientes}</h2>
        </div>

        <div className="dashboard-card">
          <span>💰</span>
          <h4>Ingresos del mes</h4>
          <h2>S/. {resumen?.ingresosTotales?.toFixed(2) ?? "0.00"}</h2>
        </div>

        <div className="dashboard-card">
          <span>⚠️</span>
          <h4>Membresías vencidas</h4>
          <h2>{alertas.vencidas.length}</h2>
        </div>

        <div className="dashboard-card">
          <span>⏳</span>
          <h4>Por vencer (3 días)</h4>
          <h2>{alertas.porVencer.length}</h2>
        </div>
      </div>

      <div className="dashboard-cards" style={{ marginBottom: 28 }}>
        <div className="dashboard-card">
          <span>🕒</span>
          <h4>Horario de atención</h4>
          <h2 style={{ fontSize: 22 }}>
            {configuracion ? `${configuracion.horaApertura} – ${configuracion.horaCierre}` : "—"}
          </h2>
          <p style={{ marginTop: 6, fontSize: 12 }}>{configuracion?.diasAtencion}</p>
        </div>

        <div className="dashboard-card">
          <span>📊</span>
          <h4>Promedio diario (30 días)</h4>
          <h2>{promedioAsistencias?.promedioDiario ?? "—"}</h2>
          <p style={{ marginTop: 6, fontSize: 12 }}>
            {promedioAsistencias?.totalAsistencias ?? 0} asistencias totales
          </p>
        </div>

        <div className="dashboard-card">
          <span>🏋️</span>
          <h4>Equipamiento</h4>
          <h2>{resumenMaquinas?.totalUnidades ?? 0}</h2>
          <p style={{ marginTop: 6, fontSize: 12 }}>{resumenMaquinas?.totalModelos ?? 0} modelos distintos</p>
        </div>
      </div>

      <div className="ultimos-clientes">
        <div className="cabecera">
          <h2>Clientes por vencer / vencidos</h2>
        </div>

        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Plan</th>
              <th>Vence</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {[...alertas.vencidas, ...alertas.porVencer].map((m) => (
              <tr key={m.id}>
                <td>{m.cliente?.nombre}</td>
                <td>{m.plan?.nombre}</td>
                <td>{new Date(m.fechaFin).toLocaleDateString()}</td>
                <td>
                  <span className="estado-home">
                    {new Date(m.fechaFin) < new Date() ? "Vencida" : "Por vencer"}
                  </span>
                </td>
              </tr>
            ))}
            {alertas.vencidas.length === 0 && alertas.porVencer.length === 0 && (
              <tr>
                <td colSpan={4}>No hay membresías vencidas ni por vencer 🎉</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Home;
