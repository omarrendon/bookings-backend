// Interfaces
import { IReservationDetails } from "./EmailInterface";
// Utils
import {
  convertUTCDateToLocal,
  getFormattedHour,
  getFormattedLocalDate,
} from "../../../utils/dateUtils";

export default function bookingCancelationTemplate(
  reservationDetails: IReservationDetails
) {
  const { startTime, businessName, name } = reservationDetails;

  const utcFormattedDate = convertUTCDateToLocal(startTime);
  const reservationDate = getFormattedLocalDate(utcFormattedDate);
  const reservationHour = getFormattedHour(utcFormattedDate);

  const subject = `Reserva cancelada - ${businessName}`;
  const returnBody = `
    <h1>Cancelación de Reserva</h1>
    <p>Estimado ${name},</p>
    <p>Su reserva ha sido cancelada.</p>
    <p>Detalles de la reserva:</p>
    <ul>
      <li>Fecha: ${reservationDate}</li>
      <li>Hora: ${reservationHour}</li>
    </ul>
  `;
  return { subject, bodyTemplate: returnBody };
}
