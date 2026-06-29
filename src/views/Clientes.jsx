import "../styles/Clientes.css";

import { useEffect, useState } from "react";
import {obtenerClientes,crearCliente,} from "../services/clienteService";
import ClienteForm from "../components/ClienteForm";
import ClienteTable from "../components/ClienteTable";

function Clientes() {

    const [clientes, setClientes] = useState([]);

    const listarClientes = async () => {

        const respuesta = await obtenerClientes();

        setClientes(respuesta.data);

    };
    const guardarCliente = async (cliente) => {
    try {
        await crearCliente(cliente);

        await listarClientes();

        alert("Cliente registrado correctamente.");
    } catch (error) {
        console.error(error);

        alert("Ocurrió un error al registrar el cliente.");
    }
    };

    useEffect(() => {

        listarClientes();

    }, []);

    return (
    <div className="clientes-container">
        <h1>Gestion de Clientes</h1>
        <ClienteForm
        onGuardar={guardarCliente}
        />
        <br />
        <ClienteTable
         clientes={clientes}
        />
    </div>
);
}

export default Clientes;