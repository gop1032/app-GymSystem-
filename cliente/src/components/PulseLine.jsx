// Elemento de firma del sistema: una línea de pulso cardiaco, a medio camino
// entre "monitor de esfuerzo" y "línea de escaneo QR". Se usa en el login
// (grande, se dibuja sola) y en el sidebar (pequeña, como acento bajo el logo).
function PulseLine({ animated = false, className = "" }) {
  return (
    <svg
      className={`pulse-line ${animated ? "pulse-line--animated" : ""} ${className}`}
      viewBox="0 0 300 40"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 20 H90 L105 20 L115 4 L128 36 L138 20 L150 20 L160 8 L168 20 H300"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PulseLine;
