// Utils
import {
  getFormattedHour,
  getFormattedLocalDate,
} from "../../../utils/dateUtils";
// Interfaces
import { IReservationDetails } from "./EmailInterface";

export default function registerReservationTemplate(
  reservationDetails: IReservationDetails
): {
  subject: string;
  bodyTemplate: string;
} {
  const { startTime, name, businessName } = reservationDetails;
  const reservationDate = getFormattedLocalDate(startTime);
  const reservationHour = getFormattedHour(startTime);

  const subject = `¡Hola, ${name}! tu reserva se ha realizado con éxito`;
  const bodyTemplate = `
      <h1>Registro de Reserva</h1>
      <p>Gracias por registrarte en ${businessName} para una reserva con nosotros. Aquí están los detalles de tu reserva:</p>
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
