export function buildResetPasswordEmail(name, resetUrl) {
  return {
    subject: 'Recuperación de contraseña - GymSystem',
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2>Hola ${name || 'usuario'}</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña en GymSystem.</p>
        <p><a href="${resetUrl}" style="background:#1e40af;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Restablecer contraseña</a></p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
      </div>
    `
  }
}
