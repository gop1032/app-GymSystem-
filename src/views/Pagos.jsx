import "../styles/modulos.css";

function Pagos(){

    return(

        <>

        <h1>Pagos</h1>

        <table className="tabla-clientes">

            <thead>

                <tr>

                    <th>Cliente</th>

                    <th>Plan</th>

                    <th>Monto</th>

                    <th>Fecha</th>

                </tr>

            </thead>

            <tbody>

                <tr>

                    <td>Juan Perez</td>

                    <td>Mensual</td>

                    <td>S/.80</td>

                    <td>29/06/2026</td>

                </tr>

            </tbody>

        </table>

        </>

    )

}

export default Pagos;