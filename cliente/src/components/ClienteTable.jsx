function ClienteTable({ clientes, eliminar }) {
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
          {clientes.map((cliente) => (
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

              <td>{cliente.plan}</td>

              <td>
                <span
                  className={
                    cliente.estado === "Activo"
                      ? "badge activo"
                      : "badge inactivo"
                  }
                >
                  {cliente.estado}
                </span>
              </td>

              <td>
                <button className="btn-icon ver">👁</button>

                <button className="btn-icon editar">✏</button>

                <button
                  className="btn-icon eliminar"
                  onClick={() => eliminar(cliente.id)}
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClienteTable;
