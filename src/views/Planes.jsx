import "../styles/modulos.css";

function Planes(){

    const planes=[

        {
            nombre:"Mensual",
            precio:"80"
        },

        {
            nombre:"Trimestral",
            precio:"210"
        },

        {
            nombre:"Semestral",
            precio:"390"
        },

        {
            nombre:"Anual",
            precio:"720"
        }

    ];

    return(

        <>

        <h1>Planes</h1>

        <div className="grid">

            {

                planes.map((plan,index)=>(

                    <div
                    className="modulo-card"
                    key={index}
                    >

                        <h2>{plan.nombre}</h2>

                        <h3>S/. {plan.precio}</h3>

                        <button>

                            Ver Detalle

                        </button>

                    </div>

                ))

            }

        </div>

        </>

    )

}

export default Planes;