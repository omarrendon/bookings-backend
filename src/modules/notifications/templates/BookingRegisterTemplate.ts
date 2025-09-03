export interface IReservationDetails {
  date: string;
  time: string;
  name: string;
}

export default function registerReservationTemplate(
  reservationDetails: IReservationDetails
): { subject: string; bodyTemplate: string } {
  const { date, time, name } = reservationDetails;

  const subject = `¡Hola , ${name} tú reserva se ha realizado con éxito!`;
  const bodyTemplate = `
      <h1>Registro de Reserva</h1>
      <p>Gracias por registrarte para una reserva con nosotros. Aquí están los detalles de tu reserva:</p>
      <ul>
        <li>Fecha: ${date}</li>
        <li>Hora: ${time}</li>
        <li>Nombre: ${name}</li>
      </ul>
    `;
  return {
    subject,
    bodyTemplate,
  };
}
