import { IReservationDetails } from "./EmailInterface";
import {
  convertUTCDateToLocal,
  getFormattedHour,
  getFormattedLocalDate,
} from "../../../utils/dateUtils";

export default function bookingRescheduleTemplate(
  reservationDetails: IReservationDetails,
): { subject: string; bodyTemplate: string } {
  const { startTime, endTime, businessName, name } = reservationDetails;

  const utcFormattedStart = convertUTCDateToLocal(startTime);
  const utcFormattedEnd = endTime ? convertUTCDateToLocal(endTime) : null;
  const reservationDate = getFormattedLocalDate(utcFormattedStart);
  const reservationStartHour = getFormattedHour(utcFormattedStart);
  const reservationEndHour = utcFormattedEnd ? getFormattedHour(utcFormattedEnd) : null;

  const subject = `¡Hola, ${name}! Tu cita ha sido reprogramada.`;
  const bodyTemplate = `
    <h1>Reprogramación de Cita en ${businessName}</h1>
    <p>Tu cita ha sido reprogramada y confirmada. Aquí están los nuevos detalles:</p>
    <ul>
      <li><strong>Fecha:</strong> ${reservationDate}</li>
      <li><strong>Hora de inicio:</strong> ${reservationStartHour}</li>
      ${reservationEndHour ? `<li><strong>Hora de fin:</strong> ${reservationEndHour}</li>` : ""}
      <li><strong>Nombre:</strong> ${name}</li>
      <li><strong>Negocio:</strong> ${businessName}</li>
    </ul>
    <p>Si tienes alguna duda, comunícate directamente con el negocio.</p>
  `;

  return { subject, bodyTemplate };
}
