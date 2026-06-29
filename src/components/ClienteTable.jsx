function ClienteTable({ clientes }) {

    return (

        <table  cellPadding="10" className="tabla-clientes">

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Nombre</th>

                    <th>DNI</th>

                    <th>Teléfono</th>

                    <th>Correo</th>

                    <th>Plan</th>

                    <th>Estado</th>

                </tr>

            </thead>

            <tbody>

                {

                    clientes.map((cliente) => (

                        <tr key={cliente.id}>

                            <td>{cliente.id}</td>

                            <td>{cliente.nombre}</td>

                            <td>{cliente.dni}</td>

                            <td>{cliente.telefono}</td>

                            <td>{cliente.correo}</td>

                            <td>{cliente.plan}</td>

                            <td>{cliente.estado}</td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    );

}

export default ClienteTable;