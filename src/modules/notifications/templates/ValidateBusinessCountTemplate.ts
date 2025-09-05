export default function validateBusinessCountTemplate(userId: string) {
  const subject = `Cuenta creada exitosamente.`;
  const bodyTemplate = `
    <h1>Tu cuenta ha sido creada exitosamente.</h1>
    <p>Para empezar con la configuración de tu negocio, haz clic en el siguiente botón o copia y pega la URL en tu navegador:</p>
    <button>
      <a href="https://tu-enlace-de-configuracion.com/${userId}">Configurar mi negocio</a>
    </button>
    <a href="https://tu-enlace-de-configuracion.com/${userId}">https://tu-enlace-de-configuracion.com/${userId}</a>
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    <p>¡Gracias por elegirnos!</p>
  `;
  return { subject, bodyTemplate };
}
