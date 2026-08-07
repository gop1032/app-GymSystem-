function membresiaActiva(cliente) {
  if (!cliente.membresias?.length) return null;
  return cliente.membresias[0]; // ya viene ordenada por fechaFin desc desde el backend
}

function ClienteTable({ clientes, eliminar, verQR }) {
  return (
    <div className="tabla-container">
      <table className="tabla-clientes">
        <thead>
          <tr>
            <th>Socio</th>
            <th>DNI</th>
            <th>Plan</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientes.map((cliente) => {
            const membresia = membresiaActiva(cliente);
            const vigente = membresia && new Date(membresia.fechaFin) >= new Date() && membresia.estado === "ACTIVA";

            return (
              <tr key={cliente.id}>
                <td>
                  <div className="cliente-info">
                    <div className="avatar-tabla">{cliente.nombre.charAt(0)}</div>
                    <div>
                      <strong>{cliente.nombre}</strong>
                      <p>{cliente.correo}</p>
                    </div>
                  </div>
                </td>

                <td>{cliente.dni}</td>
                <td>{membresia?.plan?.nombre || "Sin plan"}</td>

                <td>
                  <span className={vigente ? "badge activo" : "badge inactivo"}>
                    {vigente ? "Activo" : "Vencido / Sin plan"}
                  </span>
                </td>

                <td>
                  <button className="btn-icon ver" onClick={() => verQR(cliente)} title="Ver QR">
                    🔳
                  </button>
                  <button
                    className="btn-icon eliminar"
                    onClick={() => eliminar(cliente.id)}
                    title="Eliminar"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ClienteTable;
