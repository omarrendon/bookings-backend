export default function passwordResetTemplate(resetLink: string) {
  const subject = `Rescuperación de contraseña`;
  const bodyTemplate = `
    <p>Haz clic en el siguinete enlace para establecer tu nueva contraseña.</p>
    <a href="${process.env.HOST}/${resetLink}">${resetLink}</a>
  `;
  return { subject, bodyTemplate };
}
