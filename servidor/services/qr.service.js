const QRCode = require("qrcode");

/**
 * Genera el QR como imagen base64 (data URL), lista para mostrar en <img src="..." />
 * o para imprimir como carnet del cliente.
 * El contenido del QR es solo el UUID (Cliente.qrCode) — el backend es quien decide
 * qué significa ese código al validarlo, así que no expone datos sensibles.
 */
async function generarImagenQR(qrCode) {
  return QRCode.toDataURL(qrCode, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 300,
  });
}

module.exports = { generarImagenQR };
