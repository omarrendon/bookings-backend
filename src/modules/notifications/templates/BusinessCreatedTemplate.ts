export default function businessCreatedTemplate(businessName: string): {
  subject: string;
  bodyTemplate: string;
} {
  const subject = `¡Tu negocio "${businessName}" fue creado con éxito!`;
  const bodyTemplate = `
    <h2>¡Felicidades!</h2>
    <p>Tu negocio <strong>${businessName}</strong> ya está registrado en nuestra plataforma.</p>
    <p>Ya puedes empezar a configurar tus servicios, horarios y recibir reservaciones.</p>
  `;
  return { subject, bodyTemplate };
}
