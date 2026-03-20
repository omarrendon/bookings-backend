// Interfaces
import { IReservationDetails } from "./EmailInterface";
// Utils
import {
  getFormattedHour,
  getFormattedLocalDate,
} from "../../../utils/dateUtils";

export default function clientCancelledReservationTemplate(
  reservationDetails: IReservationDetails
): { subject: string; bodyTemplate: string } {
  const { businessName, name, startTime } = reservationDetails;

  const formattedDate = getFormattedLocalDate(startTime);
  const formattedTime = getFormattedHour(startTime);

  const subject = `Reservación cancelada — ${businessName}`;
  const bodyTemplate = `
    <h2>${businessName} — Reservación Cancelada</h2>
    <p>La reservación de <strong>${name}</strong> para el ${formattedDate} a las ${formattedTime} ha sido cancelada.</p>
  `;
  return { subject, bodyTemplate };
}
