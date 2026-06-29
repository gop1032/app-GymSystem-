import { useEffect, useState } from "react";
import ClienteForm from "../components/ClienteForm";
import ClienteTable from "../components/ClienteTable";
import { obtenerClientes, crearCliente,eliminarCliente } from "../services/clienteService";

import "../styles/clientes.css";

function Clientes() {

    const [clientes, setClientes] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const listarClientes = async () => {
        const res = await obtenerClientes();
        setClientes(res.data);
    };

    useEffect(() => {
        listarClientes();
    }, []);

    const guardarCliente = async (cliente) => {
        await crearCliente(cliente);
        listarClientes();
    };
    const eliminar = async (id) => {
        if(!window.confirm("¿Eliminar cliente?")) return;
         await eliminarCliente(id);
         listarClientes();
    };
    const clientesFiltrados = clientes.filter(cliente =>
     cliente.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
     cliente.dni.includes(buscar)
    );
    return (
        <>

            <div className="cards-clientes">

                <div className="card">
                    <h4>Total Clientes</h4>
                    <h2>{clientes.length}</h2>
                </div>

                <div className="card">
                    <h4>Activos</h4>
                    <h2>
                        {clientes.filter(c => c.estado === "Activo").length}
                    </h2>
                </div>

                <div className="card">
                    <h4>Mensuales</h4>
                    <h2>
                        {clientes.filter(c => c.plan === "Mensual").length}
                    </h2>
                </div>

                <div className="card">
                    <h4>Anuales</h4>
                    <h2>
                        {clientes.filter(c => c.plan === "Anual").length}
                    </h2>
                </div>

            </div>
    <h1 className="titulo">

    Gestión de Socios

    </h1>
            <div className="toolbar">

    <input
        type="text"
        placeholder="Buscar socio..."
        value={buscar}
        onChange={(e)=>setBuscar(e.target.value)}
    />

    <button
        className="btn-nuevo"
        onClick={()=>setMostrarFormulario(!mostrarFormulario)}
    >

        + Nuevo Socio

    </button>

</div>

            {
mostrarFormulario &&

<div className="modal">

    <div className="modal-content">

        <ClienteForm
            onGuardar={guardarCliente}
            cerrar={()=>setMostrarFormulario(false)}
        />

    </div>

</div>

}

            <ClienteTable
                     clientes={clientesFiltrados}
                     eliminar={eliminar}
            />

        </>
    );
}

export default Clientes;