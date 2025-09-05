export default function ConfirmPasswordHasBeenUpdated() {
  const subject = `Contraseña Actualizada`;
  const bodyTemplate = `
    <h1>Contraseña Actualizada</h1>
    <p>Su contraseña ha sido actualizada exitosamente.</p>
  `;
  return { subject, bodyTemplate };
}
