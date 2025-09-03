import { IReservationDetails } from "./BookingRegisterTemplate";

export default function bookingConfirmationTemplate(
  reservationDetails: IReservationDetails
): { subject: string; bodyTemplate: string } {
  const { date, time, name } = reservationDetails;

  const subject = `¡Hola, ${name}! Tu reserva se ha confirmado.`;
  const bodyTemplate = `
      <h1>Confirmación de Reserva</h1>
      <p>Gracias por reservar con nosotros. Aquí están los detalles de tu reserva:</p>
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
