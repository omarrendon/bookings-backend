// Interfaces
import { IReservationDetails } from "./EmailInterface";
// Utils
import {
  convertUTCDateToLocal,
  getFormattedHour,
  getFormattedLocalDate,
} from "../../../utils/dateUtils";

export default function bookingConfirmationTemplate(
  reservationDetails: IReservationDetails
): { subject: string; bodyTemplate: string } {
  const { startTime, businessName, name } = reservationDetails;

  const utcFormattedDate = convertUTCDateToLocal(startTime);
  const reservationDate = getFormattedLocalDate(utcFormattedDate);
  const reservationHour = getFormattedHour(utcFormattedDate);

  const subject = `¡Hola, ${name}! Tu reserva se ha confirmado.`;
  const bodyTemplate = `
      <h1>Confirmación de Reserva en ${businessName}</h1>
      <p>Gracias por reservar con nosotros. Aquí están los detalles de tu reserva:</p>
      <ul>
        <li>Fecha: ${reservationDate}</li>
        <li>Hora: ${reservationHour}</li>
        <li>Nombre: ${name}</li>
      </ul>
    `;
  return {
    subject,
    bodyTemplate,
  };
}
