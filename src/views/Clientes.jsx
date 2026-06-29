import { useEffect, useState } from "react";
import { obtenerClientes } from "../services/clienteService";

function Clientes() {

    const [clientes, setClientes] = useState([]);

    const listarClientes = async () => {

        const respuesta = await obtenerClientes();

        setClientes(respuesta.data);

    };

    useEffect(() => {

        listarClientes();

    }, []);

    return (
        <div>

            <h1>Clientes</h1>

            {
                clientes.map(cliente => (

                    <p key={cliente.id}>

                        {cliente.nombre}

                    </p>

                ))
            }

        </div>
    );
}

export default Clientes;