import { useEffect, useState } from "react";

function formatear(fecha) {
  const horaTexto = fecha.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const fechaTexto = fecha.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return { horaTexto, fechaTexto };
}

// Reloj en vivo, visible en todo el sistema (vive en el topbar del Layout).
// Se actualiza cada segundo para que "se note" que es la hora real.
function RelojEnVivo() {
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const { horaTexto, fechaTexto } = formatear(ahora);

  return (
    <div className="reloj-en-vivo">
      <span className="reloj-hora">{horaTexto}</span>
      <span className="reloj-fecha">{fechaTexto}</span>
    </div>
  );
}

export default RelojEnVivo;
