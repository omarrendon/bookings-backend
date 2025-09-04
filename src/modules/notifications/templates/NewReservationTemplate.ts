// Interfaces
import { IReservationDetails } from "./EmailInterface";
// Utils
import {
  convertUTCDateToLocal,
  getFormattedHour,
  getFormattedLocalDate,
} from "../../../utils/dateUtils";

export default function newReservationTemplate(
  reservationDetails: IReservationDetails
) {
  const { startTime, businessName, name } = reservationDetails;

  const utcFormattedDate = convertUTCDateToLocal(startTime);
  const reservationDate = getFormattedLocalDate(utcFormattedDate);
  const reservationHour = getFormattedHour(utcFormattedDate);

  const subject = `Nueva Reserva en ${businessName}`;
  const bodyTemplate = `
    <p>Haz recibido una nueva reserva.</p>
    <p>Detalles de la reserva:</p>
    <ul>
      <li>Fecha y hora: ${reservationDate} - ${reservationHour}</li>
      <li>Nombre de la persona: ${name}</li>
    </ul>
  `;
  return { subject, bodyTemplate };
}
