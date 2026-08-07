import { useEffect, useState } from "react";
import { obtenerClientes } from "../services/clienteService";
import "../styles/home.css";

function Home() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const res = await obtenerClientes();
    setClientes(res.data);
  };

  const activos = clientes.filter((c) => c.estado === "Activo").length;
  const mensuales = clientes.filter((c) => c.plan === "Mensual").length;
  const anuales = clientes.filter((c) => c.plan === "Anual").length;

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>Resumen general del gimnasio</p>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span>👥</span>

          <h4>Total Clientes</h4>

          <h2>{clientes.length}</h2>
        </div>

        <div className="dashboard-card">
          <span>✅</span>

          <h4>Activos</h4>

          <h2>{activos}</h2>
        </div>

        <div className="dashboard-card">
          <span>📅</span>

          <h4>Mensuales</h4>

          <h2>{mensuales}</h2>
        </div>

        <div className="dashboard-card">
          <span>👑</span>

          <h4>Anuales</h4>

          <h2>{anuales}</h2>
        </div>
      </div>

      <div className="ultimos-clientes">
        <div className="cabecera">
          <h2>Últimos socios registrados</h2>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nombre</th>

              <th>Plan</th>

              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {clientes.slice(0, 5).map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>

                <td>{cliente.plan}</td>

                <td>
                  <span className="estado-home">{cliente.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Home;
