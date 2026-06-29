import { useState } from "react";

function ClienteForm({onGuardar}) {

    const [cliente, setCliente] = useState({
        nombre: "",
        dni: "",
        telefono: "",
        correo: "",
        plan: "",
        estado: "Activo",
    });

    const handleChange = (e) => {
        setCliente({
            ...cliente,
            [e.target.name]: e.target.value,
        });
    };
const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        cliente.nombre.trim() === "" ||
        cliente.dni.trim() === ""
    ) {
        alert("Nombre y DNI son obligatorios.");
        return;
    }

    await onGuardar(cliente);

    setCliente({
        nombre: "",
        dni: "",
        telefono: "",
        correo: "",
        plan: "",
        estado: "Activo",
    });
};

    return (
        <div className="cliente-form">
            <h2>Registrar Cliente</h2>
            <form onSubmit={handleSubmit}>
                <label>Nombre</label>
                <br />
                <input className="input-control"
                    type="text"
                    name="nombre"
                    value={cliente.nombre}
                    onChange={handleChange}
                />
                <br /><br />
                <label>DNI</label>
                <br />
                <input className="input-control"
                    type="text"
                    name="dni"
                    value={cliente.dni}
                    onChange={handleChange}
                />
                <br /><br />
                <label>Teléfono</label>
                <br />
            <input className="input-control"
               type="text"
              name="telefono"
             value={cliente.telefono}
             onChange={handleChange}
            />
            <label>Correo</label>
            <br />
        <input className="input-control"
             type="email"
              name="correo"
                value={cliente.correo}
              onChange={handleChange}
        />       
<br /><br />  
        <label>Plan</label>
        <br />

    <select className="input-control"
        name="plan"
      value={cliente.plan}
      onChange={handleChange}
    >
    <option value="">Seleccione</option>
    <option value="Mensual">
        Mensual
    </option>
    <option value="Trimestral">
        Trimestral
    </option>
    <option value="Anual">
        Anual
    </option>
    </select>
<br /><br />  
    <label>Estado</label>
    <br />
<select className="input-control"
    name="estado"
    value={cliente.estado}
    onChange={handleChange}
>
    <option value="Activo">
        Activo
    </option>
    <option value="Suspendido">
        Suspendido
    </option>
</select>
<br /><br />
            <br /><br />
                <button className="btn-registrar">
                    Registrar
                </button>
            </form>
        </div>
    );
}

export default ClienteForm;